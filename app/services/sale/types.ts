import { $Enums } from '@prisma/client'

export interface CreateSaleDTO {
  user: User;
  externalID: string;
  templates: string[];
  url: string;
  source: $Enums.SaleSource;
}

export interface User {
  email: string;
  name: string;
}

export interface SendAccessEmailDTO {
  appUrl: string,
  userMail: string,
  userName: string,
  interviewID: string,
  appId: number
}

export interface SendAccessEmailDTO {
  appUrl: string,
  userMail: string,
  userName: string,
  interviewID: string,
  appId: number
}

export enum EmailType {
  SALE_ACCESS = 'SALE_ACCESS'
}