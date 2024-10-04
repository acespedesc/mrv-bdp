import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioDatosComponent } from './inicio-datos.component';

describe('InicioDatosComponent', () => {
  let component: InicioDatosComponent;
  let fixture: ComponentFixture<InicioDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
