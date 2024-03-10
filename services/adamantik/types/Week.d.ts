/**
 * Week
 * A Week
 */
declare interface Week {
    id?: number;
    completedAt?: string | null;
    createdAt?: string | null;
    mesocycleId: number;
    numberOfDays: number;
    relativeOrder: number;
}
export { Week };
