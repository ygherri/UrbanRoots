import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionListComponent } from './discussion-list.component';

describe('DiscussionListComponent', () => {
  let component: DiscussionListComponent;
  let fixture: ComponentFixture<DiscussionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
