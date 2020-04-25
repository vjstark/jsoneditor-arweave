import { Component, Input} from '@angular/core';
import Arweave from 'arweave/web';
import { JsonEditorComponent } from 'ang-jsoneditor';


@Component({
  selector: 'arweave',
  templateUrl: './arweave.component.html'
})
export class ArweaveComponent {
  userKey: any;
  publicAddress: string = "";
  arweave;
  jsonList: any;
  isDataValid: boolean = true;
  showList: boolean = false;
  currentItem: any;
  @Input() data: any;
  @Input() editor: JsonEditorComponent;
  isSubmitting: boolean = false;

  constructor() {
    const apiConfig = {
      host: 'arweave.net',// Hostname or IP address for a Arweave host
      port: 443,          // Port
      protocol: 'https',  // Network protocol http or https
      timeout: 20000,     // Network request timeouts in milliseconds
      logging: false,     // Enable network request logging
    }
    this.arweave = Arweave.init(apiConfig);
  }

  handleFileInput(fileEle) {
    try {
      let file = fileEle.files.item(0);
      if (file!==undefined && /\.(json)$/i.test(file.name)) {
        const reader  = new FileReader()
        reader.onload = async (e)=>{
          let data = e.target.result.toString();
          const userKey = JSON.parse(data);
          this.userKey = userKey;
          const address = await this.arweave.wallets.jwkToAddress(userKey)
          this.publicAddress = address
         this.getJsons()
        }
        reader.readAsText(file)
      } else {
        alert("Invalid file")
      } 
    }
    catch (err) {
      console.log(err);
    }
  }

  async createTransaction(data){
    let transaction = await this.arweave.createTransaction({
        data
    }, this.userKey)
    transaction.addTag('appname', 'jsoneditor')
    await this.arweave.transactions.sign(transaction, this.userKey)
    const response = await this.arweave.transactions.post(transaction)
    this.editor.data = {}
    this.isSubmitting = false;
    return response
  }

  addJson(jsonData){
      this.createTransaction(JSON.stringify(jsonData))
      this.jsonList.push(JSON.stringify(jsonData))
  }

  
  checkJson() {
    try {
      this.data = this.editor.get()
      if(JSON.stringify(this.data)!=="{}"){
        this.isDataValid = true     
      } else {
        this.isDataValid = false;
      }

    }
    catch (err) {
      this.isDataValid = false
      alert('Invalid JSON')
    }
  }

  onSaveJson(){
    this.checkJson()
    if(this.isDataValid){ 
      this.isSubmitting = true;
      this.addJson(this.data)
    }
  }
  
  async getTransactionIds(){
    
    const txids = await this.arweave.arql({
      op: "and",
      expr1: {
        op: "equals",
        expr1: "from",
        expr2: this.publicAddress
      },
      expr2: {
        op: "equals",
        expr1: "appname",
        expr2: "jsoneditor"
      }
    })
    return txids
  }

  getTransaction(transactionId){
    return this.arweave.transactions.get(transactionId).then(transaction => {
      const transactionData = transaction.get('data', {decode: true, string: true})
      return transactionData
    })
  }

  async getJsons(){
    const txids = await this.getTransactionIds()
    const jsonDatas = await Promise.all(await txids.map(async(txid)=>{
      const transactionData = await this.getTransaction(txid)
      return transactionData
    }))
    this.jsonList = jsonDatas
    return jsonDatas
  }

  onShowList(){
    this.showList = true;
  }
  
  onHideList(){
    this.showList = false;
  }

  onClickJson(item){
    this.currentItem = JSON.stringify(JSON.parse(item), undefined, 2 );

  }
}