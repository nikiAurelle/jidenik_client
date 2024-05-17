import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatValue'
})
export class FormatValuePipe implements PipeTransform {

  transform(value: any ): unknown {
     if(value.length > 30){
    value = value.substring(0, 30) + "...";
  }

  return value
  }

}
