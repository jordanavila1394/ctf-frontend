import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortByKeyAsc' })
export class SortByKeyAscPipe implements PipeTransform {
    transform(value: any): any[] {
        return Object.entries(value)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, val]) => ({ key, value: val }));
    }
}

@Pipe({ name: 'sortByKeyDesc' })
export class SortByKeyDescPipe implements PipeTransform {
    transform(value: any): any[] {
        return Object.entries(value)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([key, val]) => ({ key, value: val }));
    }
}
