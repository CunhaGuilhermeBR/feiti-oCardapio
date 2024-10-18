export interface ConfigSpeckResultDTO {
    speckOrigin: string;
    speckApiToken: string;
    speckUrl: string;
    itemId?: number;
    appId?: number;
}

export interface UpdateConfigSpeckResultDTO {
    speckOrigin?: string;
    speckApiToken?: string;
    speckUrl?: string;
    itemId?: number;
}