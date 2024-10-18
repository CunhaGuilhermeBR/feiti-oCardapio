export interface PDFData {
  studentName: string
  dateNow: string
}

export interface FeedbackPdfData extends PDFData {
  feedback: string
}

export interface ExperiencePdfData extends PDFData {
  course: string,
  firstAssignment: string,
  firstExperience: string,
  firstSubmission: string,
  secondAssignment: string,
  secondExperience: string,
  secondSubmission: string,
  thirdAssignment: string,
  thirdExperience: string,
  thirdSubmission: string,
}
