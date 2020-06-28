import { BaseResouceModel } from 'src/app/shared/models/base-resouce.model';

export class Category extends BaseResouceModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string
  ) {
    super();
  }
}
