# Angular Data State

A lightweight state management Angular library designed for simplicity and performance based on Angular Signals.

## How does it work


### State services

Data loaded from an API service usually has 3 states:
- Loading
- Success
- Error

This library wraps the Observables returned by for example HTTP calls in a so called `DataState<>`.
Each Observable will first emit with status `Loading` and then `Success` or `Error` depending on the result.
It stores the result in the `DataStateStore` class.
To create an actual state, an Angular service can be created that has an instance of the `DataStateStore`.

Here's an example of such a state service:

```typescript
@Injectable()
export class MyResourcesStateService {

  private readonly store = new DataStateStore<MyResource[]>();

  readonly state$ = this.store.state$;

  constructor(
    private myResourceApiService: MyResourceApiService
  ) {
  }

  load(update = false): Observable<MyResource[]> {
    const source$ = this.myResourceApiService.findAll();
    return this.store.load(source$, update);
  }
}
```

As shown in the example, a new instance of the `DataStateStore` is created in the state service.
A `load` method is provided to load the data.
This calls the `load` method on the `DataStateStore` by passing an Observable to it that completes.
Optionally the `update` flag can be passed to tell the store to keep existing data, rather than completely resetting the data.
The `state$` property is exposed which is a readonly Angular Signal.
It can be used by injecting the state service into a component.

The `load` method can be subscribed to when you are interested in the result or want to act on it when it is loaded.
For example to load a related resource that depends on it.
> This is optional, the data will be loaded when the method is called whether you subscribe or not.

Since this is an Angular service, you can choose where to provide it:
- Globally: 
  - Add `@Injectable({providedIn: 'root'})` to the state service
  - State will be kept as long as the application lives
- Route level: 
  - Add the state service as a provider to the route
  - State will be kept as long as the route is active (or child route)
- Component level: 
  - Add the state service as a provider to the component
  - State will be kept as long as the component lives

Like this you can easily create reusable global as well as component level states using the same structure.

### Using the state in the HTML

Inject the state service into the component and make the state available to the HTML.

```typescript
private readonly myResourcesStateService = inject(MyResourcesStateService);
readonly myResourcesState$ = this.myResourcesStateService.state$;
```

Next, the `myResourcesState$` signal can be used in the HTML.
This library offers three directives to make things easier:
- `*ifStateLoading`
- `*ifStateSuccess`
- `*ifStateError`

When put on an HTML tag, that part of the template will only be rendered when the data state's status equals the expected status of the used directive.
Here's an example:

```html
<ng-container *ngIf="myResourcesState$() as myResourcesState">
  <div *ifStateLoading="myResourcesState">Loading...</div>
  <div *ifStateSuccess="myResourcesState; let myResources">
    <div *ngFor="let myResource of myResources">
      {{ myResource.name }}
    </div>
  </div>
  <div *ifStateError="myResourcesState; let error">
    {{ error }}
    <button (click)="retry()" type="button">Retry</button>
  </div>
</ng-container>
```

### Combining data state

Suppose your component needs multiple states and you want to show a single loader until all of them are loaded.
For that, simply use the `combineDataState` function.
It takes a `Record<String, Signal<DataState<X>>` as input and will combine the data into one DataState with one status.
- If one state is in error => common status `Error`
- If one state is loading => common status `Loading`
- If all states are successful => common status `Success`

Example:
```typescript
readonly viewState$ = combineDataState({
  myResourceOne: this.myResourceOneStateService.state$,
  myResourceTwo: this.myResourceTwoStateService.state$
});
```
