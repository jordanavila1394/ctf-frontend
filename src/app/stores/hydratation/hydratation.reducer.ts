import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { AuthState } from '../auth/authentication.reducer';

class RootState {
    private authState: AuthState;
    constructor(authState: AuthState) {
        this.authState = authState;
    }
}

export const HydrationMetaReducer = (
    reducer: ActionReducer<RootState>,
): ActionReducer<RootState> => {
    return (state, action) => {
        if (action.type === INIT || action.type === UPDATE) {
            const storageValue = localStorage.getItem('state');
            if (storageValue) {
                try {
                    return JSON.parse(storageValue);
                } catch {
                    localStorage.removeItem('state');
                }
            }
        }
        const nextState = reducer(state, action);
        localStorage.setItem('state', JSON.stringify(nextState));

        return nextState;
    };
};
