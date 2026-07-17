import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../core/services/account-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  accountService = inject(AccountService);
  router = inject(Router);
  fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);


  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });


  onSubmit() {

   const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ?? '/';

    this.accountService.login(this.loginForm.value).subscribe({
      next: (d) => {
        this.accountService.getCurrentUser().subscribe();
        this.router.navigateByUrl(returnUrl);

      },

    });
  }



}
