-- CreateEnum
CREATE TYPE "SaleSource" AS ENUM ('WIX', 'VTEX', 'MOODLE');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'APPROVED');

-- CreateEnum
CREATE TYPE "ConfigPageType" AS ENUM ('INSTRUCTIONS', 'HOWITWORKS', 'PRESENTATION', 'ITEM', 'SPECKRESULT');

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageurl" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,
    "source" "SaleSource" NOT NULL,
    "applicationId" INTEGER NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleTemplates" (
    "saleId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "SaleTemplates_pkey" PRIMARY KEY ("saleId")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,
    "interviewQuestionnaireId" INTEGER NOT NULL,
    "configTCLEId" INTEGER NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestionnaire" (
    "id" SERIAL NOT NULL,
    "configQuestionnaireId" INTEGER NOT NULL,

    CONSTRAINT "InterviewQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" SERIAL NOT NULL,
    "index" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "questionnaireId" INTEGER NOT NULL,
    "configQuestionId" INTEGER NOT NULL,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" SERIAL NOT NULL,
    "saleId" TEXT NOT NULL,
    "configInterviewId" INTEGER NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewAnswer" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeckResult" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "essayId" TEXT NOT NULL,
    "pdfReportFile" BYTEA NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeckResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcceptTCLEField" (
    "saleId" TEXT NOT NULL,
    "accept" BOOLEAN NOT NULL,
    "ConfigConsentTermCheckFieldsId" INTEGER NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcceptTCLEField_pkey" PRIMARY KEY ("saleId","ConfigConsentTermCheckFieldsId")
);

-- CreateTable
CREATE TABLE "RecommendationCourse" (
    "id" SERIAL NOT NULL,
    "degree" INTEGER NOT NULL CHECK("degree" >= 1),
    "score" INTEGER NOT NULL CHECK("score" >= 0),
    "saleId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendationCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Tier" (
    "initialValue" INTEGER NOT NULL CHECK("initialValue" >= 0 AND "initialValue" <=100),
    "finalValue" INTEGER NOT NULL CHECK("finalValue" >= "initialValue" AND "finalValue" <=100),
    "index" INTEGER NOT NULL CHECK("index" >= 1),
    "courseName" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("courseName","index")
);

-- CreateTable
CREATE TABLE "MoodleTask" (
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoodleTask_pkey" PRIMARY KEY ("courseName","name")
);

-- CreateTable
CREATE TABLE "MoodleSubmission" (
    "content" TEXT NOT NULL,
    "moodleTaskName" TEXT NOT NULL,
    "moodleTaskCourse" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoodleSubmission_pkey" PRIMARY KEY ("saleId","moodleTaskCourse","moodleTaskName")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "saleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'PENDING',
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("saleId","title")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigurableItem" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,
    "configPageType" "ConfigPageType" NOT NULL DEFAULT 'ITEM',
    "index" INTEGER,
    "imageUrl" TEXT,

    CONSTRAINT "ConfigurableItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigurableItemLabels" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ConfigurableItemLabels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigInterview" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ConfigInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigInterviewQuestion" (
    "id" SERIAL NOT NULL,
    "minlength" INTEGER NOT NULL DEFAULT 28 CHECK("minlength" >= 28),
    "maxlength" INTEGER NOT NULL DEFAULT 1000 CHECK("maxlength" <= 1000),
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ConfigInterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigQuestionnaire" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ConfigQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigQuestion" (
    "id" SERIAL NOT NULL,
    "questionnaireId" INTEGER NOT NULL,

    CONSTRAINT "ConfigQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigMoodle" (
    "id" SERIAL NOT NULL,
    "moodleApiUrl" TEXT NOT NULL,
    "moodleApiToken" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "appId" INTEGER NOT NULL,

    CONSTRAINT "ConfigMoodle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigConsentTerm" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ConfigConsentTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigConsentTermCheckFields" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "consentTermId" INTEGER NOT NULL,

    CONSTRAINT "ConfigConsentTermCheckFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigSpeckResult" (
    "id" SERIAL NOT NULL,
    "speckApiToken" TEXT NOT NULL,
    "speckTemplateId" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "speckResultId" INTEGER NOT NULL,

    CONSTRAINT "ConfigSpeckResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_title_key" ON "Template"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_saleId_key" ON "Interview"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_email_key" ON "Tutor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigurableItemLabels_itemId_key_key" ON "ConfigurableItemLabels"("itemId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigMoodle_moodleApiToken_key" ON "ConfigMoodle"("moodleApiToken");

-- CreateIndex
CREATE UNIQUE INDEX "ConfigSpeckResult_speckApiToken_key" ON "ConfigSpeckResult"("speckApiToken");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTemplates" ADD CONSTRAINT "SaleTemplates_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTemplates" ADD CONSTRAINT "SaleTemplates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_interviewQuestionnaireId_fkey" FOREIGN KEY ("interviewQuestionnaireId") REFERENCES "InterviewQuestionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_configTCLEId_fkey" FOREIGN KEY ("configTCLEId") REFERENCES "ConfigConsentTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestionnaire" ADD CONSTRAINT "InterviewQuestionnaire_configQuestionnaireId_fkey" FOREIGN KEY ("configQuestionnaireId") REFERENCES "ConfigQuestionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "InterviewQuestionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_configQuestionId_fkey" FOREIGN KEY ("configQuestionId") REFERENCES "ConfigQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_configInterviewId_fkey" FOREIGN KEY ("configInterviewId") REFERENCES "ConfigInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewAnswer" ADD CONSTRAINT "InterviewAnswer_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeckResult" ADD CONSTRAINT "SpeckResult_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptTCLEField" ADD CONSTRAINT "AcceptTCLEField_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptTCLEField" ADD CONSTRAINT "AcceptTCLEField_ConfigConsentTermCheckFieldsId_fkey" FOREIGN KEY ("ConfigConsentTermCheckFieldsId") REFERENCES "ConfigConsentTermCheckFields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationCourse" ADD CONSTRAINT "RecommendationCourse_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationCourse" ADD CONSTRAINT "RecommendationCourse_courseName_fkey" FOREIGN KEY ("courseName") REFERENCES "Course"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_courseName_fkey" FOREIGN KEY ("courseName") REFERENCES "Course"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodleTask" ADD CONSTRAINT "MoodleTask_courseName_fkey" FOREIGN KEY ("courseName") REFERENCES "Course"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodleSubmission" ADD CONSTRAINT "MoodleSubmission_moodleTaskName_moodleTaskCourse_fkey" FOREIGN KEY ("moodleTaskName", "moodleTaskCourse") REFERENCES "MoodleTask"("name", "courseName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodleSubmission" ADD CONSTRAINT "MoodleSubmission_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurableItem" ADD CONSTRAINT "ConfigurableItem_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurableItemLabels" ADD CONSTRAINT "ConfigurableItemLabels_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigurableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigInterview" ADD CONSTRAINT "ConfigInterview_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigurableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigInterviewQuestion" ADD CONSTRAINT "ConfigInterviewQuestion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigQuestionnaire" ADD CONSTRAINT "ConfigQuestionnaire_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigurableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigQuestion" ADD CONSTRAINT "ConfigQuestion_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "ConfigQuestionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigMoodle" ADD CONSTRAINT "ConfigMoodle_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigurableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigMoodle" ADD CONSTRAINT "ConfigMoodle_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigConsentTerm" ADD CONSTRAINT "ConfigConsentTerm_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigurableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigConsentTermCheckFields" ADD CONSTRAINT "ConfigConsentTermCheckFields_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigurableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigConsentTermCheckFields" ADD CONSTRAINT "ConfigConsentTermCheckFields_consentTermId_fkey" FOREIGN KEY ("consentTermId") REFERENCES "ConfigConsentTerm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigSpeckResult" ADD CONSTRAINT "ConfigSpeckResult_speckTemplateId_fkey" FOREIGN KEY ("speckTemplateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigSpeckResult" ADD CONSTRAINT "ConfigSpeckResult_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigurableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigSpeckResult" ADD CONSTRAINT "ConfigSpeckResult_speckResultId_fkey" FOREIGN KEY ("speckResultId") REFERENCES "SpeckResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
