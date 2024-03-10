/**
 * Mesocycle
 * A Mesocycle
 */
declare interface Mesocycle {
    id?: number;
    createdAt?: string | null;
    focus: string;
    name: string;
    numberOfWeeks: number;
    template: string;
    userId: number;
}
export { Mesocycle };
