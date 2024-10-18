interface EmailData {
  to: string;
  subject: string;
  name?: string;
  link?: string;
  host: string;
  applicationEmail: string;
  applicationEmailPassword: string;
  domain: string;
  port: number;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}