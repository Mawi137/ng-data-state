import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DataState, LoadingStatus } from '../interfaces/data-state.interface';

@Directive({
  selector: '[ifStateLoading]',
  standalone: true
})
export class IfStateLoadingDirective {

  private hasView = false;

  @Input('ifStateLoading') set state(state: DataState<any>) {
    if (state.status === LoadingStatus.INITIAL || state.status === LoadingStatus.LOADING) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {
  }

}
