import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastContainerComponent } from './ui/toast-container/toast-container.component';
import { FormFieldErrorComponent } from './ui/form-field-error/form-field-error.component';
import { AreaShellComponent } from './ui/area-shell/area-shell.component';

@NgModule({
  declarations: [
    ToastContainerComponent,
    FormFieldErrorComponent,
    AreaShellComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    ToastContainerComponent,
    FormFieldErrorComponent,
    AreaShellComponent
  ]
})
export class SharedModule {}
