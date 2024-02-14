import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchKeyword:string = '';

  constructor() { }
}
