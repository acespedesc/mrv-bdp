import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaedecComponent } from './caedec.component';

describe('CaedecComponent', () => {
  let component: CaedecComponent;
  let fixture: ComponentFixture<CaedecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaedecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaedecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
