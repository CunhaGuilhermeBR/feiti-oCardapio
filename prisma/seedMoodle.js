const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const prisma = new PrismaClient();

async function main() {
  // Upsert Sale
  const saleId = uuidv4();
  await prisma.sale.upsert({
    where: { id: saleId },
    update: {},
    create: {
      id: saleId,
      externalId: "issoEUmIdExterno",
      email: "johnDoe@cobol.com.br",
      source: "MOODLE",
      applicationId: 1,
      interviewId: 1,
    },
  });

  const courseName = "Como platinar Hollow Knight - Básico ao Mestre";
  await prisma.course.upsert({
    where: { name: courseName },
    update: {},
    create: {
      name: courseName,
      shortName: "HKMaster",
      goodFeature: true,
    },
  });

  const taskName = "Passar pelo caminho da dor";
  await prisma.moodleTask.upsert({
    where: {
      courseName_name: {
        courseName: courseName,
        name: taskName,
      },
    },
    update: {},
    create: {
      name: taskName,
      prompt: "Você deve usar todas as skills e não cair",
      courseName: courseName,
    },
  });

  await prisma.moodleSubmission.upsert({
    where: {
      saleId_moodleTaskCourse_moodleTaskName: {
        saleId,
        moodleTaskCourse: courseName,
        moodleTaskName: taskName,
      },
    },
    update: {},
    create: {
      content:
        "Eu usei so a skill da asa e morri, mas vou ver o vídeo e ficar bom",
      moodleTaskName: taskName,
      moodleTaskCourse: courseName,
      saleId: saleId,
    },
  });

  const feedbackTitle = "Você é ruim... mas vai melhorar";
  await prisma.feedback.upsert({
    where: {
      saleId_title: {
        saleId: saleId,
        title: feedbackTitle,
      },
    },
    update: {},
    create: {
      saleId: saleId,
      title: feedbackTitle,
      content:
        "Então, você é muito ruim, não sei como conseguiu chegar a esse ponto do jogo. Veja os vídeos e tente fazer parecido, não tente pensar.",
      status: "PENDING",
    },
  });

  await prisma.recommendationCourse.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      speckResultId: 1,
      courseName: courseName,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
