import { TestBed } from '@angular/core/testing';

import { ManageTransactionService } from './manage-transaction-service';

describe('ManageTransactionService', () => {
  let service: ManageTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
