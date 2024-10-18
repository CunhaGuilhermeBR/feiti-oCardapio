export interface TemplateDTO {
    id: string;
    title: string;
    vocational: boolean;
    configTCLEId?: number;
    appId?: number;
}

export interface UpdateTemplateDTO {
    id?: string;
    title?: string;
    vocational?: boolean;
    configTCLEId?: number;
}

