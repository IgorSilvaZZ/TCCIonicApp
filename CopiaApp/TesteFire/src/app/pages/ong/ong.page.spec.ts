import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OngPage } from './ong.page';

describe('OngPage', () => {
  let component: OngPage;
  let fixture: ComponentFixture<OngPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OngPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
