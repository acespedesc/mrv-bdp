import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaBaseCreateComponent } from './linea-base-create.component';

describe('LineaBaseCreateComponent', () => {
  let component: LineaBaseCreateComponent;
  let fixture: ComponentFixture<LineaBaseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineaBaseCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineaBaseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
