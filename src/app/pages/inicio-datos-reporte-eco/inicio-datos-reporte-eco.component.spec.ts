import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioDatosReporteEcoComponent } from './inicio-datos-reporte-eco.component';

describe('InicioDatosReporteEcoComponent', () => {
  let component: InicioDatosReporteEcoComponent;
  let fixture: ComponentFixture<InicioDatosReporteEcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioDatosReporteEcoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioDatosReporteEcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
