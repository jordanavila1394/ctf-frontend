import { User } from './user';

export interface Company {
    id?: number;
    name?: string;
    vat?: string;
    registed_office?: string;
    head_office?: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
    user?: User;
    dateAt?: Date;
}
