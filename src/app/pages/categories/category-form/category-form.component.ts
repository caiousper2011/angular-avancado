import { Component, Injector } from '@angular/core';
import { CategoryService } from './../shared/category.service';
import { Category } from './../shared/category.model';
import { Validators } from '@angular/forms';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {
  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new Category(), categoryService, Category.fromJson);
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, { disabled: true }],
    });
  }

  protected creationPageTitle(): string {
    return 'Cadastro de nova categoria';
  }

  protected editionPageTitle(): string {
    const categoryName = this.resource.name || '';
    return `Editando categoria: ${categoryName}`;
  }
}
