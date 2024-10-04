import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecioFactorTasaCreateComponent } from './precio-factor-tasa-create.component';

describe('PrecioFactorTasaCreateComponent', () => {
  let component: PrecioFactorTasaCreateComponent;
  let fixture: ComponentFixture<PrecioFactorTasaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecioFactorTasaCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecioFactorTasaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
