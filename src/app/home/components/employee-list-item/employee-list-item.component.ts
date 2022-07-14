import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-employee-list-item',
  templateUrl: './employee-list-item.component.html',
  styleUrls: ['./employee-list-item.component.scss'],
})
export class EmployeeListItemComponent implements OnInit {
  @Input('employee') employee: Employee;
  @Input('index') index: number;
  @Output('onDelete') onDelete = new EventEmitter();

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  async onDeleteEmployeeClicked() {
    let alert = await this.alertController.create({
      header: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => this.onDeleteEmployeeConfirmed(),
        },
      ],
    });

    await alert.present();
  }

  async onDeleteEmployeeConfirmed() {
    this.onDelete.emit(this.employee.id);
  }
}
