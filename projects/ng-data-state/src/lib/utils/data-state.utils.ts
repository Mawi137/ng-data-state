import { Observable, startWith, Subject, switchMap } from 'rxjs';
import { DataState, LoadingStatus } from '../interfaces/data-state.interface';
import { computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export function toDataState(oldData?: any) {
  return function <T>(source: Observable<T>): Observable<DataState<T>> {
    return new Observable<DataState<T>>(subscriber => {
      if (oldData) {
        subscriber.next({status: LoadingStatus.UPDATING, data: oldData});
      } else {
        subscriber.next({status: LoadingStatus.LOADING});
      }
      source.subscribe({
        next(data) {
          subscriber.next({status: LoadingStatus.SUCCESS, data});
        },
        error(error) {
          subscriber.next({status: LoadingStatus.ERROR, error});
        },
        complete() {
          subscriber.complete();
        }
      });
    });
  };
}

export function toDataStateSignal<T>(source$: Observable<T>, reloadTrigger$ = new Subject<void>()): Signal<DataState<T>> {
  return toSignal(
    reloadTrigger$.pipe(
      startWith(void 0),
      switchMap(() => source$.pipe(toDataState())),
    ),
    {initialValue: {status: LoadingStatus.INITIAL}}
  );
}

export function combineDataState<T extends Record<string, any>>(sources: { [K in keyof T]: Signal<DataState<T[K]>> }): Signal<DataState<{ [K in keyof T]: T[K] }>> {
  return computed(
    () => Object.entries(sources).reduce(
      (acc, [key, state$]: [string, Signal<DataState<any>>]) => {
        const state = state$();
        if (state.status === LoadingStatus.ERROR) {
          acc.status = LoadingStatus.ERROR;
        } else if (acc.status !== LoadingStatus.ERROR) {
          if (state.status === LoadingStatus.INITIAL || state.status === LoadingStatus.LOADING || acc.status === LoadingStatus.LOADING) {
            acc.status = LoadingStatus.LOADING;
          } else {
            acc.status = state.status;
          }
        }
        if (acc.data && state.data !== undefined) {
          acc.data[key as keyof T] = state.data;
        }
        if ('error' in acc && state.status === LoadingStatus.ERROR) {
          acc.error[key as keyof T] = state.error;
        }
        return acc;
      },
      {
        status: LoadingStatus.INITIAL,
        data: {} as { [K in keyof T]: T[K] },
        error: {} as { [K in keyof T]: any },
      } as DataState<{ [K in keyof T]: T[K] }>
    )
  );
}
