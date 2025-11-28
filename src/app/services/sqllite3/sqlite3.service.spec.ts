import { TestBed } from '@angular/core/testing';

import { sqliteDatabaseService } from './sqlite3.service';

describe('Sqlite3Service', () => {
  let service: sqliteDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(sqliteDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
