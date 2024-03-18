/**
 * Mesocycle
 * A Mesocycle
 */
declare interface Mesocycle {
    id?: number;
    createdAt?: string | null;
    focus: string;
    name: string;
    numberOfDays: number;
    numberOfWeeks: number;
    template: string;
    userId: number;
}
export { Mesocycle };
