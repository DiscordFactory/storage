import { Migration, MigrationInterface } from 'typeorm'

export type MigrationContext= {
  migrate: () => Promise<Migration[]>
  rollback: () => Promise<void>
  connected: boolean
  migrations: MigrationInterface[]
}