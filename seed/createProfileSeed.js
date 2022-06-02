const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const bcrypt = require("bcrypt")

async function hash(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }

const load = async () => {
  try {
    await prisma.profiles.create({
      data: {
        firstName: "Kristoffer Lawrence",
        address: "Alicia, Isabela",
        email: "kldasig26@gmail.com",
        lastName: "Dasig",
        password: await hash("1234"),
        phoneNumber: "phoneNumber",
        postCopde: "3306",
        userName: "profile",
      },
    });
    console.log("Added product data");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
load();
