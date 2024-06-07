import { Pipe, PipeTransform } from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

@Pipe({
    name: 'timeAgo',
    standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
    transform(value: string): string {
        return timeAgo.format(new Date(value));
    }
}
