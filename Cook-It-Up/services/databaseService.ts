import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DatabaseService {
  // User operations
  async createUser(name: string, email: string, password: string) {
    return await prisma.user.create({
      data: { name, email, password },
    });
  }

  async getUser(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        pantries: true,
        preferences: true,
      },
    });
  }

  // Pantry operations
  async createPantry(userId: number, name: string) {
    return await prisma.pantry.create({
      data: {
        name,
        userId,
      },
    });
  }

  async getUserPantries(userId: number) {
    return await prisma.pantry.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  // Pantry items operations
  async addPantryItem(
    pantryId: number,
    name: string,
    quantity: number,
    unit: string,
    expiryDate?: Date
  ) {
    return await prisma.pantryItem.create({
      data: {
        name,
        quantity,
        expiryDate,
        pantryId,
      },
    });
  }

  async updatePantryItem(
    id: number,
    data: {
      name?: string;
      quantity?: number;
      unit?: string;
      expiryDate?: Date;
    }
  ) {
    return await prisma.pantryItem.update({
      where: { id },
      data,
    });
  }

  async deletePantryItem(id: number) {
    return await prisma.pantryItem.delete({
      where: { id },
    });
  }

  // Preferences operations
  async addPreference(
    userId: number,
    name: string,
    type: "LIKE" | "DISLIKE" | "DIETARY_RESTRICTION"
  ) {
    return await prisma.foodPreference.create({
      data: {
        name,
        type,
        userId,
      },
    });
  }

  async getUserPreferences(userId: number) {
    return await prisma.foodPreference.findMany({
      where: { userId },
    });
  }

  // Recipe suggestion helper
  async getRecipeIngredients(userId: number) {
    const pantries = await prisma.pantry.findMany({
      where: { userId },
      include: { items: true },
    });

    const preferences = await prisma.foodPreference.findMany({
      where: { userId },
    });

    const ingredients = pantries.flatMap((pantry) =>
      pantry.items.map((item) => `${item.quantity} ${item.name}`)
    );

    return {
      ingredients,
      preferences,
    };
  }
}

export const db = new DatabaseService();
