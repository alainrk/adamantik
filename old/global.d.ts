import type { PlatformaticApp, PlatformaticDBMixin, PlatformaticDBConfig, Entity, Entities, EntityHooks } from '@platformatic/db'
import { EntityTypes, Exercise,ExerciseInstance,Mesocycle,MesocycleTemplate,User,Week,Workout } from './types'

declare module 'fastify' {
  interface FastifyInstance {
    getSchema<T extends 'Exercise' | 'ExerciseInstance' | 'Mesocycle' | 'MesocycleTemplate' | 'User' | 'Week' | 'Workout'>(schemaId: T): {
      '$id': string,
      title: string,
      description: string,
      type: string,
      properties: {
        [x in keyof EntityTypes[T]]: { type: string, nullable?: boolean }
      },
      required: string[]
    };
  }
}

interface AppEntities extends Entities {
  exercise: Entity<Exercise>,
    exerciseInstance: Entity<ExerciseInstance>,
    mesocycle: Entity<Mesocycle>,
    mesocycleTemplate: Entity<MesocycleTemplate>,
    user: Entity<User>,
    week: Entity<Week>,
    workout: Entity<Workout>,
}

interface AppEntityHooks {
  addEntityHooks(entityName: 'exercise', hooks: EntityHooks<Exercise>): any
    addEntityHooks(entityName: 'exerciseInstance', hooks: EntityHooks<ExerciseInstance>): any
    addEntityHooks(entityName: 'mesocycle', hooks: EntityHooks<Mesocycle>): any
    addEntityHooks(entityName: 'mesocycleTemplate', hooks: EntityHooks<MesocycleTemplate>): any
    addEntityHooks(entityName: 'user', hooks: EntityHooks<User>): any
    addEntityHooks(entityName: 'week', hooks: EntityHooks<Week>): any
    addEntityHooks(entityName: 'workout', hooks: EntityHooks<Workout>): any
}

declare module 'fastify' {
  interface FastifyInstance {
    platformatic: PlatformaticApp<PlatformaticDBConfig> &
      PlatformaticDBMixin<AppEntities> &
      AppEntityHooks
  }
}
