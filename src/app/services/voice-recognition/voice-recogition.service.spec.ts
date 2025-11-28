import { TestBed } from '@angular/core/testing';

import { VoiceRecogitionService } from './voice-recogition.service';

describe('VoiceRecogitionService', () => {
  let service: VoiceRecogitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceRecogitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
