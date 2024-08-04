import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GardenFormComponent } from './garden-form.component';

describe('GardenFormComponent', () => {
  let component: GardenFormComponent;
  let fixture: ComponentFixture<GardenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GardenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
