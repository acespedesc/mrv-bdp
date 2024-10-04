import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvversionElegibleImgComponent } from './invversion-elegible-img.component';

describe('InvversionElegibleImgComponent', () => {
  let component: InvversionElegibleImgComponent;
  let fixture: ComponentFixture<InvversionElegibleImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvversionElegibleImgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvversionElegibleImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
