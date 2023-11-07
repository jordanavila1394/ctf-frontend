import { AuthenticationReducer } from  './auth/authentication.reducer';

import { MetaReducer } from "@ngrx/store";
import { HydrationMetaReducer } from "./hydratation/hydratation.reducer";


export const reducers= {
  authState: AuthenticationReducer,
};
export const metaReducers: MetaReducer[] = [HydrationMetaReducer];


