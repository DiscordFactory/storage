import { BaseEntity } from 'typeorm'
import { FileType } from './types/Database'

export default class BaseModel extends BaseEntity {
  public type: FileType = 'model'
}