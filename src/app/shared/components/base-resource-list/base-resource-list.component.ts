import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';

export abstract class BaseResourceList<T extends BaseResourceModel>
  implements OnInit {
  resources: T[] = [];
  constructor(private resourceService: BaseResourceService<T>) {}

  ngOnInit(): void {
    this.resourceService.getAll().subscribe(
      (resources) => (this.resources = resources),
      (error) => alert('Erro ao carregar Lista')
    );
  }

  deleteResource(resource: T): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (!mustDelete) return;
    this.resourceService.delete(resource.id).subscribe(
      () =>
        (this.resources = this.resources.filter((item) => item != resource)),
      (error) => console.log('Erro ao tentar excluir', error)
    );
  }
}
