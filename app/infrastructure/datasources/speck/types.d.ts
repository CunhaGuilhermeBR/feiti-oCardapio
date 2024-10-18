export type InterviewAnswer = {
  answer: string;
  index: number;
};

export type InterviewWithAnswers = {
  id: string;
  saleId: string;
  templateId: string;
  InterviewAnswers: InterviewAnswer[];
};

export type SendSampleInput = {
  interview: InterviewWithAnswers;
  customerName: string;
  customerEmail: string;
  vocational?: boolean;
};

export type SendSampleBody = {
  reference: string;
  sample: string;
  includes?: string[] | null
};

export class SpeckResponse<T> {
	timestamps: Date
	data: T
}

export type GenerateReport = {
  essayId: string;
  template: string;
};

export interface SendSampleResponse {
  essayId: string
}

export interface ReportDataResponse {
  userID: string
  data: Data
  name: string
  date: string
  templateName: string
  informatives: string[]
}

export type SpeckApiResponse = ReportDataResponse[];

export interface Data {
  characteristics: Characteristic[]
  'global-profiles-group': GlobalProfilesGroup[]
}

export interface Characteristic {
  _id: string
  children: Children[]
}

export interface Children {
  _id: string
  display: string
  description: string
  score: number
  extraData: ExtraData
  children: Children2[]
}

export interface ExtraData {
  confidence: number
  quantile: number
  std: number
}

export interface Children2 {
  _id: string
  score: number
  display: string
  description: string
  extraData: ExtraData2
}

export interface ExtraData2 {
  confidence: number
  quantile: number
  std: number
}

export interface GlobalProfilesGroup {
  _id: string
  name: string
  score: number
  description: string
  extraData: ExtraData3
  children: Children3[]
}

export interface ExtraData3 {
  confidence: Confidence
}

export interface Confidence {
  avg: number
  std: number
  frequency: Frequency
  min: number
  max: number
}

export interface Frequency {
  high: number
  medium: number
  low: number
}

export interface Children3 {
  _id: string
  name: string
  description: string
  score: number
  extraData: ExtraData4
  icon: string
}

export interface ExtraData4 {
  confidence: Confidence2
}

export interface Confidence2 {
  avg: number
  std: number
  frequency: Frequency2
  min: number
  max: number
}

export interface Frequency2 {
  high: number
  medium: number
  low: number
}
