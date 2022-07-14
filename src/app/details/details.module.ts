import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import { IonicModule } from '@ionic/angular';

import { DetailsPageRoutingModule } from './details-routing.module';

import { DetailsPage } from './details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    ReactiveFormsModule,
    IonIntlTelInputModule,
  ],
  declarations: [DetailsPage],
  providers: [CurrencyPipe],
})
export class DetailsPageModule {}
