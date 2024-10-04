import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalOperacionComponent } from './capital-operacion.component';

describe('CapitalOperacionComponent', () => {
  let component: CapitalOperacionComponent;
  let fixture: ComponentFixture<CapitalOperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapitalOperacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitalOperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
