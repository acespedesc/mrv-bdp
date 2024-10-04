import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvversionElegibleComponent } from './invversion-elegible.component';

describe('InvversionElegibleComponent', () => {
  let component: InvversionElegibleComponent;
  let fixture: ComponentFixture<InvversionElegibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvversionElegibleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvversionElegibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
