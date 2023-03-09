import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCandlechartsComponent } from './ngx-candlecharts.component';

describe('NgxCandlechartsComponent', () => {
  let component: NgxCandlechartsComponent;
  let fixture: ComponentFixture<NgxCandlechartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxCandlechartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxCandlechartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
