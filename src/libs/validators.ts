import { PrismaClient } from "@prisma/client";

export class ExercisesValidator {
  private static instance: ExercisesValidator;
  private exerciseIDs: Set<number>;
  private db: PrismaClient;

  private constructor() {
    this.db = new PrismaClient();
    this.exerciseIDs = new Set();
  }

  public static getValidator() {
    return this.instance || new ExercisesValidator();
  }

  async validate(id: number) {
    if (this.exerciseIDs.has(id)) {
      return true;
    }
    const exercise = await this.db.exercise.findUnique({ where: { id } });
    if (!exercise) {
      return false;
    }
    this.exerciseIDs.add(id);
    return true;
  }
}
