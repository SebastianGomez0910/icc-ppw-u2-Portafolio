import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammerProfile } from './programmer-profile';

describe('ProgrammerProfile', () => {
  let component: ProgrammerProfile;
  let fixture: ComponentFixture<ProgrammerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrammerProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammerProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
