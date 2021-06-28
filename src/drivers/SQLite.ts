import path from 'path'
import { Connection, createConnection } from 'typeorm'
import BaseDriver from '../bases/BaseDriver'
import { Credentials } from '../types/Database'

export default class SQLite extends BaseDriver {
  constructor (public credentials: Credentials, public models, public migrations) {
    super('SQLite')
  }

  public validate (): SQLite {
    if (!this.credentials.PATH) {
      throw new Error('The path to your SQLite database is missing from your environment file.')
    }
    return this
  }

  public connect (): Promise<Connection> {
    return createConnection({
      type: 'sqlite',
      database: path.join(process.cwd(), this.credentials.PATH || 'database.sql'),
      entities: this.models,
      migrations: this.migrations,
    })
  }
}