import { MigrationContext } from '../types/Migration'
import { getConnexion } from '../helpers/Database'

export function useMigrations (): MigrationContext {
  return {
    migrate: () => getConnexion().runMigrations(),
    rollback: () => getConnexion().undoLastMigration(),
    connected: getConnexion().isConnected,
    migrations: getConnexion().migrations,
  }
}