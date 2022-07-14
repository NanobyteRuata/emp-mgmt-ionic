import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../models/employee';
import { Filterables } from '../models/filterables';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private database: SQLiteObject;
  dbReady = new BehaviorSubject(false);

  constructor(private sqlite: SQLite) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    await this.openDatabase();
    await this.createTable();
    this.dbReady.next(true);
  }

  async openDatabase(): Promise<void> {
    try {
      this.database = await this.sqlite.create({
        name: 'employees.db',
        location: 'default',
      });
    } catch (e) {
      console.log('Open Database Error: ', JSON.stringify(e));
    }
  }

  async query(query: string, errorPrefix: string, options = []) {
    try {
      return await this.database.executeSql(query, options);
    } catch (e) {
      console.log(`${errorPrefix}: `, JSON.stringify(e));
    }
  }

  async createTable(): Promise<void> {
    await this.query(
      `create table if not exists employees(id INTEGER PRIMARY KEY, name CHAR(50), dob CHAR(50), department CHAR(50), position CHAR(50), mobile CHAR(100), nrc CHAR(50), salary INTEGER);`,
      'Create Table Error'
    );
  }

  async getExistingDepartments(): Promise<string[]> {
    let response = await this.query(
      `select department from employees group by department`,
      'Get Existing Departments Error'
    );

    let result = [];
    if (response.rows.length > 0) {
      for (let i = 0; i < response.rows.length; i++) {
        result.push(response.rows.item(i).department);
      }
    }
    return result;
  }

  async getExistingPositions(): Promise<string[]> {
    let response = await this.query(
      `select position from employees group by position`,
      'Get Existing Position Error'
    );

    let result = [];
    if (response.rows.length > 0) {
      for (let i = 0; i < response.rows.length; i++) {
        result.push(response.rows.item(i).position);
      }
    }
    return result;
  }

  async getEmployeesCount(): Promise<number> {
    let response = await this.query(
      `select id from employees`,
      'Get Employees By Page Error'
    );

    return response.rows.length;
  }

  async getEmployeesByPage(
    page: number = 1,
    size: number = 10,
    filterables: Filterables = null
  ): Promise<any> {
    let conditionStr = '';
    if (filterables) {
      let conditions = [];
      if (filterables.name.length > 0) {
        conditions.push(`name like "%${filterables.name}%"`);
      }
      if (filterables.department.length > 0) {
        conditions.push(`department = "${filterables.department}"`);
      }
      if (filterables.position.length > 0) {
        conditions.push(`position = "${filterables.position}"`);
      }

      if (conditions.length > 0) {
        conditionStr = 'where ' + conditions.join(' and ');
      }
    }

    let response = await this.query(
      `select * from employees ${conditionStr} limit ${
        (page - 1) * size
      },${size}`,
      'Get Employees By Page Error'
    );

    let result = [];
    if (response.rows.length > 0) {
      for (let i = 0; i < response.rows.length; i++) {
        result.push(response.rows.item(i));
      }
    }

    return result;
  }

  async getEmployeeById(id: number): Promise<Employee> {
    let response = await this.query(
      `select * from employees where id=${id}`,
      'Get Employees By Page Error'
    );

    let result = null;
    if (response.rows.length > 0) {
      result = response.rows.item(0);
    }

    return result;
  }

  async addEmployee(employee: Employee): Promise<Employee> {
    return await this.query(
      `insert into employees(name, dob, department, position, mobile, nrc, salary) values ("${employee.name}",
        "${employee.dob}",
        "${employee.department}",
        "${employee.position}",
        "${employee.mobile}",
        "${employee.nrc}",
        ${employee.salary})`,
      'Add Employee Error'
    );
  }

  async updateEmployee(employee: Employee): Promise<Employee> {
    return await this.query(
      `update employees set name = "${employee.name}",
      dob = "${employee.dob}",
      department = "${employee.department}",
      position = "${employee.position}",
      mobile = "${employee.mobile}",
      nrc = "${employee.nrc}",
      salary = ${employee.salary} where id=${employee.id}`,
      'Update Employee Error'
    );
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.query(
      `delete from employees where id=${id}`,
      'Delete Employee Error'
    );
  }
}
