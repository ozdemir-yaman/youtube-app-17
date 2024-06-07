import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChannelVideosComponent } from './main-channel-videos.component';

describe('MainChannelVideosComponent', () => {
  let component: MainChannelVideosComponent;
  let fixture: ComponentFixture<MainChannelVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainChannelVideosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainChannelVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
