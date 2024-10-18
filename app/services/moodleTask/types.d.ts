interface MoodleTaskDTO {
    id: number;
    name: string;
    prompt: string;
    courseName: string;
}

interface UpdateMoodleTaskDTO {
    id?: number;
    name?: string;
    prompt?: string;
    courseName?: string;
}