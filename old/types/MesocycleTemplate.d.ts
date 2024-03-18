/**
 * MesocycleTemplate
 * A MesocycleTemplate
 */
declare interface MesocycleTemplate {
    id?: number;
    createdAt?: string | null;
    focus: string;
    name: string;
    numberOfDays: number;
    template: string;
    userId?: number | null;
}
export { MesocycleTemplate };
