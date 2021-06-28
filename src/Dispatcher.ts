import File from 'fs-recursive/build/File'
import { FileType } from './types/Database'

export default class Dispatcher {
  public items: any[] = []
  constructor (private files: Map<string, File>) {
  }

  public async dispatch (type: FileType) {
    const models = await Promise.all(
      Array.from(this.files).map(async ([key, file]) => {
        const res = await import(file.path)

        if (!res.default) {
          return
        }
        const fileType = (new res.default()).type
        
        if (res.default && fileType === type) {
          return {
            type: fileType,
            default: res.default,
            file,
          }
        }
      }),
    )

    this.items = models.filter(i => i)
  }
}