import { $Enums } from '@prisma/client'

export interface FeedbackDTO {
    saleId: string;
    title: string;
    content: string;
    status?: $Enums.FeedbackStatus;
}

export interface UpdateFeedbackDTO {
    title?: string;
    content?: string;
    status?: $Enums.FeedbackStatus;
    saleId?: string;
}