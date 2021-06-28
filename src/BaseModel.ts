import { BaseEntity, Entity } from 'typeorm'

@Entity()
export default class BaseModel extends BaseEntity {
  public type = 'databaseModel'
}