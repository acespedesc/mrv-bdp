import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoCircularReporteComponent } from './eco-circular-reporte.component';

describe('EcoCircularReporteComponent', () => {
  let component: EcoCircularReporteComponent;
  let fixture: ComponentFixture<EcoCircularReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoCircularReporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoCircularReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
