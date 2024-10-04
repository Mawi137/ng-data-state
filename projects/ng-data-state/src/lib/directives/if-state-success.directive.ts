import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DataState, LoadingStatus, SuccessState } from '../interfaces/data-state.interface';

@Directive({
  selector: '[ifStateSuccess]',
  standalone: true
})
export class IfStateSuccessDirective<T> {

  private context?: IfStateSuccessContext<T>;

  @Input('ifStateSuccess') set state(state: DataState<T>) {
    if (state.status === LoadingStatus.SUCCESS || state.status === LoadingStatus.UPDATING) {
      if (!this.context) {
        this.context = new IfStateSuccessContext(state);
        this.viewContainer.createEmbeddedView(this.templateRef, this.context);
      } else {
        this.context.update(state);
      }
    } else if (this.context) {
      this.viewContainer.clear();
      this.context = undefined;
    }
  }

  constructor(
    private templateRef: TemplateRef<IfStateSuccessContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
  }

  static ngTemplateContextGuard<T>(dir: IfStateSuccessDirective<T>, ctx: unknown): ctx is IfStateSuccessContext<T> {
    return true;
  }

  static ngTemplateGuard_ifStateSuccess<T>(dir: IfStateSuccessDirective<T>, state: DataState<T>): state is SuccessState<T> {
    return state.status === LoadingStatus.SUCCESS || state.status === LoadingStatus.UPDATING;
  }

}

export class IfStateSuccessContext<T> {
  public $implicit: T;
  public data: T;

  constructor(state: SuccessState<T>) {
    this.$implicit = state.data;
    this.data = state.data;
  }

  update(state: SuccessState<T>) {
    this.$implicit = state.data;
    this.data = state.data;
  }
}
