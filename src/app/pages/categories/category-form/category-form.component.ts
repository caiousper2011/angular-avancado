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

  submitForm(): void {
    this.submittingForm = true;
    if (this.currentAction == 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  private setCurrentAction(): void {
    if (this.activatedRoute.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm(): void {
    this.categotyForm = this.formBuilder.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      description: [null, { disabled: true }],
    });
  }

  private loadCategory(): void {
    if (this.currentAction == 'edit') {
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
  }

  private setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory(): void {
    const category: Category = {
      ...new Category(),
      ...this.categotyForm.value,
    };

    this.categoryService.create(category).subscribe(
      (category) => this.actionFormSuccess(category),
      (error) => this.actionFormError(error)
    );
  }

  private actionFormSuccess(category: Category): void {
    toastr.success('Solicitação processada com sucesso');

    this.router
      .navigateByUrl('categories', { skipLocationChange: true })
      .then(() => this.router.navigate(['categories', category.id, 'edit']));
  }

  private actionFormError(error: any): void {
    toastr.error('Ocorreu um erro ao processar a sua solicitação');
    this.submittingForm = false;
    if (error.status == 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = [
        'Falha na comunicação com o servidor. Por favor, tente mais tarde',
      ];
    }
  }

  private updateCategory(): void {
    const category: Category = {
      ...new Category(),
      ...this.categotyForm.value,
    };

    this.categoryService.update(category).subscribe(
      (category) => this.actionFormSuccess(category),
      (error) => this.actionFormError(error)
    );
  }
}
