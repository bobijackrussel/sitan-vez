import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent } from './ui/toast-container/toast-container.component';
import { FormFieldErrorComponent } from './ui/form-field-error/form-field-error.component';

@NgModule({
  declarations: [
    ToastContainerComponent,
    FormFieldErrorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    ToastContainerComponent,
    FormFieldErrorComponent
  ]
})
export class SharedModule {}
