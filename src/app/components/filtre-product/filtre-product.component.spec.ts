import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreProductComponent } from './filtre-product.component';

describe('FiltreProductComponent', () => {
  let component: FiltreProductComponent;
  let fixture: ComponentFixture<FiltreProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltreProductComponent]
    });
    fixture = TestBed.createComponent(FiltreProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
