import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-geo-modal-permission',
    templateUrl: './geo-modal-permission.component.html',
    styleUrls: ['./geo-modal-permission.component.scss'],
})
export class GeoModalPermissionComponent implements OnInit {
    name = 'Angular';
    public lat;
    public lng;
    isModalVisible: boolean = false;

    public ngOnInit(): void {
        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: any) => {
                    this.isModalVisible = false;
                },
                (error: any) => (this.isModalVisible = true),
            );
        } else {
            this.isModalVisible = true;
        }
    }

    closeModal() {
        this.isModalVisible = false;
    }
}
