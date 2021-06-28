import File from 'fs-recursive/build/File'

export default class Dispatcher {
  public databaseModels: any[] = []
  constructor (private files: Map<string, File>) {
  }

  public async dispatch () {
    this.databaseModels = await Promise.all(
      Array.from(this.files).map(async ([key, file]) => {
        const res = await import(file.path)
        const fileType = new res.default().type
        
        if (fileType === 'databaseModel') {
          return {
            type: fileType,
            default: res.default,
            file,
          }
        }
      }).filter(file => file),
    )
  }
}