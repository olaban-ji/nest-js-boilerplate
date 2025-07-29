import { Filter, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

@Index({ properties: ['deletedAt'] })
@Filter({ name: 'softDelete', cond: { deletedAt: null }, default: true })
export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv7();

  @Property({
    type: 'timestamptz',
    nullable: true,
    comment: 'Soft delete timestamp',
  })
  deletedAt?: Date;

  @Property({
    type: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    comment: 'Record creation timestamp',
  })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
    comment: 'Record last update timestamp',
  })
  updatedAt: Date = new Date();
}
