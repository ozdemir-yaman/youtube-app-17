import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChannelInfoComponent } from './main-channel-info.component';

describe('MainChannelInfoComponent', () => {
  let component: MainChannelInfoComponent;
  let fixture: ComponentFixture<MainChannelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainChannelInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainChannelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
