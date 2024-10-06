import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { House } from '../interfaces/house.interface';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  constructor(
    private http: HttpClient
  ) {
  }

  findAll(): Observable<House[]> {
    return this.http.get<House[]>('https://anapioficeandfire.com/api/houses?pageSize=20')
      .pipe(map(res => res.map(house => ({
        ...house,
        id: house.url.substring(house.url.lastIndexOf('/') + 1)
      }))));
  }

  findById(id: string): Observable<House> {
    return this.http.get<House>(`https://anapioficeandfire.com/api/houses/${id}`);
  }

}
