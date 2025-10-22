import { TestBed } from '@angular/core/testing';

import { PostulationService } from './postulation.service';

describe('PostulationService', () => {
  let service: PostulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
