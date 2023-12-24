//Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

//PrimeNg

//Models

//Services
import { LayoutService } from 'src/app/layout/service/app.layout.service';

//Store
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CompanyState } from 'src/app/stores/dropdown-select-company/dropdown-select-company.reducer';
import { AuthState } from 'src/app/stores/auth/authentication.reducer';

//Libraies
import * as moment from 'moment';

//Utils
import Formatter from 'src/app/utils/formatters';
import { AuthService } from '../../../services/auth.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { UploadService } from 'src/app/services/upload.service';
import { FileUpload, FileUploadEvent, UploadEvent } from 'primeng/fileupload';

@Component({
    templateUrl: './attendance-home.component.html',
    styleUrls: ['./attendance-home.component.scss'],
})
export class AttendanceHomeComponent implements OnInit, OnDestroy {
    @ViewChild('fileUpload') fileUpload: FileUpload;

    authState$: Observable<AuthState>;

    //Language
    locale: string;

    //Utils
    formatter!: Formatter;

    //Store
    subscription: Subscription;
    companyState$: Observable<CompanyState>;

    //Longiture latitude

    gpsLatitude;
    gpsLongitude;

    //Uplo

    //Variables

    menuItems: any;
    loading: boolean;
    attendanceData: any;

    storeUser: any;
    currentUser: any;
    currentCompany: any;

    selectedPlace: any;
    placesItems: any;

    selectedVehicle: any;
    vehiclesItems: any;

    checkInForm = this.fb.group({
        placeId: [''],
        vehicleId: [''],
    });
    currentPlaceMap: any;
    currentAddress: string;
    distanceBetween: number;
    isNearDistance: boolean = false;
    attendanceCheckIn: any;

    uploadedFiles: any[] = [];

    constructor(
        public fb: FormBuilder,
        public layoutService: LayoutService,
        private attendanceService: AttendanceService,
        private userService: UserService,
        private uploadService: UploadService,
        private router: Router,
        private store: Store<{ authState: AuthState }>,
    ) {
        //Init
        this.authState$ = store.select('authState');

        this.formatter = new Formatter();
    }

    ngOnInit(): void {
        this.getLocation();

        this.authState$.subscribe((authS) => {
            this.storeUser = authS?.user || '';
            this.loadServices(this.storeUser);
        });
        const layourServiceSubscription =
            this.layoutService.configUpdate$.subscribe(() => {
                this.loadServices(this.currentUser);
            });
        if (this.subscription) {
            this.subscription.add(layourServiceSubscription);
        }
    }

    loadServices(storeUser) {
        const attendanceServiceSubscription = this.attendanceService
            .getAttendanceByUser(storeUser.id)
            .subscribe((data) => {
                this.attendanceData = data;
                this.attendanceCheckIn = this.attendanceData?.attendance;
                if (this.attendanceCheckIn?.placeId) {
                    this.checkInForm.patchValue({
                        placeId: this.attendanceCheckIn?.placeId,
                    });
                }
                if (this.attendanceCheckIn?.vehicleId) {
                    this.checkInForm.patchValue({
                        vehicleId: this.attendanceCheckIn?.vehicleId,
                    });
                }
                if (this.attendanceCheckIn) {
                    this.checkInForm.controls['placeId'].disable({
                        onlySelf: true,
                    });
                    this.checkInForm.controls['vehicleId'].disable({
                        onlySelf: true,
                    });
                }

                this.loading = false;
            });
        const userServiceSubscription = this.userService
            .getUser(storeUser.id)
            .subscribe((data) => {
                this.currentUser = data;
                this.currentCompany = data?.companies[0];
                this.placesItems = data?.companies[0]?.places;
                this.vehiclesItems = data?.companies[0]?.vehicles;
                this.loading = false;
            });

        if (attendanceServiceSubscription && this.subscription)
            this.subscription.add(attendanceServiceSubscription);

        if (userServiceSubscription && this.subscription)
            this.subscription.add(userServiceSubscription);
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: any) => {
                    if (position) {
                        this.gpsLatitude = position.coords.latitude;
                        this.gpsLongitude = position.coords.longitude;
                        new google.maps.Geocoder()
                            .geocode({
                                location: {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                },
                            })
                            .then((response) => {
                                if (response.results[0]) {
                                    this.currentAddress =
                                        response.results[0].formatted_address;
                                } else {
                                    console.log('No results found');
                                }
                                this.currentPlaceMap = this.placesItems.filter(
                                    (place) =>
                                        place.id ===
                                        this.attendanceCheckIn?.placeId,
                                )[0];
                                this.calculateDistance();
                            })
                            .catch((e) =>
                                console.log('Geocoder failed due to: ' + e),
                            );
                    }
                },
                (error: any) => console.log(error),
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    onChangePlace(event) {
        this.currentPlaceMap = this.placesItems.filter(
            (place) => place.id === event.value,
        )[0];

        this.calculateDistance();
    }

    calculateDistance() {
        this.distanceBetween = this.getDistanceFromLatLonInKm(
            this.gpsLatitude,
            this.gpsLongitude,
            this.currentPlaceMap?.latitude,
            this.currentPlaceMap?.longitude,
        );
        this.isNearDistance = this.distanceBetween < 0.3; //300 metri
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    saveCheckIn() {
        this.attendanceService
            .checkInAttendance(
                this.currentUser?.id,
                this.currentCompany?.id,
                this.checkInForm.value.placeId,
                this.checkInForm.value.vehicleId,
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_LANDING_HOME]),
            );
    }
    saveCheckOut() {
        const formData = new FormData();

        for (let file of this.uploadedFiles) {
            formData.append('files', file);
        }

        //TARGA
        const licensePlate = this.vehiclesItems.find(
            (vehicle) => vehicle.id === this.selectedVehicle,
        ).licensePlate;

        const checkInId = this.attendanceCheckIn?.id;
        formData.append('checkInId', checkInId);
        formData.append('licensePlate', licensePlate);

        this.uploadService.uploadAttendanceImages(formData).subscribe(
            (response) => {},
            (error) => {},
        );

        this.attendanceService
            .checkOutAttendance(
                this.attendanceCheckIn?.id,
                this.currentUser?.id,
            )
            .subscribe((res) =>
                this.router.navigate([ROUTES.ROUTE_LANDING_HOME]),
            );
    }

    //Upload Image
    uploadFiles(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }
    remove(event: Event, file: any) {
		const index: number = this.uploadedFiles.indexOf(file);
		this.fileUpload.remove(event, index);
	}
    
    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
