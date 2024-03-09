import type { PlatformaticApp, PlatformaticDBMixin, PlatformaticDBConfig, Entity, Entities, EntityHooks } from '@platformatic/db'
import { EntityTypes, Mesocycle,MesocycleTemplate,User } from './types'

declare module 'fastify' {
  interface FastifyInstance {
    getSchema<T extends 'Mesocycle' | 'MesocycleTemplate' | 'User'>(schemaId: T): {
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
  mesocycle: Entity<Mesocycle>,
    mesocycleTemplate: Entity<MesocycleTemplate>,
    user: Entity<User>,
}

interface AppEntityHooks {
  addEntityHooks(entityName: 'mesocycle', hooks: EntityHooks<Mesocycle>): any
    addEntityHooks(entityName: 'mesocycleTemplate', hooks: EntityHooks<MesocycleTemplate>): any
    addEntityHooks(entityName: 'user', hooks: EntityHooks<User>): any
}

declare module 'fastify' {
  interface FastifyInstance {
    platformatic: PlatformaticApp<PlatformaticDBConfig> &
      PlatformaticDBMixin<AppEntities> &
      AppEntityHooks
  }
}
