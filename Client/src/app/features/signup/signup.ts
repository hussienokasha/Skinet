import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-signup',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  accountService = inject(AccountService);
  router = inject(Router);
  fb = inject(FormBuilder);
  showPassword = false;
  validationErrors = signal<string[]>([])

  registerForm = this.fb.group({
    firstName: ['',[Validators.required]],
    lastName: ['',[Validators.required]],
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.required]],
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: (d) => {

        this.router.navigateByUrl('/login');

      },
      error:(error)=>{
        console.log(error)
        this.validationErrors.set(error)
      }

    });
  }
}
