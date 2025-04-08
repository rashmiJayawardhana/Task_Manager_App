export interface User {
    id: number;
    name: string;
    email: string;
    userRole: 'ADMIN' | 'EMPLOYEE';
    profileImage: string | null;
}