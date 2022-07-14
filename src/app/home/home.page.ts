import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Employee } from '../models/employee';
import { DatabaseService } from '../services/database.service';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { Filterables } from '../models/filterables';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnDestroy {
  employees: Employee[] = [];
  totalEmployeesCount: number = 0;
  isLoading: boolean = true;
  filterables: Filterables = new Filterables();

  @ViewChild('paginator') paginator: PaginatorComponent;

  isFilterModalOpen: boolean = false;

  constructor(private databaseService: DatabaseService) {}

  ngAfterViewInit(): void {
    this.databaseService.dbReady.subscribe((isDbReady) => {
      if (isDbReady) {
        this.refreshEmployees();
      }
    });
  }

  // refresh employees whenever getting back from other page
  ionViewDidEnter() {
    this.databaseService.dbReady.getValue() && this.refreshEmployees();
  }

  async getEmployees() {
    this.employees = await this.databaseService.getEmployeesByPage(
      this.paginator.currentPage,
      this.paginator.pageSize,
      this.filterables
    );
  }

  async refreshEmployees(event = null) {
    this.isLoading = true;
    await this.getEmployees();
    await this.getEmployeesCount();
    this.isLoading = false;
    event?.target.complete();
  }

  async getEmployeesCount() {
    this.totalEmployeesCount = await this.databaseService.getEmployeesCount();
  }

  async onDeleteEmployee(id: number) {
    await this.databaseService.deleteEmployee(id);
    if (this.employees.length < 2) this.paginator.currentPage--; //go to previous page if last item in current page is deleted
    this.refreshEmployees();
  }

  onFilterClicked() {
    this.isFilterModalOpen = true;
  }

  get isFiltered() {
    return (
      this.filterables.name.length > 0 ||
      this.filterables.department.length > 0 ||
      this.filterables.position.length > 0
    );
  }

  clearFilter() {
    this.filterables = new Filterables();
    this.refreshEmployees();
  }

  onFilterModelClose(event): void {
    this.isFilterModalOpen = false;
    console.log('onFilterModelClose: ', JSON.stringify(event));
    if (event) {
      this.filterables = event;
      this.refreshEmployees();
    }
  }

  ngOnDestroy(): void {
    this.databaseService.dbReady.unsubscribe();
  }
}
