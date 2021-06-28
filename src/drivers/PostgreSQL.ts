import { Connection, createConnection } from 'typeorm'
import BaseDriver from '../bases/BaseDriver'
import { Credentials } from '../types/Database'

export default class PostgreSQL extends BaseDriver {
  constructor (public credentials: Credentials, public models, public migrations) {
    super('PostgreSQL')
  }

  public validate (): PostgreSQL {
    if (!this.credentials.HOST || !this.credentials.USERNAME || !this.credentials.PORT || !this.credentials.NAME) {
      throw new Error('Your database configuration is incomplete or invalid.')
    }
    return this
  }

  public connect (): Promise<Connection> {
    return createConnection({
      type: 'postgres',
      host: this.credentials.HOST || 'localhost',
      port: this.credentials.PORT || 3306,
      username: this.credentials.USERNAME || 'root',
      password: this.credentials.PASSWORD || '',
      database: this.credentials.NAME || 'discord_factory',
      entities: this.models,
      migrations: this.migrations,
    })
  }
}