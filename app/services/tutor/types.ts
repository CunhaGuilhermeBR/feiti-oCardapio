export interface TutorDTO {
    email: string;
    password: string;
    firstLogin?: boolean;
}

export interface UpdateTutorDTO {
    email?: string;
    password?: string;
    firstLogin?: boolean;
}