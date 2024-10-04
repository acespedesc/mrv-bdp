import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiduoCreateComponent } from './residuo-create.component';

describe('ResiduoCreateComponent', () => {
  let component: ResiduoCreateComponent;
  let fixture: ComponentFixture<ResiduoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResiduoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResiduoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
