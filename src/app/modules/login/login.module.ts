import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { ComponentsModule } from '@app/components/components.module';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    ReactiveFormsModule,
    LoginRoutingModule,
    ComponentsModule,
    CommonModule
  ],
})
export default class LoginModule { }
