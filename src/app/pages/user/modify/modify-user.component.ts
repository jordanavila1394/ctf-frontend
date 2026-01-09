import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgxGpAutocompleteService } from '@angular-magic/ngx-gp-autocomplete';

import { FormArray, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from 'src/app/utils/constants';
import { CompanyService } from 'src/app/services/company.service';
import { RoleService } from 'src/app/services/role.service';
import { ClientService } from 'src/app/services/client.service';
import { BranchService } from 'src/app/services/branch.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Subscription } from 'rxjs';
import { getData } from 'country-list';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationService } from 'src/app/utils/validators';

@Component({
    templateUrl: './modify-user.component.html',
    providers: [MessageService, ConfirmationService],
})
export class ModifyUserComponent implements OnInit {

    idUser: string;

    selectedLegalForm: any = null;
    selectedCeo: any = null;

    legalFormItems = [
        {
            name: 'Società a responsabilità limitata',
            id: 'Società a responsabilità limitata',
        },
        {
            name: 'Società per azioni',
            id: 'Società per azioni',
        },
    ];
    ceosItems: any;

    roles: any[];
    companies: any[];
    clients: any[];
    branches: any[];
    selectedRole: any;
    selectedCompany: any;
    selectedClient: any;
    selectedBranch: any;
    selectedPlace: any;
    placesItems: any;

    selectedVehicle: any;
    selectedPlaceAddress: any;
    vehiclesItems: any;

    companyId: any;

    attendanceData: any;
    attendanceCheckIn: any;

    subscription: Subscription;

    countryItems: { name: string; code: string }[] = [];

    modifyForm = this.fb.group({
        id: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        fiscalCode: ['', [Validators.required]],
        email: [''],
        cellphone: [''],
        roleId: ['', [Validators.required]],
        companyId: ['', [Validators.required]],
        workerNumber: [''],
        clientId: [null],
        branchId: [null],
        position: [''],
        address: [''],
        birthCountry: [''],
        birthDate: [''],
        hireDate: [''],
        iban: [''],
        status: [false, [Validators.required]],
    });

    changePasswordForm = this.fb.group(
        {
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: [
                '',
                [Validators.required, Validators.minLength(6)],
            ],
        },
        { validator: this.checkPasswords },
    );

    checkInForm = this.fb.group({
        placeId: null,
        vehicleId: null,
        checkInTime: [this.getTodayLocalTime('08:00'), Validators.required],
        checkOutTime: [this.getTodayLocalTime('17:40'), Validators.required],
    }, { validators: ValidationService.sameDayValidator() });


    pinMessage: string = '';
    hasPin: boolean = false;

    constructor(
        public fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ngxGpAutocompleteService: NgxGpAutocompleteService,
        private userService: UserService,
        private attendanceService: AttendanceService,
        private vehicleService: VehicleService,
        private messageService: MessageService,
        private companyService: CompanyService,
        public emailService: EmailService,
        private authService: AuthService,
        private roleService: RoleService,
        private clientService: ClientService,
        private branchService: BranchService,
    ) {
        this.ngxGpAutocompleteService.setOptions({
            componentRestrictions: { country: ['IT'] },
            types: ['geocode'],
        });
    }

    ngOnInit() {
        this.fetchCountries();
        this.loadServices();
    }

    // Validatore personalizzato per evitare stringhe vuote o solo spazi
    noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value.trim().length === 0) {
            return { whitespace: true };
        }
        return null;
    }

    getTodayLocalTime(time: string): Date {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        return now;
    }

    transform(value: Date): string {
        return value.toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
    }



    fetchCountries() {
        const allCountries = new getData();
        const priorityCountries = ['Italy', 'Peru', 'Ecuador', 'El Salvador'];

        // Add priority countries first
        priorityCountries.forEach((country) => {
            const foundCountry = allCountries.find((c) => c.name === country);
            if (foundCountry) {
                this.countryItems.push({
                    name: foundCountry.name,
                    code: foundCountry.code,
                });
            }
        });

        // Add remaining countries
        allCountries.forEach((country) => {
            if (!priorityCountries.includes(country.name)) {
                this.countryItems.push({
                    name: country.name,
                    code: country.code,
                });
            }
        });
    }

    loadServices() {
        this.clientService.getAllClients().subscribe((clients) => {
            this.clients = clients;
        });
        this.branchService.getAllBranches().subscribe((branches) => {
            this.branches = branches;
        });
        
        this.route.queryParams.subscribe((params) => {
            this.idUser = params['id'];
            this.modifyForm.patchValue({
                id: this.idUser,
            });
            this.userService.getUser(this.idUser).subscribe((user) => {
                this.companyId = user?.companies[0]?.id
                    ? user?.companies[0]?.id
                    : '';
                this.placesItems = user?.companies[0]?.places;
                this.vehiclesItems = user?.companies[0]?.vehicles;
                const roleId = user?.roles[0]?.id ? user.roles[0].id : '';

                const vehicleServiceSubscription = this.vehicleService
                    .getAllVehicles(0)
                    .subscribe((vehicles) => {
                        this.vehiclesItems = vehicles;
                    });
                if (vehicleServiceSubscription && this.subscription)
                    this.subscription.add(vehicleServiceSubscription);

                this.modifyForm.patchValue({
                    id: this.idUser,
                    name: user.name,
                    surname: user.surname,
                    fiscalCode: user.fiscalCode,
                    email: user.email,
                    cellphone: user.cellphone,
                    roleId: roleId,
                    companyId: this.companyId,
                    workerNumber: user.workerNumber,
                    clientId: user.clientId,
                    branchId: user.branchId,
                    position: user.position,
                    address: user.address,
                    iban: user.iban,
                    birthCountry: user.birthCountry,
                    birthDate: user.birthDate,
                    hireDate: user.hireDate,
                    status: user.status,
                });
                this.selectedClient = user.clientId;
                this.selectedBranch = user.branchId;
            });
            const attendanceServiceSubscription = this.attendanceService
                .getAttendanceByUser(this.idUser)
                .subscribe((data) => {
                    this.attendanceData = data;
                    this.attendanceCheckIn = this.attendanceData?.attendance;
                });
            if (attendanceServiceSubscription && this.subscription)
                this.subscription.add(attendanceServiceSubscription);

            this.modifyForm.controls['roleId'].disable({
                onlySelf: true,
            });
            this.authService.getUserPin(this.idUser).subscribe((pin) => {
                let resultPin = pin?.pin || '';
                if (resultPin) {
                    this.pinMessage = `PIN: ${pin.pin}`;
                    this.hasPin = true;
                } else {
                    this.pinMessage = "Non è stato generato un PIN per questo utente";
                    this.hasPin = false;
                }
            });
            // this.modifyForm.controls['companyId'].disable({ onlySelf: true });
        });

        this.userService.getAllCeos().subscribe((ceos) => {
            this.ceosItems = ceos.map((ceo) => ({
                ...ceo,
                fullName: ceo.name + ' ' + ceo.surname,
            }));
        });
        this.roleService.getAllRoles().subscribe((roles) => {
            this.roles = roles;
        });
        this.companyService.getAllCompanies().subscribe((companies) => {
            this.companies = companies;
        });
    }

    selectAddress(place: any): void { }

    updateUser(): void {
        this.userService
            .patchUser(
                parseInt(this.modifyForm.value.id, 10),
                this.modifyForm.value.name,
                this.modifyForm.value.surname,
                this.modifyForm.value.fiscalCode,
                this.modifyForm.value.email,
                this.modifyForm.value.cellphone,
                this.modifyForm.value.roleId,
                this.modifyForm.value.companyId,
                this.modifyForm.value.workerNumber,
                this.modifyForm.value.clientId,
                this.modifyForm.value.branchId,
                this.modifyForm.value.position,
                this.modifyForm.value.address,
                this.modifyForm.value.iban,
                this.modifyForm.value.birthCountry,
                this.modifyForm.value.birthDate,
                this.modifyForm.value.hireDate,
                this.modifyForm.value.status,
            )
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Avviso',
                    detail: "Hai modificato l'utente con successo",
                });
                this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
            });
    }
    goToTableUser() {
        this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
    }

    //Password
    checkPasswords(group: FormGroup) {
        const newPassword = group.get('newPassword').value;
        const confirmPassword = group.get('confirmPassword').value;

        return newPassword === confirmPassword ? null : { notSame: true };
    }

    savePassword() {
        this.userService
            .saveNewPassword(
                parseInt(this.idUser, 10),
                this.changePasswordForm.value.newPassword,
            )
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Avviso',
                    detail: 'Hai modificato la password con successo',
                });
                this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
            });
    }

    onChangePlace(event) {
        this.selectedPlaceAddress = this.placesItems.find(
            (index) => index.id === this.selectedPlace,
        );
    }

    onChangeVehicle(event) { }

    manualCheckIn() {
        this.attendanceService
            .checkInAttendanceWithTime(
                this.idUser,
                this.companyId,
                this.checkInForm.value.placeId,
                this.checkInForm.value.vehicleId,
                this.checkInForm.value.checkInTime
            )
            .subscribe((res) => {
                this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
            });
    }

    manualCheckOut() {
        this.attendanceService
            .checkOutAttendanceWithTime(this.attendanceCheckIn?.id, this.idUser, null, null, null, null, null, null, null, null, this.checkInForm.value.checkOutTime)
            .subscribe((res) => {
                this.router.navigate([ROUTES.ROUTE_TABLE_USER]);
            });
    }
    inviaPINviaWhatsApp() {
        const telefono = this.modifyForm.value.cellphone;
        const pinTesto = this.pinMessage.replace('PIN: ', '').trim();

        if (!telefono || !pinTesto) {
            this.messageService.add({
                severity: 'error',
                summary: 'Errore',
                detail: 'Numero di telefono o PIN non disponibile',
            });
            return;
        }

        // Rimuove eventuali spazi e simboli dal numero
        const numeroPulito = telefono.replace(/\D/g, '');

        // Messaggio da inviare
        const messaggio = encodeURIComponent(`Ciao, ti scrive l'assistenza CTF, questo è il tuo PIN: ${pinTesto}, per accedere alla piattaforma https://ctfitalia.cloud/login`);

        // Costruisce l'URL WhatsApp
        const url = `https://wa.me/${numeroPulito}?text=${messaggio}`;

        // Apre WhatsApp in una nuova finestra
        window.open(url, '_blank');
    }

    inviaPINviaEmail() {
        const email = this.modifyForm.value.email;
        const nome = this.modifyForm.value.name;
        const cognome = this.modifyForm.value.surname;
        const pinTesto = this.pinMessage.replace('PIN: ', '').trim();

        if (!email || !pinTesto) {
            this.messageService.add({
                severity: 'error',
                summary: 'Errore',
                detail: 'Email o PIN non disponibile',
            });
            return;
        }

        const messageEmail = `Ciao ${nome} ${cognome},\n\nQuesto è il tuo PIN di accesso: ${pinTesto}\n\nCordiali saluti,\nIl team`;

        this.emailService
            .sendEmail(email, 'PIN di accesso generato', messageEmail)
            .subscribe({
                next: (risposta) => {
                    console.log('Email inviata con successo:', risposta);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Email inviata',
                        detail: 'Hai inviato il PIN via email con successo',
                    });
                },
                error: (errore: HttpErrorResponse) => {
                    // Se lo status è 200 ma Angular lo interpreta come errore di parsing
                    if (errore.status === 200 && errore.error?.text?.includes('Email inviata')) {
                        console.warn('Email inviata correttamente, errore di parsing ignorato');
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Email inviata',
                            detail: 'Hai inviato il PIN via email con successo (errore di parsing ignorato)',
                        });
                    } else {
                        console.error("Errore durante l'invio dell'email:", errore);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Errore',
                            detail: 'Invio email fallito',
                        });
                    }
                }
            });

    }




    generaPIN() {
        this.authService
            .generaPIN(
                this.idUser,
            )
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Avviso',
                    detail: 'Hai generato il PIN con successo',
                });
                this.loadServices();
            }
            );
    }
    generaPINWithEmail() {
        this.authService.generaPIN(this.idUser).subscribe((res) => {
            const pinGenerato = res?.pin || '';

            this.messageService.add({
                severity: 'success',
                summary: 'Avviso',
                detail: 'Hai generato il PIN con successo',
            });

            this.loadServices(); // Aggiorna i dati utente e visualizza il nuovo PIN

            // Invio email con il PIN
            const email = this.modifyForm.value.email;
            const nome = this.modifyForm.value.name;
            const cognome = this.modifyForm.value.surname;

            if (!email || !pinGenerato) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Email non inviata',
                    detail: 'Email o PIN non disponibile',
                });
                return;
            }

            const messageEmail = `Ciao ${nome} ${cognome},\n\nQuesto è il tuo PIN di accesso: ${pinGenerato}\n\nCordiali saluti,\nIl team`;

            this.emailService
                .sendEmail(email, 'PIN di accesso generato', messageEmail)
                .subscribe({
                    next: (risposta) => {
                        console.log('Email inviata con successo:', risposta);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Email inviata',
                            detail: 'Hai inviato il PIN via email con successo',
                        });
                    },
                    error: (errore: HttpErrorResponse) => {
                        if (errore.status === 200 && errore.error?.text?.includes('Email inviata')) {
                            console.warn('Email inviata correttamente, errore di parsing ignorato');
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Email inviata',
                                detail: 'Hai inviato il PIN via email con successo (errore di parsing ignorato)',
                            });
                        } else {
                            console.error("Errore durante l'invio dell'email:", errore);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Errore',
                                detail: 'Invio email fallito',
                            });
                        }
                    }
                });
        });
    }


}
