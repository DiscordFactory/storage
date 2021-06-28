import File from 'fs-recursive/build/File'
import YAML from 'js-yaml'
import BaseEnvironment from '../bases/BaseEnvironment'
import { validateEnvironment } from '../helpers/Environment'

export default class Yaml extends BaseEnvironment {
  public file: File | undefined

  constructor (public files: File[]) {
    super('yaml')
  }

  public filter (): this {
    this.file = this.files.find((file: File) => {
      return file.extension === 'yaml' || file.extension === 'yml'
    })
    return this
  }

  public async run () {
    if (!this.file) {
      return
    }

    const content = await this.file.getContent('utf-8')
    const parsed = this.parse(content!.toString())

    validateEnvironment(parsed.DATABASE)

    return {
      type: this.file.extension,
      path: parsed.DATABASE.path,
      content: parsed,
    }
  }

  protected parse (content: string) {
    return YAML.load(content)
  }
}