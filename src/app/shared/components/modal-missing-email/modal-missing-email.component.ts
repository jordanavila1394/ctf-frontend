import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../stores/auth/authentication.reducer'; // Correct path to your AuthState interface
import { UserService } from '../../../services/user.service'; // Correct path to your UserService

@Component({
  selector: 'app-modal-missing-email',
  templateUrl: './modal-missing-email.component.html',
  styleUrls: ['./modal-missing-email.component.scss']
})
export class ModalMissingEmailComponent {
  @Input() isModalOpen: boolean = false; // Input property to control modal visibility
  authState$: Observable<AuthState>;
  currentUser: any; // Use the appropriate type for your user
  userEmail: string = '';

  constructor(
    private store: Store<{ authState: AuthState }>,
    private userService: UserService // Inject the UserService
  ) {
    this.authState$ = this.store.select('authState');
  }

  ngOnInit(): void {
    this.authState$.subscribe((authS) => {
      this.currentUser = authS?.user || '';

      if (this.currentUser && this.currentUser.email) {
        this.isModalOpen = false;
        this.userEmail = this.currentUser.email;
        console.log('User Email:', this.userEmail);
      } else {
        this.isModalOpen = true;
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveEmail(email: string) {

    if (this.currentUser && this.currentUser.id) { // Ensure currentUser has an ID
      this.userService.updateUserEmail(this.currentUser.id, email).subscribe(
        response => {
          console.log('Email updated successfully:', response);
          this.userEmail = email; // Update local email state
          this.closeModal(); // Close the modal on success
        },
        error => {
          console.error('Error updating email:', error);
        }
      );
    }
  }
}
