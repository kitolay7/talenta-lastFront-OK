import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? value.replace(/<[^>]*>/g, '').trim() : '';
  }
}
