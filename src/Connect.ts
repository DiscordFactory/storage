import { Connection } from 'typeorm'
import Dispatcher from './Dispatcher'
import { appRoot, files } from './helpers/Directory'
import DriverManager from './DriverManager'
import Yaml from './environments/Yaml'
import Env from './environments/Env'
import Json from './environments/Json'
import { environment } from './helpers/Environment'

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
    const environments = Array.from((await environment()).entries())
      .filter(([_, file]) => file.filename === 'environment' || file.extension === 'env')
      .map(([_, file]) => file)

    const env = await new Env(environments)
      .filter()
      .run()

    if (env) {
      return env
    }

    const json = await new Json(environments)
      .filter()
      .run()

    if (json) {
      return json
    }

    const yaml = await new Yaml(environments)
      .filter()
      .run()

    if (yaml) {
      return yaml
    }

    throw new Error('Environment file is missing, please create one.')
  }

  public async initialize () {
    const environment = (await this.loadEnvironment()).content

    const modelDispatcher = new Dispatcher(await files(appRoot))
    await modelDispatcher.dispatch('model')

    const migrationDispatcher = new Dispatcher(await files(appRoot))
    await migrationDispatcher.dispatch('migration')

    const driverManager = new DriverManager()
    this.connexion = await driverManager.createConnection(
      environment.DATABASE.DRIVER,
      environment.DATABASE,
      modelDispatcher.items,
      migrationDispatcher.items,
    )
  }
}