interface MoodleTask {
    id: number;
    name: string;
    prompt: string;
    courseName: string;
    createdat: Date;
    updatedat: Date;
}

interface Sale {
    externalId: string;
    customerName: string;
}

interface MoodleSubmission {
    id: number;
    content: string;
    moodleTaskId: number;
    moodleTask: MoodleTask;
    saleId: string;
    Sale: Sale;
    createdat: Date;
    updatedat: Date;
}

export interface MoodleSubmissionWithIncludes extends MoodleSubmission {
    moodleTask: MoodleTask;
    Sale: Sale;
}

export interface messageIa {
    content: string;
	role: 'user' | 'assistant' | 'system'
  }[]
