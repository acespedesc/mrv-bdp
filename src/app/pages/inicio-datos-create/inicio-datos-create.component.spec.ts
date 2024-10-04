import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioDatosCreateComponent } from './inicio-datos-create.component';

describe('InicioDatosCreateComponent', () => {
  let component: InicioDatosCreateComponent;
  let fixture: ComponentFixture<InicioDatosCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioDatosCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioDatosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
