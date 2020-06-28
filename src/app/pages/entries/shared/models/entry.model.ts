import { Category } from 'src/app/pages/categories/shared/category.model';
import { BaseResouceModel } from 'src/app/shared/models/base-resouce.model';

export class Entry extends BaseResouceModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public type?: string,
    public amount?: string,
    public date?: string,
    public paid?: boolean,
    public categoryId?: number,
    public category?: Category
  ) {
    super();
  }

  static types = {
    expense: 'Despesa',
    revenue: 'Receita',
  };

  get paidText(): string {
    return this.paid ? 'Pago' : 'Pendente';
  }
}
