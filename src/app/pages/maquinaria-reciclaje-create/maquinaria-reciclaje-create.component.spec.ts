import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinariaReciclajeCreateComponent } from './maquinaria-reciclaje-create.component';

describe('MaquinariaReciclajeCreateComponent', () => {
  let component: MaquinariaReciclajeCreateComponent;
  let fixture: ComponentFixture<MaquinariaReciclajeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaquinariaReciclajeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaquinariaReciclajeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
