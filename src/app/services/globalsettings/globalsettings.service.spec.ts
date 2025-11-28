import { TestBed } from '@angular/core/testing';

import { GlobalsettingsService } from './globalsettings.service';

describe('GlobalsettingsService', () => {
  let service: GlobalsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
