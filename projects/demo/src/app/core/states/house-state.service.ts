import { Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HouseService } from '../services/house.service';
import { DataState, DataStateStore } from 'ng-data-state';
import { House } from '../interfaces/house.interface';

@Injectable()
export class HouseStateService {

  private readonly store = new DataStateStore<House>();

  readonly state$: Signal<DataState<House>> = this.store.state$;

  constructor(
    private houseService: HouseService
  ) {
  }

  load(houseId: string, update = false): Observable<House> {
    const source$ = this.houseService.findById(houseId);
    return this.store.load(source$, update);
  }
}
