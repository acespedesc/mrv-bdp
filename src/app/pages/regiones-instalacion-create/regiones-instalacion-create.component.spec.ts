import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionesInstalacionCreateComponent } from './regiones-instalacion-create.component';

describe('RegionesInstalacionCreateComponent', () => {
  let component: RegionesInstalacionCreateComponent;
  let fixture: ComponentFixture<RegionesInstalacionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionesInstalacionCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionesInstalacionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
