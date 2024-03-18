/**
 * User
 * A User
 */
declare interface User {
    id?: number;
    createdAt?: string | null;
    email: string;
    firstName: string;
    lastName?: string | null;
}
export { User };
