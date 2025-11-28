import { TestBed } from '@angular/core/testing';

import { EmailService } from './emailservice.service';

describe('EmailService', () => {
  let service: EmailService;
EmailService
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
