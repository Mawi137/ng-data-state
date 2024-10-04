import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DataState, ErrorState, LoadingStatus } from '../interfaces/data-state.interface';

@Directive({
  selector: '[ifStateError]',
  standalone: true
})
export class IfStateErrorDirective<T> {

  private context?: IfStateErrorContext<T>;

  @Input('ifStateError') set state(state: DataState<T>) {
    if (state.status === LoadingStatus.ERROR) {
      if (!this.context) {
        this.context = new IfStateErrorContext(state);
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
    private templateRef: TemplateRef<IfStateErrorContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
  }

  static ngTemplateContextGuard<T>(dir: IfStateErrorDirective<T>, ctx: unknown): ctx is IfStateErrorContext<T> {
    return true;
  }

  static ngTemplateGuard_ifStateError<T>(dir: IfStateErrorDirective<T>, state: DataState<T>): state is ErrorState<T> {
    return state.status === LoadingStatus.ERROR;
  }

}

export class IfStateErrorContext<T> {

  public $implicit: any;
  public error: any;

  constructor(state: ErrorState<T>) {
    this.$implicit = state.error;
    this.error = state.error;
  }

  update(state: ErrorState<T>) {
    this.$implicit = state.error;
    this.error = state.error;
  }
}
