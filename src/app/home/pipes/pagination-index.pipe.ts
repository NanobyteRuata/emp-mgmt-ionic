import { Pipe, PipeTransform } from '@angular/core';
import { PaginatorComponent } from '../components/paginator/paginator.component';

@Pipe({
  name: 'paginationIndex',
})
export class PaginationIndexPipe implements PipeTransform {
  transform(value: number, paginator: PaginatorComponent): unknown {
    return value + 1 + paginator.pageSize * (paginator.currentPage - 1);
  }
}
