/**
 * ExerciseInstance
 * A ExerciseInstance
 */
declare interface ExerciseInstance {
    id?: number;
    exerciseId: number;
    expectedRir: number;
    feedback: string;
    relativeOrder: number;
    sets?: string | null;
    weight: number;
    workoutId: number;
}
export { ExerciseInstance };
