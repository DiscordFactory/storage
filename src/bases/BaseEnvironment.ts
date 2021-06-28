import { EnvironmentType } from '../types/Environment'

export default abstract class BaseEnvironment {
  protected constructor (public environmentType: EnvironmentType) {
  }

  public abstract filter (): this

  public abstract run (): Promise<any>

  protected abstract parse (content: string): any
}