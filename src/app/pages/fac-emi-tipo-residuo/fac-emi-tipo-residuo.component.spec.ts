import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacEmiTipoResiduoComponent } from './fac-emi-tipo-residuo.component';

describe('FacEmiTipoResiduoComponent', () => {
  let component: FacEmiTipoResiduoComponent;
  let fixture: ComponentFixture<FacEmiTipoResiduoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacEmiTipoResiduoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacEmiTipoResiduoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
