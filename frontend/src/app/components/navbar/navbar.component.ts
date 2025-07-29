import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-bold text-gray-800">LeetCode Tracker</h1>
            <div *ngIf="currentUser" class="hidden md:flex space-x-4">
              <a routerLink="/dashboard" 
                 class="text-gray-600 hover:text-blue-600 transition-colors"
                 routerLinkActive="text-blue-600 font-semibold">
                Dashboard
              </a>
              <a routerLink="/leaderboard" 
                 class="text-gray-600 hover:text-blue-600 transition-colors"
                 routerLinkActive="text-blue-600 font-semibold">
                Leaderboard
              </a>
              <a routerLink="/competitors" 
                 class="text-gray-600 hover:text-blue-600 transition-colors"
                 routerLinkActive="text-blue-600 font-semibold">
                Competitors
              </a>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div *ngIf="currentUser; else authLinks" class="flex items-center space-x-4">
              <span class="text-gray-600">Welcome, {{ currentUser.email }}</span>
              <button (click)="logout()" 
                      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors">
                Logout
              </button>
            </div>
            
            <ng-template #authLinks>
              <a routerLink="/login" 
                 class="text-gray-600 hover:text-blue-600 transition-colors"
                 routerLinkActive="text-blue-600 font-semibold">
                Login
              </a>
              <a routerLink="/register" 
                 class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                Register
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}