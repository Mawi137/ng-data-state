import { Component, inject, OnInit } from '@angular/core';
import { HousesStateService } from '../../core/states/houses-state.service';
import { IfStateLoadingDirective, IfStateSuccessDirective } from 'ng-data-state';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <h1>Houses</h1>
    <ng-container *ngIf="housesState$() as housesState">
      <div *ifStateLoading="housesState">Loading...</div>
      <div *ifStateSuccess="housesState; let houses">
        <div *ngFor="let house of houses!">
          <a [routerLink]="[house.id]">{{ house.name }}</a></div>
      </div>
    </ng-container>
  `,
  imports: [
    IfStateSuccessDirective,
    NgForOf,
    NgIf,
    RouterLink,
    IfStateLoadingDirective
  ],
  providers: [
    HousesStateService
  ],
  standalone: true
})
export class HousesPage implements OnInit {

  private readonly housesStateService = inject(HousesStateService);

  readonly housesState$ = this.housesStateService.state$;

  ngOnInit() {
    this.housesStateService.load();
  }
}
