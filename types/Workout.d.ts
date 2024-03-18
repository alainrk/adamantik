/**
 * Workout
 * A Workout
 */
declare interface Workout {
    id?: number;
    completedAt?: string | null;
    createdAt?: string | null;
    relativeOrder: number;
    weekId: number;
}
export { Workout };
