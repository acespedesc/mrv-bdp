import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecioFactorTasaComponent } from './precio-factor-tasa.component';

describe('PrecioFactorTasaComponent', () => {
  let component: PrecioFactorTasaComponent;
  let fixture: ComponentFixture<PrecioFactorTasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecioFactorTasaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecioFactorTasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
