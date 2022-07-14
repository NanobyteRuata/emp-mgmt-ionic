import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../models/employee';
import { DatabaseService } from '../services/database.service';
import { Validators } from '@angular/forms';
import { AlertController, IonPopover, NavController } from '@ionic/angular';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';
import { CurrencyPipe } from '@angular/common';
import { CurrencyUtils } from '../utils/currency.utils';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  type = 'new';
  get title(): string {
    return this.type == 'new' ? 'New Employee' : 'Edit Employee';
  }
  employee: Employee;
  employeeForm: FormGroup;
  defaultDate = '1987-06-30';

  departments: string[] = [];
  positions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private alertController: AlertController
  ) {
    this.employee = new Employee();
  }

  ngOnInit() {
    let employeeId = this.route.snapshot.params.id;
    if (employeeId) {
      this.type = 'edit';
    }
    this.databaseService.dbReady.subscribe(
      (isDbReady) => isDbReady && this.getFromDB(employeeId)
    );
  }

  async getFromDB(employeeId: number) {
    this.departments = await this.databaseService.getExistingDepartments();
    this.positions = await this.databaseService.getExistingPositions();
    employeeId && (await this.getEmployee(employeeId));
    this.initializeForm();
  }

  initializeForm() {
    this.employeeForm = this.formBuilder.group({
      name: [
        this.employee.name,
        [Validators.required, Validators.minLength(2)],
      ],
      dob: [this.employee.dob, [Validators.required, Validators.minLength(10)]],
      department: [
        this.employee.department,
        [Validators.required, Validators.minLength(2)],
      ],
      position: [
        this.employee.position,
        [Validators.required, Validators.minLength(2)],
      ],
      mobile: [
        this.employee.mobile.length > 0 &&
          JSON.parse(this.employee.mobile.replace(/'/g, '"')),
        [Validators.required, IonIntlTelInputValidators.phone],
      ],
      nrc: [this.employee.nrc, [Validators.required]],
      salary: [
        CurrencyUtils.format(this.employee.salary),
        [Validators.required],
      ],
    });
  }

  setSalaryValue(event) {
    let newValue: string = CurrencyUtils.format(
      this.employeeForm.controls.salary.value
    );
    this.employeeForm.get('salary').setValue(newValue);
  }

  async getEmployee(id: number): Promise<void> {
    this.employee = await this.databaseService.getEmployeeById(id);
  }

  setDobFromDatePicker(e, popover: IonPopover) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.employeeForm.get('dob').setValue(date, {
      onlyself: true,
    });
    popover.dismiss();
  }

  get nameErrorMessage() {
    if (this.employeeForm.controls.name.errors?.['required']) {
      return 'Name is required.';
    }
    if (this.employeeForm.controls.name.errors?.['minlength']) {
      return 'Name must be at least 2 characters long.';
    }
  }

  get dobErrorMessage() {
    if (this.employeeForm.controls.name.errors?.['required']) {
      return 'Date is required.';
    }
    if (this.employeeForm.controls.name.errors?.['minlength']) {
      return 'Invalid date.';
    }
  }

  get departmentErrorMessage() {
    if (this.employeeForm.controls.department.errors?.['required']) {
      return 'Department is required.';
    }
    if (this.employeeForm.controls.department.errors?.['minlength']) {
      return 'Department name must be at least 2 characters long.';
    }
  }

  get positionErrorMessage() {
    if (this.employeeForm.controls.position.errors?.['required']) {
      return 'Position is required.';
    }
    if (this.employeeForm.controls.position.errors?.['minlength']) {
      return 'Position name must be at least 2 characters long.';
    }
  }

  get mobileErrorMessage() {
    if (this.employeeForm.controls.mobile.errors?.['required']) {
      return 'Mobile is required.';
    }
    if (this.employeeForm.controls.mobile.errors?.['phone']) {
      return 'Invalid phone number.';
    }
  }

  get nrcErrorMessage() {
    if (this.employeeForm.controls.nrc.errors?.['required']) {
      return 'NRC is required.';
    }
    if (this.employeeForm.controls.nrc.errors?.['minlength']) {
      return 'NRC name must be at least 18 characters long.';
    }
  }

  get salaryErrorMessage() {
    if (this.employeeForm.controls.salary.errors?.['required']) {
      return 'Salary is required.';
    }
    if (this.employeeForm.controls.salary.errors?.['minlength']) {
      return 'Salary name must be at least 6 characters long.';
    }
  }

  get formControlDobValue() {
    return this.employeeForm.get('dob').value;
  }

  async onSubmit() {
    if (!this.employeeForm.valid) return false;

    let employee: Employee = {
      ...this.employeeForm.value,
      mobile: JSON.stringify(this.employeeForm.controls.mobile.value).replace(
        /"/g,
        "'"
      ),
      salary: Number(
        CurrencyUtils.unFormat(this.employeeForm.controls.salary.value)
      ),
    };

    if (this.type == 'new') {
      await this.databaseService.addEmployee(employee);
    } else {
      employee.id = this.employee.id;
      await this.databaseService.updateEmployee(employee);
    }

    let alert = await this.alertController.create({
      header: `Successfully ${
        this.type == 'new' ? 'created' : 'updated'
      } an employee`,
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
        },
      ],
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      this.navController.back();
    });
  }
}
