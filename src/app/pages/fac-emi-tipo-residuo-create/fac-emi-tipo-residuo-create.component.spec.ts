import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacEmiTipoResiduoCreateComponent } from './fac-emi-tipo-residuo-create.component';

describe('FacEmiTipoResiduoCreateComponent', () => {
  let component: FacEmiTipoResiduoCreateComponent;
  let fixture: ComponentFixture<FacEmiTipoResiduoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacEmiTipoResiduoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacEmiTipoResiduoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
