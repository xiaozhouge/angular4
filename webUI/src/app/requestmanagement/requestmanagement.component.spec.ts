import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestmanagementComponent } from './requestmanagement.component';

describe('RequestmanagementComponent', () => {
  let component: RequestmanagementComponent;
  let fixture: ComponentFixture<RequestmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
