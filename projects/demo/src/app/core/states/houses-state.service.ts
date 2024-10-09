import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HouseService } from '../services/house.service';
import { DataStateStore } from 'ng-data-state';
import { House } from '../interfaces/house.interface';

@Injectable()
export class HousesStateService {

  private readonly store = new DataStateStore<House[]>();

  readonly state$ = this.store.state$;

  constructor(
    private houseService: HouseService
  ) {
  }

  load(update = false): Observable<House[]> {
    const source$ = this.houseService.findAll();
    return this.store.load(source$, update);
  }
}
