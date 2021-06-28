import path from 'path'
import { fetch } from 'fs-recursive'
import YAML from 'js-yaml'
import { Connection, createConnection } from 'typeorm'
import { Driver } from './types/Database'
import Dispatcher from './Dispatcher'
import { appRoot, files } from './helpers/Directory'
import { filterEnvironment, validateEnvironment } from './helpers/Environment'

export default class Connect {
  public static $instance: Connect
  public connexion!: Connection

  public static getInstance () {
    if (!this.$instance) {
      this.$instance = new Connect()
    }
    return this.$instance
  }

  public async loadEnvironment () {
    const environment = await fetch(process.cwd(),
      ['env', 'json', 'yaml', 'yml'],
      'utf-8',
      ['node_modules'])

    const environments = Array.from(environment.entries())
      .filter(([_, file]) => file.filename === 'environment' || file.extension === 'env')
      .map(([_, file]) => file)

    const env = environments.find(file => file.extension === 'env')

    if (env) {
      const database = filterEnvironment('DATABASE')

      validateEnvironment(database)

      return {
        type: env.extension,
        path: env.path,
        content: {
          DATABASE: {
            DRIVER: database?.DRIVER,
            PATH: database?.PATH,
          },
        },
      }
    }

    const json = environments.find(file => file.extension === 'json')
    if (json) {
      const content = await json.getContent('utf-8')
      const parsedContent = JSON.parse(content!.toString())
      const database = parsedContent?.DATABASE

      validateEnvironment(database)

      return {
        type: json.extension,
        path: json.path,
        content: JSON.parse(content!.toString()),
      }
    }

    const yaml = environments.find(file => file.extension === 'yaml' || file.extension === 'yml')
    if (yaml) {
      const content = await yaml.getContent('utf-8')
      const parsedYAMLContent = YAML.parse(content!.toString())
      const database = parsedYAMLContent?.DATABASE

      validateEnvironment(database)

      return {
        type: yaml.extension,
        path: yaml.path,
        content: YAML.load(content!.toString()),
      }
    }

    throw new Error('Environment file is missing, please create one.')
  }

  private async initialize () {
    const environment = (await this.loadEnvironment()).content

    const modelDispatcher = new Dispatcher(await files(appRoot))
    await modelDispatcher.dispatch('model')

    const migrationDispatcher = new Dispatcher(await files(appRoot))
    await migrationDispatcher.dispatch('migration')

    this.connexion = await this.createConnection(
      environment.DATABASE.DRIVER,
      environment.DATABASE,
      modelDispatcher.items,
      migrationDispatcher.items,
    )

    // await connexion.runMigrations({
    //   transaction: 'each',
    // })
  }

  private async createConnection (driver: Driver, credentials: any, models: any[], migrations: any[]): Promise<Connection> {
    const modelsInstance = models.map((model: any) => model.default)
    const migrationsInstance = migrations.map((migration: any) => migration.file.path)
    const drivers = {
      MySQL: () => this.createMySQLConnexion(credentials, modelsInstance, migrationsInstance),
      SQLite: () => this.createSQLiteConnexion(credentials, modelsInstance, migrationsInstance),
      unknown: () => new Error('The requested database does not exist, please select a valid one.'),
    }

    return (drivers[driver] || drivers.unknown)()
  }

  private async createMySQLConnexion (credentials: any, models: any[], migrations: any[]): Promise<Connection> {
    return createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: models,
      migrations,
    })
  }

  private async createSQLiteConnexion (credentials: any, models: any[], migrations: any[]): Promise<Connection> {
    return createConnection({
      type: 'sqlite',
      database: path.join(process.cwd(), credentials.PATH),
      entities: models,
      migrations,
    })
  }
}