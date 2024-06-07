import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionBreakComponent } from './section-break.component';

describe('SectionBreakComponent', () => {
  let component: SectionBreakComponent;
  let fixture: ComponentFixture<SectionBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionBreakComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SectionBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
