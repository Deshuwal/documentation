import { TestBed } from '@angular/core/testing';
import { IntelligenceService } from './intelligence.service';

describe('IntelligenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntelligenceService = TestBed.get(IntelligenceService);
    expect(service).toBeTruthy();
  });
});
