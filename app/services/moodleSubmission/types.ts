export interface MoodleSubmissionDTO {
    id: number;
    content: string;
    moodleTaskId: number;
    saleId: string;
}

export interface UpdateMoodleSubmissionDTO {
    id?: number;
    content?: string;
    moodleTaskId?: number;
    saleId?: string;
}