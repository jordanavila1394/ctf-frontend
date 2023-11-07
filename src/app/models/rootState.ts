
import { AuthState } from '../stores//auth/authentication.reducer';

export class RootState {
  private authState: AuthState;
  constructor (authState: AuthState) {
    this.authState = authState;
  }

}
