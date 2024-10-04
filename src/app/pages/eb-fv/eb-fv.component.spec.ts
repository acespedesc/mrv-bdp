import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbFvComponent } from './eb-fv.component';

describe('EbFvComponent', () => {
  let component: EbFvComponent;
  let fixture: ComponentFixture<EbFvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbFvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbFvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
