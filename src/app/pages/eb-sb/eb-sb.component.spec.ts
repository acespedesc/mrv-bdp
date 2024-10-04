import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbSbComponent } from './eb-sb.component';

describe('EbSbComponent', () => {
  let component: EbSbComponent;
  let fixture: ComponentFixture<EbSbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbSbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbSbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
