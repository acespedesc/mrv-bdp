import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinariaReciclajeComponent } from './maquinaria-reciclaje.component';

describe('MaquinariaReciclajeComponent', () => {
  let component: MaquinariaReciclajeComponent;
  let fixture: ComponentFixture<MaquinariaReciclajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaquinariaReciclajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaquinariaReciclajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
