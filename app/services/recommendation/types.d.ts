export interface MoodleTaskDTO {
    id: number;
    name: string;
    prompt: string;
    courseName: string;
}

export interface UpdateMoodleTaskDTO {
    id?: number;
    name?: string;
    prompt?: string;
    courseName?: string;
}