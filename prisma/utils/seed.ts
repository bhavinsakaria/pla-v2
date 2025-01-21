import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient(); // Correctly instantiate PrismaClient
  const user = await prisma.user.create({
    data: {
      username: "admin",
      password: "$2a$12$czfM54I3CMs/HGK/3tBbOurbvFqF5WC4Pl0MCuaQ3SXf9VlHRbS.G",
      role: "admin",
    },
  });
  console.log("Prisma user creation success:", user);
  await prisma.$disconnect();
}

main().catch((error) => console.error(error));
