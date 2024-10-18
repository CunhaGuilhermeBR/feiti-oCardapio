export interface ApplicationDTO {
    name: string;
    url: string;
    imageurl: string;
    enabled?: boolean;
}

export interface UpdateApplicationDTO {
    name?: string;
    url?: string;
    imageurl?: string;
    enabled?: boolean;
}

