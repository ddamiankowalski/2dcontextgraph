import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartInterfaceComponent } from './chart-interface.component';

describe('ChartInterfaceComponent', () => {
  let component: ChartInterfaceComponent;
  let fixture: ComponentFixture<ChartInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartInterfaceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
