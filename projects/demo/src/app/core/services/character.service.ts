import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(
    private http: HttpClient
  ) {
  }

  findById(id: string): Observable<Character> {
    return this.http.get<Character>(`https://anapioficeandfire.com/api/characters/${id}`);
  }

}
