import { TestBed } from '@angular/core/testing';

import { MyblogsService } from './myblogs.service';

describe('MyblogsService', () => {
  let service: MyblogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyblogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
