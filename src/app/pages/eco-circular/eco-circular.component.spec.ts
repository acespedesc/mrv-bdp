import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoCircularComponent } from './eco-circular.component';

describe('EcoCircularComponent', () => {
  let component: EcoCircularComponent;
  let fixture: ComponentFixture<EcoCircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoCircularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoCircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
