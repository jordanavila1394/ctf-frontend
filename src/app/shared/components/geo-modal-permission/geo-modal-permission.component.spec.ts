import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoModalPermissionComponent } from './geo-modal-permission.component';

describe('GeoModalPermissionComponent', () => {
  let component: GeoModalPermissionComponent;
  let fixture: ComponentFixture<GeoModalPermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeoModalPermissionComponent]
    });
    fixture = TestBed.createComponent(GeoModalPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
