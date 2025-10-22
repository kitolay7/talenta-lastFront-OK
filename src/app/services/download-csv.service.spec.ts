import { TestBed } from '@angular/core/testing';

import { DownloadCsvService } from './download-csv.service';

describe('DownloadCsvService', () => {
  let service: DownloadCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
