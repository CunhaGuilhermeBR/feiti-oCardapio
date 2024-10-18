import { ConfigPageType } from '@prisma/client'

export interface ConfigurableItemDTO {
    enabled?: boolean; 
    title: string;
    description: string;
    applicationId?: number;
    url?: string; 
    createdAt?: Date; 
    updatedAt?: Date; 
    configPageType?: ConfigPageType; 
    index?: number;
    imageUrl?: string; 
}

export interface UpdateConfigurableItemDTO {
    enabled?: boolean; 
    title?: string;
    description?: string;
    applicationId?: number;
    url?: string; 
    createdAt?: Date; 
    updatedAt?: Date; 
    configPageType?: ConfigPageType; 
    index?: number;
    imageUrl?: string; 
}