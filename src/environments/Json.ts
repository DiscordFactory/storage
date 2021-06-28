import File from 'fs-recursive/build/File'
import BaseEnvironment from '../bases/BaseEnvironment'
import { validateEnvironment } from '../helpers/Environment'

export default class Json extends BaseEnvironment {
  public file: File | undefined

  constructor (public files: File[]) {
    super('json')
  }

  public filter (): this {
    this.file = this.files.find((file: File) => {
      return file.extension === 'json'
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
    return JSON.parse(content)
  }
}