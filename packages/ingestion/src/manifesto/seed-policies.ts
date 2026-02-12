import { prisma } from "@ojpp/db";
import policies from "./data/policies.json";

export async function seedPolicies() {
  console.log("Seeding policies...");

  let upserted = 0;
  let skipped = 0;

  for (const policy of policies) {
    const party = await prisma.party.findUnique({
      where: { name: policy.party },
    });

    if (!party) {
      console.warn(`  Party not found: ${policy.party}, skipping`);
      skipped++;
      continue;
    }

    const existing = await prisma.policy.findFirst({
      where: { title: policy.title, partyId: party.id },
    });

    if (existing) {
      await prisma.policy.update({
        where: { id: existing.id },
        data: {
          category: policy.category,
          content: policy.content,
          status: policy.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
          publishedAt: policy.status === "PUBLISHED" ? new Date() : null,
        },
      });
    } else {
      await prisma.policy.create({
        data: {
          title: policy.title,
          category: policy.category,
          partyId: party.id,
          content: policy.content,
          status: policy.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
          publishedAt: policy.status === "PUBLISHED" ? new Date() : null,
        },
      });
    }

    upserted++;
  }

  console.log(`  ${upserted} policies upserted, ${skipped} skipped`);
}

// Allow running directly with tsx
if (require.main === module) {
  seedPolicies()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
