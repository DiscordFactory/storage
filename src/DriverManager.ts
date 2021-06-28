import { Connection } from 'typeorm'
import { Driver } from './types/Database'
import MySQL from './drivers/MySQL'
import SQLite from './drivers/SQLite'
import PostgreSQL from './drivers/PostgreSQL'

export default class DriverManager {
  public async createConnection (driver: Driver, credentials: any, models: any[], migrations: any[]): Promise<Connection> {
    const modelsInstance = models.map((model: any) => model.default)
    const migrationsInstance = migrations.map((migration: any) => migration.file.path)

    const drivers = {
      MySQL: async () => new MySQL(credentials, modelsInstance, migrationsInstance).connect(),
      SQLite: async () => new SQLite(credentials, modelsInstance, migrationsInstance).connect(),
      PostgreSQL: async () => new PostgreSQL(credentials, modelsInstance, migrationsInstance).connect(),
      unknown: () => new Error('The requested database does not exist, please select a valid one.'),
    }

    return (drivers[driver] || drivers.unknown)()
  }
}