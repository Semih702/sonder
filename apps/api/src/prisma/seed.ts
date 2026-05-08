import { prisma } from "../lib/prisma";

const code = process.env.SONDER_SEED_INVITE_CODE ?? "SONDER-BETA";

async function main() {
  await prisma.inviteCode.upsert({
    where: { code },
    create: {
      code,
      maxUses: 100,
      usedCount: 0,
      isActive: true
    },
    update: {
      isActive: true
    }
  });

  console.info(`Seeded invite code ${code}`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
