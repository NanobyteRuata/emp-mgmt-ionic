import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  @Input('totalCount') totalCount: number;
  @Output('onChanged') onChanged = new EventEmitter();

  pageSizes = [5, 10, 30, 50, 100];
  pageSize: number = 5;
  currentPage: number = 1;
  get previousPage(): number {
    return this.currentPage < 2 ? null : this.currentPage - 1;
  }
  get nextPage(): number {
    return this.currentPage * this.pageSize >= this.totalCount
      ? null
      : this.currentPage + 1;
  }
  get maxPageNumber(): number {
    return parseInt(((this.totalCount - 1) / this.pageSize + 1).toString());
  }

  constructor() {}

  ngOnInit() {}

  pageSizeChanged(event): void {
    this.pageSize = Number(event.detail.value);
    this.currentPage = 1;
    this.onChanged.emit(this.pageSize);
  }

  firstPageClicked(): void {
    this.currentPage = 1;
    this.onChanged.emit(this.currentPage);
  }

  previousPageClicked(): void {
    this.currentPage--;
    this.onChanged.emit(this.currentPage);
  }

  nextPageClicked(): void {
    this.currentPage++;
    this.onChanged.emit(this.currentPage);
  }

  lastPageClicked(): void {
    this.currentPage = this.maxPageNumber;
    this.onChanged.emit(this.currentPage);
  }
}
