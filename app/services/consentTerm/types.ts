export interface AcceptConsentTermDTO {
    saleId: string,
    ConfigConsentTermCheckFieldsId: number
}

export interface ConsentTermDTO {
    itemId?: number
    appId?: number
}

export interface ConsentTermFieldDTO{
    itemId?: number
    appId?: number
    description: string
    consentTermId: number
}

export interface UpdateTermFieldDTO {
    description: string;
}