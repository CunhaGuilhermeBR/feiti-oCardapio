import session from 'express-session'  // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ServerDTO {
  start(): Promise<void>;
}

export interface ServerConfig {
  address: string;
  port: number;
}

// https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata
declare module 'express-session' {
  export interface SessionData {
    saleId: string;
    interviewId: string;
    alreadyConsented: boolean;
    alreadyResponded: boolean;
    interviewUserName: string;
  }
}