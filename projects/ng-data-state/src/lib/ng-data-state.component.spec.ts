import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDataStateComponent } from './ng-data-state.component';

describe('NgDataStateComponent', () => {
  let component: NgDataStateComponent;
  let fixture: ComponentFixture<NgDataStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgDataStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgDataStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
