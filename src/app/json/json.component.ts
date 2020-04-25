import { Component, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'json',
  templateUrl: './json.component.html'
})
export class JsonComponent {
  public editorOptions: JsonEditorOptions;
  public data: any;
  public isDataValid: boolean = true;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
  
  constructor() { 
    this.data = {}
    this.editorOptions = new JsonEditorOptions()
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; 
      this.editorOptions.mode = 'code'; 
      this.editorOptions.onChange = ()=>{
        try {
          
        }
        catch (err) {
        }
      }
  }
 
}