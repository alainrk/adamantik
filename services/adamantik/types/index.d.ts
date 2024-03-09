import { Exercise } from './Exercise'
import { ExerciseInstance } from './ExerciseInstance'
import { Mesocycle } from './Mesocycle'
import { MesocycleTemplate } from './MesocycleTemplate'
import { User } from './User'
import { Week } from './Week'
import { WeekTemplate } from './WeekTemplate'
import { Workout } from './Workout'
  
interface EntityTypes  {
  Exercise: Exercise
    ExerciseInstance: ExerciseInstance
    Mesocycle: Mesocycle
    MesocycleTemplate: MesocycleTemplate
    User: User
    Week: Week
    WeekTemplate: WeekTemplate
    Workout: Workout
}
  
export { EntityTypes, Exercise, ExerciseInstance, Mesocycle, MesocycleTemplate, User, Week, WeekTemplate, Workout }