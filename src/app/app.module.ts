import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgJsonEditorModule } from 'ang-jsoneditor' 

import { AppComponent } from './app.component';
import { JsonComponent } from './json/json.component';
import { JsonListComponent } from './jsonlist/jsonlist.component';
import { ArweaveComponent } from './arweave/arweave.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgJsonEditorModule
  ],
  declarations: [
    AppComponent,
    ArweaveComponent,
    JsonComponent,
    JsonListComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
