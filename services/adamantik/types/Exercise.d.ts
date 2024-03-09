/**
 * Exercise
 * A Exercise
 */
declare interface Exercise {
    id?: number;
    createdAt?: string | null;
    muscleGroup: number;
    name: string;
    userId?: number | null;
    videoUrl?: string | null;
}
export { Exercise };
