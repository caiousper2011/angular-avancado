import { CategoryService } from './../../categories/shared/category.service';
import { EntryService } from './../shared/services/entry.service';
import { Entry } from './../shared/models/entry.model';
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
import { Category } from '../../categories/shared/category.model';
@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css'],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category> = [];
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    normalizeZeros: true,
    padFractionalZeros: true,
    radix: ',',
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    monthNamesShort: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    today: 'Hoje',
    clear: 'Limpar',
  };

  constructor(
    private entryService: EntryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCaategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;
    if (this.currentAction == 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(([value, text]) => ({
      text,
      value,
    }));
  }

  private setCurrentAction(): void {
    if (this.activatedRoute.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry(): void {
    if (this.currentAction == 'edit') {
      this.activatedRoute.paramMap
        .pipe(switchMap((param) => this.entryService.getById(+param.get('id'))))
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(this.entry);
          },
          (error) => console.log('Ocorreu um erro no servidor', error)
        );
    }
  }

  private loadCaategories(): void {
    this.categoryService
      .getAll()
      .subscribe((categories) => (this.categories = categories));
  }

  private setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Novo Lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Lançamento: ' + entryName;
    }
  }

  private createEntry(): void {
    const entry: Entry = {
      ...new Entry(),
      ...this.entryForm.value,
    };

    this.entryService.create(entry).subscribe(
      (entry) => this.actionFormSuccess(entry),
      (error) => this.actionFormError(error)
    );
  }

  private actionFormSuccess(entry: Entry): void {
    toastr.success('Solicitação processada com sucesso');

    this.router
      .navigateByUrl('entries', { skipLocationChange: true })
      .then(() => this.router.navigate(['entries', entry.id, 'edit']));
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

  private updateEntry(): void {
    const entry: Entry = {
      ...new Entry(),
      ...this.entryForm.value,
    };

    this.entryService.update(entry).subscribe(
      (entry) => this.actionFormSuccess(entry),
      (error) => this.actionFormError(error)
    );
  }
}
