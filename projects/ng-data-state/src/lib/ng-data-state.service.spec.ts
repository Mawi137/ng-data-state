import { TestBed } from '@angular/core/testing';

import { NgDataStateService } from './ng-data-state.service';

describe('NgDataStateService', () => {
  let service: NgDataStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgDataStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
