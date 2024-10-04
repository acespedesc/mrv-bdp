import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoCircularCreateComponent } from './eco-circular-create.component';

describe('EcoCircularCreateComponent', () => {
  let component: EcoCircularCreateComponent;
  let fixture: ComponentFixture<EcoCircularCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoCircularCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoCircularCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
