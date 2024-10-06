import { Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HouseService } from '../services/house.service';
import { DataState, DataStateStore } from 'ng-data-state';
import { House } from '../interfaces/house.interface';

@Injectable()
export class HousesStateService {

  private readonly store = new DataStateStore<House[]>();

  readonly state$: Signal<DataState<House[]>> = this.store.state$;

  constructor(
    private manufacturersService: HouseService
  ) {
  }

  load(update = false): Observable<House[]> {
    const source$ = this.manufacturersService.findAll();
    return this.store.load(source$, update);
  }
}
