import { TestBed, async, inject } from '@angular/core/testing';

import { PassportGuard } from './passport.guard';

describe('PassportGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PassportGuard]
    });
  });

  it('should ...', inject([PassportGuard], (guard: PassportGuard) => {
    expect(guard).toBeTruthy();
  }));
});
