export interface EmailDTO {
    host: string;
    email: string;
    domain: string;
    port: number;
    emailPassword: string;
    applicationId: number;

}

export interface UpdateEmailDTO {
    host?: string;
    email?: string;
    domain?: string;
    port?: number;
    emailPassword?: string;
    applicationId?: number;
}