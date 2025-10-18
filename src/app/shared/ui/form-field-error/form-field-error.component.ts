import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const DEFAULT_MESSAGES: Record<string, string> = {
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  minlength: 'Value is too short.',
  maxlength: 'Value is too long.',
  pattern: 'Value has an invalid format.'
};

@Component({
  selector: 'app-form-field-error',
  standalone: false,
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() messages: Record<string, string> = {};

  get shouldShow(): boolean {
    const control = this.control;
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get message(): string | null {
    const control = this.control;
    if (!control?.errors) { return null; }
    const [firstKey] = Object.keys(control.errors);
    if (!firstKey) { return null; }
    return this.messages[firstKey] ?? DEFAULT_MESSAGES[firstKey] ?? 'Invalid value.';
  }
}
