import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveGardensComponent } from './approve-gardens.component';

describe('ApproveGardensComponent', () => {
  let component: ApproveGardensComponent;
  let fixture: ComponentFixture<ApproveGardensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveGardensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveGardensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
