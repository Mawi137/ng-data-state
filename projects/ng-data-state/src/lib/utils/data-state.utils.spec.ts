import {
  DataState,
  ErrorState,
  InitialState,
  LoadingState,
  LoadingStatus,
  SuccessState
} from '../../core/interfaces/data-state.interface';
import { mergeMap, of, throwError } from 'rxjs';
import { combineDataState, toDataState } from './data-state.utils';
import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';

describe('DataStateUtils', () => {
  describe('toDataState', () => {
    it('should be loading then success', () => {
      const states: DataState<any>[] = [];
      of({name: 'kafka'})
        .pipe(toDataState())
        .subscribe(state => states.push(state));
      expect(states.length).toBe(2);
      expect(states[0].status).toEqual(LoadingStatus.LOADING);
      expect(states[0].data).toBeUndefined();
      expect((states[0] as any).error).toBeUndefined();
      expect(states[1].status).toEqual(LoadingStatus.SUCCESS);
      expect(states[1].data).toEqual({name: 'kafka'});
      expect((states[1] as any).error).toBeUndefined();
    });
    it('should be loading then error', () => {
      const states: DataState<any>[] = [];
      of({name: 'kafka'})
        .pipe(
          mergeMap(() => throwError(() => new Error('Failed'))),
          toDataState()
        )
        .subscribe(state => states.push(state));
      expect(states.length).toBe(2);
      expect(states[0].status).toEqual(LoadingStatus.LOADING);
      expect(states[0].data).toBeUndefined();
      expect((states[0] as any).error).toBeUndefined();
      expect(states[1].status).toEqual(LoadingStatus.ERROR);
      expect(states[1].data).toBeUndefined();
      expect((states[1] as any).error).toEqual(new Error('Failed'));
    });
  });

  describe('combineDataState', () => {

    it('should combine de data states - SUCCESS', () => {
      const sources = {
        eventHub: signal({status: LoadingStatus.SUCCESS, data: {name: 'kafka'}}),
        topics: signal({status: LoadingStatus.SUCCESS, data: {topics: [{name: 'orders'}]}})
      };
      const combined = combineDataState(sources)();
      expect(combined.status).toEqual(LoadingStatus.SUCCESS);
      expect(combined.data!['eventHub'].name).toEqual('kafka');
      expect(combined.data!['topics'].topics.length).toBe(1);
    });

    it('should combine de data states - ERROR', () => {
      const sources = {
        eventHub: signal({status: LoadingStatus.SUCCESS, data: {name: 'kafka'}} as SuccessState<any>),
        topics: signal({status: LoadingStatus.ERROR, error: new HttpErrorResponse({error: 'Failed to fetch'})} as ErrorState<any>)
      };
      const combined = combineDataState(sources)();
      expect(combined.status).toEqual(LoadingStatus.ERROR);
      expect(combined.data!['eventHub'].name).toEqual('kafka');
      expect((combined as any).error['topics'].error).toEqual('Failed to fetch');
    });

    it('should combine de data states - LOADING', () => {
      const sources = {
        eventHub: signal({status: LoadingStatus.SUCCESS, data: {name: 'kafka'}} as SuccessState<any>),
        topics: signal({status: LoadingStatus.LOADING} as LoadingState<any>)
      };
      const combined = combineDataState(sources)();

      expect(combined.status).toEqual(LoadingStatus.LOADING);
      expect(combined.data!['eventHub'].name).toEqual('kafka');
    });

    it('should combine de data states - INITIAL', () => {
      const sources = {
        eventHub: signal({status: LoadingStatus.INITIAL} as InitialState<any>),
        topics: signal({status: LoadingStatus.INITIAL} as InitialState<any>)
      };
      const combined = combineDataState(sources)();

      expect(combined.status).toEqual(LoadingStatus.LOADING);
    });
  });
});
