import File from 'fs-recursive/build/File'
import YAML from 'js-yaml'
import BaseEnvironment from '../bases/BaseEnvironment'
import { filterEnvironment, validateEnvironment } from '../helpers/Environment'

export default class Env extends BaseEnvironment {
  public file: File | undefined

  constructor (public files: File[]) {
    super('env')
  }

  public filter (): this {
    this.file = this.files.find((file: File) => {
      return file.extension === 'env'
    })
    return this
  }

  public async run () {
    if (!this.file) {
      return
    }
    const database = filterEnvironment('DATABASE')

    validateEnvironment(database)

    return {
      type: this.file.extension,
      path: this.file.path,
      content: {
        DATABASE: {
          DRIVER: database?.DRIVER,
          PATH: database?.PATH,
        },
      },
    }
  }

  protected parse (content: string) {
    return YAML.load(content)
  }
}