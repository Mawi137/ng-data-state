import { Injectable, Signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { DataState, DataStateStore } from 'ng-data-state';
import { Character } from '../interfaces/character.interface';
import { CharacterService } from '../services/character.service';

@Injectable()
export class HouseMembersStateService {

  private readonly store = new DataStateStore<Character[]>();

  readonly state$: Signal<DataState<Character[]>> = this.store.state$;

  constructor(
    private characterService: CharacterService
  ) {
  }

  load(characterIds: string[], update = false): Observable<Character[]> {
    // Ideally the API provides a getMembersByHouse method, since this is not the case, forkJoin is used
    const source$ = forkJoin(
      characterIds
        .map((c) => c.substring(c.lastIndexOf('/') + 1))
        .map(id => this.characterService.findById(id))
    );
    return this.store.load(source$, update);
  }
}
