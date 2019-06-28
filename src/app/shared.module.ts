import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ThousandSuffixesPipe } from './services/shortkeys.pipe';

@NgModule({
  imports: [
    CommonModule, FormsModule, HttpClientModule, 
    BsDatepickerModule.forRoot()
  ],
  declarations: [ThousandSuffixesPipe],
  exports: [CommonModule, FormsModule, BsDatepickerModule, HttpClientModule,ThousandSuffixesPipe ],
})
export class SharedModule { }