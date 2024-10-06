import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HouseStateService } from '../../core/states/house-state.service';
import { combineDataState, IfStateLoadingDirective, IfStateSuccessDirective } from 'ng-data-state';
import { NgForOf, NgIf } from '@angular/common';
import { HouseMembersStateService } from '../../core/states/house-members-state.service';

@Component({
  template: `
    <ng-container *ngIf="viewState$() as state">
      <div *ifStateLoading="state">Loading...</div>
      <div *ifStateSuccess="state; let data">
        <h1>{{ data.house.name }}</h1>
        <h3>Members</h3>
        <div *ngFor="let member of data.members">
          {{member.name}}
        </div>
      </div>
    </ng-container>
  `,
  imports: [
    IfStateSuccessDirective,
    NgForOf,
    NgIf,
    IfStateLoadingDirective
  ],
  providers: [
    HouseStateService,
    HouseMembersStateService
  ],
  standalone: true
})
export class HouseDetailsPage implements OnChanges {

  private readonly houseStateService = inject(HouseStateService);
  private readonly houseMembersStateService = inject(HouseMembersStateService);

  readonly viewState$ = combineDataState({
    house: this.houseStateService.state$,
    members: this.houseMembersStateService.state$
  })

  @Input({required: true}) houseId!: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['houseId']) {
      this.houseStateService
        .load(this.houseId)
        .subscribe((house) => this.houseMembersStateService.load(house.swornMembers));
    }
  }
}
