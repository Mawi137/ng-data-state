export enum LoadingStatus {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  UPDATING = 'UPDATING',
  ERROR = 'ERROR',
}

export type DataState<T> = SuccessState<T> | ErrorState<T> | LoadingState<T> | InitialState<T>;

export interface SuccessState<T> {
  status: LoadingStatus.SUCCESS | LoadingStatus.UPDATING;
  data: T;
}

export interface ErrorState<T> {
  status: LoadingStatus.ERROR;
  data?: T;
  error?: any;
}

export interface LoadingState<T> {
  status: LoadingStatus.LOADING;
  data?: T;
}

export interface InitialState<T> {
  status: LoadingStatus.INITIAL;
  data?: T;
}
