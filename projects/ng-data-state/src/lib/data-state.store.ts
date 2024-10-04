import { signal } from '@angular/core';
import { DataState, LoadingStatus } from './interfaces/data-state.interface';
import { toDataState } from './utils/data-state.utils';
import { Observable, Subject } from 'rxjs';

export class DataStateStore<T> {

  protected readonly _state$ = signal<DataState<T>>({status: LoadingStatus.INITIAL});
  readonly state$ = this._state$.asReadonly();

  setState(state: DataState<T>): void {
    this._state$.set(state);
  }

  updateState(updateFn: (value: DataState<T>) => DataState<T>): void {
    this._state$.update(updateFn);
  }

  load(source$: Observable<T>, update = false): Observable<T> {
    const subject$ = new Subject<T>();
    source$
      .pipe(toDataState(update ? this.state$().data : undefined))
      .subscribe((state) => this.saveState(state, subject$));
    return subject$.asObservable();
  }

  private saveState(state: DataState<T>, subject$: Subject<T>): void {
    switch (state.status) {
      case LoadingStatus.INITIAL:
      case LoadingStatus.LOADING:
      case LoadingStatus.UPDATING:
        this._state$.set(state);
        break;
      case LoadingStatus.ERROR:
        subject$.error(state.error);
        subject$.complete();
        this._state$.set(state);
        break;
      case LoadingStatus.SUCCESS:
        subject$.next(state.data);
        subject$.complete();
        this._state$.set(state);
        break;
    }
  }
}
