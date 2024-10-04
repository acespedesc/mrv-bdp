import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaedecCreateComponent } from './caedec-create.component';

describe('CaedecCreateComponent', () => {
  let component: CaedecCreateComponent;
  let fixture: ComponentFixture<CaedecCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaedecCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaedecCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
