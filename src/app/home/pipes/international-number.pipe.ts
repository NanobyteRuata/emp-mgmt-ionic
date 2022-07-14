import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'internationalNumber',
})
export class InternationalNumberPipe implements PipeTransform {
  transform(value: string): unknown {
    return JSON.parse(value.replace(/'/g, '"')).internationalNumber;
  }
}
