import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';
import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      (categories) => (this.categories = categories),
      (error) => console.log('Erro ao carregar Lista', error)
    );
  }

  deleteCategory(category): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (!mustDelete) return;
    this.categoryService.delete(category.id).subscribe(
      () =>
        (this.categories = this.categories.filter((item) => item != category)),
      (error) => console.log('Erro ao tentar excluir', error)
    );
  }
}
