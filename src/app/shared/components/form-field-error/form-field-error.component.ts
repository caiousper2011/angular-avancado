import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{ errorMessage }}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css'],
})
export class FormFieldErrorComponent implements OnInit {
  @Input('form-control') public formControl: FormControl;

  constructor() {}

  ngOnInit(): void {}

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    }
    return null;
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if (this.formControl.errors.required) {
      return 'Dado Obrigatório';
    } else if (this.formControl.errors.email) {
      return 'Este email não é válido';
    } else if (this.formControl.errors.minlength) {
      const { requiredLength } = this.formControl.errors.minlength;
      return `Deve ter no mínimo ${requiredLength} caracteres`;
    } else if (this.formControl.errors.maxlength) {
      const { requiredLength } = this.formControl.errors.maxlength;
      return `Deve ter no máximo ${requiredLength} caracteres`;
    }
    return null;
  }
}
