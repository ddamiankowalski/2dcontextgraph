import { TestBed } from '@angular/core/testing';

import { NgxCandlechartsService } from './ngx-candlecharts.service';

describe('NgxCandlechartsService', () => {
  let service: NgxCandlechartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCandlechartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
