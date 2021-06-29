import { MigrationInterface, QueryRunner } from 'typeorm'

export default abstract class BaseSchema implements MigrationInterface {
  public abstract up (query: QueryRunner): Promise<any>
  public abstract down (query: QueryRunner): Promise<any>
}