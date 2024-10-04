import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionesInstalacionComponent } from './regiones-instalacion.component';

describe('RegionesInstalacionComponent', () => {
  let component: RegionesInstalacionComponent;
  let fixture: ComponentFixture<RegionesInstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionesInstalacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionesInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
