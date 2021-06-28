import { Connection, createConnection } from 'typeorm'
import BaseDriver from '../bases/BaseDriver'
import { Credentials } from '../types/Database'

export default class MySQL extends BaseDriver {
  constructor (public credentials: Credentials, public models, public migrations) {
    super('MySQL')
  }

  public validate (): MySQL {
    if (!this.credentials.HOST || !this.credentials.PORT || !this.credentials.USERNAME || !this.credentials.NAME) {
      throw new Error('Your database configuration is incomplete or invalid.')
    }
    return this
  }

  public connect (): Promise<Connection> {
    return createConnection({
      type: 'mysql',
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