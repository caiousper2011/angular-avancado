import { CategoryService } from './../shared/category.service';
import { Category } from './../shared/category.model';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  categotyForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction(): void {
    this.activatedRoute.snapshot.url[0].path == 'new'
      ? (this.currentAction = 'new')
      : 'edit';
  }
  private buildCategoryForm(): void {
    this.categotyForm = this.formBuilder.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/\d.*/),
        ],
      ],
      description: [null, { disabled: true }],
    });
  }

  private loadCategory(): void {
    if (this.currentAction != 'edit') return;
    this.activatedRoute.paramMap
      .pipe(
        switchMap((param) => this.categoryService.getById(+param.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categotyForm.patchValue(this.category);
        },
        (error) => console.log('Ocorreu um erro no servidor', error)
      );
  }

  private setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }
}
