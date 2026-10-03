// Happy Hour promo codes database me add karo
// Run: node scripts/add-happy-hour-promos.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const codes = [
    { code: "HAPPY20", percentOff: 20 }, // Evening 4-7 PM
    { code: "LATE15", percentOff: 15 },  // Late night 12-2 AM
  ];

  for (const c of codes) {
    await prisma.promoCode.upsert({
      where: { code: c.code },
      update: { percentOff: c.percentOff, active: true },
      create: { code: c.code, percentOff: c.percentOff, active: true },
    });
    console.log(`✅ ${c.code} - ${c.percentOff}% off`);
  }
  console.log("\nDone! Ab checkout pe ye codes kaam karenge!");
}

main()
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
