import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbCaComponent } from './eb-ca.component';

describe('EbCaComponent', () => {
  let component: EbCaComponent;
  let fixture: ComponentFixture<EbCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbCaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
