export type SpeckResultQueue = {
    reference: string, 
    pdf: string, // Now is link of document/pdf
    correlationId: string //InterviewID
}

export type SpeckResultSendQueue = {
    sample: string,
    name: string,
    generate: string[],
    includes: string[] | null,
    template: string,
    reference: string,

}
