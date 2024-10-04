import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalInversionPatrimonioComponent } from './capital-inversion-patrimonio.component';

describe('CapitalInversionPatrimonioComponent', () => {
  let component: CapitalInversionPatrimonioComponent;
  let fixture: ComponentFixture<CapitalInversionPatrimonioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapitalInversionPatrimonioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitalInversionPatrimonioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
