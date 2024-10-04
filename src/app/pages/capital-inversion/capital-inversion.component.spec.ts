import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalInversionComponent } from './capital-inversion.component';

describe('CapitalInversionComponent', () => {
  let component: CapitalInversionComponent;
  let fixture: ComponentFixture<CapitalInversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapitalInversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitalInversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
