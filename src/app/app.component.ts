import { Component } from '@angular/core';
import { Employee } from './models/employee';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private databaseService: DatabaseService) {
    // this.test();
  }

  async test() {
    await this.databaseService.addEmployee({
      name: 'Employee 1',
      dob: '12/12/1990',
      department: 'Sad Department',
      position: 'Sad Position',
      mobile: '09123123123',
      nrc: '12/ASOQWE(N)123123123',
      salary: 1000000,
    });

    let emp: Employee[] = await this.databaseService.getEmployeesByPage();
    console.log(emp);
  }
}
