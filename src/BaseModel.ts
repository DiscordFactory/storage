import { BaseEntity, Entity } from 'typeorm'
import { FileType } from './types/Database'

@Entity()
export default class BaseModel extends BaseEntity {
  public type: FileType = 'model'
}