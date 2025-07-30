import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6">Register</h2>

      <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            [(ngModel)]="userData.email"
            required
            email
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="userData.password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password (min 6 characters)"
          />
        </div>

        <div class="mb-6">
          <label for="leetCodeUsername" class="block text-sm font-medium text-gray-700 mb-2">
            LeetCode Username (required for LeetCode stats)
          </label>
          <input
            type="text"
            id="LeetCodeUsername"
            name="LeetCodeUsername"
            [(ngModel)]="userData.leetCodeUsername"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your LeetCode username"
          />
        </div>

        <div *ngIf="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          [disabled]="!registerForm.form.valid || loading"
          class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <p class="text-center mt-4 text-gray-600">
        Already have an account?
        <a routerLink="/login" class="text-blue-500 hover:text-blue-600">Login here</a>
      </p>
    </div>
  `
})
export class RegisterComponent {
  userData: RegisterRequest = {
    email: '',
    password: '',
    leetCodeUsername: ''
  };

  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = '';

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
