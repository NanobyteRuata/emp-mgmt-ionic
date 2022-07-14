import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { PaginationIndexPipe } from './pipes/pagination-index.pipe';
import { EmployeeListItemComponent } from './components/employee-list-item/employee-list-item.component';
import { InternationalNumberPipe } from './pipes/international-number.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [
    HomePage,
    FilterModalComponent,
    PaginatorComponent,
    EmployeeListItemComponent,
    PaginationIndexPipe,
    InternationalNumberPipe,
  ],
})
export class HomePageModule {}
