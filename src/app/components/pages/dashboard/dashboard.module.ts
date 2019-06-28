import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
// import { ThousandSuffixesPipe } from '../../../services/shortkeys.pipe';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    DashboardRoutingModule, SharedModule 
  ]
})
export class DashboardModule { }
