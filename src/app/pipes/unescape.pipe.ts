import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'unescape',
    standalone: true,
})
export class UnescapePipe implements PipeTransform {
    transform(value: string): string {
        const doc = new DOMParser().parseFromString(value, 'text/html');

        return doc.documentElement.textContent as string;
    }
}
