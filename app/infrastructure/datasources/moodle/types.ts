interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  department: string;
  firstaccess: number;
  lastaccess: number;
  auth: string;
  suspended: boolean;
  confirmed: boolean;
  lang: string;
  theme: string;
  timezone: string;
  mailformat: number;
  description: string;
  descriptionformat: number;
  city: string;
  country: string;
  profileimageurlsmall: string;
  profileimageurl: string;
}

export interface MoodleGetUserResponse {
  users: User[];
}

export interface MoodleTokenData {
  id: string;
  firstAccess: number;
  lastAccess: number;
}

export enum KeyValuesGetFunction {
  EMAIL = 'email',
  ID = 'id',
  USERNAME = 'username',
  FULLNAME = 'fullname'
}

export enum MoodleFunction {
  CORE_USER_GET_USERS = 'core_user_get_users',
  ENROL_MANUAL_ENROL_USERS = 'enrol_manual_enrol_users',
  MOD_ASSIGN_SAVE_GRADE = 'mod_assign_save_grade',
  MOD_ASSIGN_GET_ASSIGNMENTS = 'mod_assign_get_assignments',
  MOD_ASSIGN_GET_SUBSMISSIONS = 'mod_assign_get_submissions',
}

export enum MoodleMethod {
  GET = 'GET',
  POST = 'POST',
}

export type MoodleRequest = {
  method: MoodleMethod;
  function: MoodleFunction;
  params: URLSearchParams;
}

interface FileArea {
  area: string;
  files: string[]; // Return empty, it just a 'kick'
}

interface EditorField {
  name: string;
  description: string;
  text: string;
  format: number;
}

interface Plugin {
  type: string;
  name: string;
  fileareas?: FileArea[];
  editorfields?: EditorField[];
}

interface Submission {
  id: number;
  userid: number;
  attemptnumber: number;
  timecreated: number;
  timemodified: number;
  timestarted: number | null;
  status: string;
  groupid: number;
  plugins: Plugin[];
  gradingstatus: string;
}

interface Assignment {
  assignmentid: number;
  submissions: Submission[];
}

export interface MoodleGetSubmissionResponse {
  assignments: Assignment[];
}

export interface MoodleAddFeedbackToAssignmentResponse {
  success: boolean;
}

export interface MoodleAddFeedbackToAssignmentDTO {
  email: string;
  moodleAssignmentId: number;
  experienceUrl: string;
  feedbackUrl: string;
}

interface Course {
  id: number;
  fullname: string;
  shortname: string;
  timemodified: number;
  assignments: Assignment[];
}

interface Assignment {
  id: number;
  cmid: number;
  course: number;
  name: string;
  nosubmissions: number;
  submissiondrafts: number;
  sendnotifications: number;
  sendlatenotifications: number;
  sendstudentnotifications: number;
  duedate: number;
  allowsubmissionsfromdate: number;
  grade: number;
  timemodified: number;
  completionsubmit: number;
  cutoffdate: number;
  gradingduedate: number;
  teamsubmission: number;
  requireallteammemberssubmit: number;
  teamsubmissiongroupingid: number;
  blindmarking: number;
  hidegrader: number;
  revealidentities: number;
  attemptreopenmethod: string;
  maxattempts: number;
  markingworkflow: number;
  markingallocation: number;
  requiresubmissionstatement: number;
  preventsubmissionnotingroup: number;
  submissionstatement: string;
  submissionstatementformat: number;
  configs: Config[];
  intro: string;
  introformat: number;
  introfiles: any[];
  introattachments: any[]; 
  activity: string;
  activityformat: number;
  activityattachments: any[]; 
  timelimit: number;
  submissionattachments: number;
}

interface Config {
  plugin: string;
  subtype: string;
  name: string;
  value: string;
}

export interface GetAssignmentsResponse {
  courses: Course[];
}
