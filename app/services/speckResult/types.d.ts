export type InterviewAnswer = {
  answer: string;
  index: number;
};

export type InterviewWithAnswers = {
  id: number;
  configInterviewId: number;
  saleId: string;
  templateId: string;
  InterviewAnswers: InterviewAnswer[];
};

interface CreateSpeckResultDTO {
  interview: InterviewWithAnswers;
  customerName: string;
  url: string;

}