import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';
import { Component } from '@angular/core';
import { BaseResourceList } from 'src/app/shared/components/base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent extends BaseResourceList<Category> {
  get categories(): Category[] {
    return this.resources;
  }
  constructor(protected categoryService: CategoryService) {
    super(categoryService);
  }
}
