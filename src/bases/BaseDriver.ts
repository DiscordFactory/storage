import { Connection } from 'typeorm'
import { Driver } from '../types/Database'

export default abstract class Connexion {
  protected constructor (public driver: Driver) {
  }

  public abstract validate (): Connexion

  public abstract connect (): Promise<Connection>
}