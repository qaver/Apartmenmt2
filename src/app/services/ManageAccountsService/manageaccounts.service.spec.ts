import { TestBed } from '@angular/core/testing';

import { ManageAccountsService } from './manageaccounts.service';

describe('ManageAccountsService', () => {
  let service: ManageAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
