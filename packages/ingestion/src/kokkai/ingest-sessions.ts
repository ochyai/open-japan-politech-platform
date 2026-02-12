import { prisma } from "@ojpp/db";
import type { SessionType } from "@ojpp/db";

interface SessionData {
  number: number;
  type: SessionType;
  startDate: string;
  endDate: string;
}

const SESSIONS: SessionData[] = [
  { number: 200, type: "EXTRAORDINARY", startDate: "2019-10-04", endDate: "2019-12-09" },
  { number: 201, type: "ORDINARY", startDate: "2020-01-20", endDate: "2020-06-17" },
  { number: 202, type: "EXTRAORDINARY", startDate: "2020-09-16", endDate: "2020-09-18" },
  { number: 203, type: "EXTRAORDINARY", startDate: "2020-10-26", endDate: "2020-12-05" },
  { number: 204, type: "ORDINARY", startDate: "2021-01-18", endDate: "2021-06-16" },
  { number: 205, type: "EXTRAORDINARY", startDate: "2021-10-04", endDate: "2021-10-14" },
  { number: 206, type: "SPECIAL", startDate: "2021-11-10", endDate: "2021-11-12" },
  { number: 207, type: "EXTRAORDINARY", startDate: "2021-12-06", endDate: "2021-12-21" },
  { number: 208, type: "ORDINARY", startDate: "2022-01-17", endDate: "2022-06-15" },
  { number: 209, type: "EXTRAORDINARY", startDate: "2022-08-03", endDate: "2022-08-05" },
  { number: 210, type: "EXTRAORDINARY", startDate: "2022-10-03", endDate: "2022-12-10" },
  { number: 211, type: "ORDINARY", startDate: "2023-01-23", endDate: "2023-06-21" },
  { number: 212, type: "EXTRAORDINARY", startDate: "2023-10-20", endDate: "2023-12-13" },
  { number: 213, type: "ORDINARY", startDate: "2024-01-26", endDate: "2024-06-23" },
];

export async function ingestSessions() {
  console.log("Ingesting diet sessions...");

  for (const session of SESSIONS) {
    const existing = await prisma.dietSession.findFirst({
      where: { number: session.number },
    });

    if (existing) {
      await prisma.dietSession.update({
        where: { id: existing.id },
        data: {
          type: session.type,
          startDate: new Date(session.startDate),
          endDate: new Date(session.endDate),
        },
      });
      console.log(`  Updated session #${session.number}`);
    } else {
      await prisma.dietSession.create({
        data: {
          number: session.number,
          type: session.type,
          startDate: new Date(session.startDate),
          endDate: new Date(session.endDate),
        },
      });
      console.log(`  Created session #${session.number}`);
    }
  }

  console.log(`Ingested ${SESSIONS.length} sessions.`);
}

if (require.main === module) {
  ingestSessions()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
