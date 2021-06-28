export type Driver = 'PostgreSQL' | 'MySQL' | 'SQLite'

export type FileType = 'model' | 'migration'

export type Credentials = {
  HOST?: string
  PORT?: number
  NAME?: string
  USERNAME?: string
  PASSWORD?: string
  PATH?: string
}