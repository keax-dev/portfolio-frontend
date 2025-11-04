import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'language',
  standalone: false
})
export class LanguagePipe implements PipeTransform {

  transform(object: any, key: string, language: string): any {

    switch (language) {
      case 'en':
        return object[key];
      case 'es':
        return object[key + '_es'];
    }

    return null;
  }

}
