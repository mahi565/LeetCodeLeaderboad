import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeetCodeService, LeetCodeStats } from '../../services/leetcode.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-blue-100 to-indigo-200 rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
        <img src="https://cdn-icons-png.flaticon.com/512/2721/2721679.png" alt="LeetCode Icon" class="w-20 h-20 rounded-lg shadow" />

        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-800 mb-1">Welcome, {{ currentUser?.email }}</h1>
          <p class="text-gray-700">
            LeetCode Profile:
            <span class="font-semibold text-blue-700">{{ currentUser?.leetCodeUsername || 'Not Set' }}</span>
          </p>
        </div>

        <div class="flex flex-col gap-2 md:flex-row">
          <button 
            (click)="refreshStats()" 
            [disabled]="loading" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition disabled:bg-gray-400">
            {{ loading ? 'Refreshing...' : 'Refresh Stats' }}
          </button>
          <a routerLink="/competitors" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition text-center">
            View Competitors
          </a>
          <a routerLink="/leaderboard" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition text-center">
            Leaderboard
          </a>
        </div>
      </div>

      <ng-container *ngIf="stats">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Solved</h3>
            <p class="text-3xl font-bold text-blue-600">{{ stats.totalSolved }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Contest Rating</h3>
            <p class="text-3xl font-bold text-green-600">{{ stats.contestRating }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Global Ranking</h3>
            <p class="text-3xl font-bold text-purple-600">#{{ stats.ranking | number }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Acceptance Rate</h3>
            <p class="text-3xl font-bold text-orange-600">{{ stats.acceptanceRate }}%</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Problem Breakdown</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-green-50 rounded-lg shadow">
              <h3 class="text-lg font-semibold text-green-700">Easy</h3>
              <p class="text-2xl font-bold text-green-600">{{ stats.easySolved }}</p>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg shadow">
              <h3 class="text-lg font-semibold text-yellow-700">Medium</h3>
              <p class="text-2xl font-bold text-yellow-600">{{ stats.mediumSolved }}</p>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg shadow">
              <h3 class="text-lg font-semibold text-red-700">Hard</h3>
              <p class="text-2xl font-bold text-red-600">{{ stats.hardSolved }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="stats.totalSubmissions?.length" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Total Submissions (By Difficulty)</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div *ngFor="let sub of stats.totalSubmissions" class="p-4 rounded-lg bg-slate-50 border">
              <h3 class="text-lg font-semibold capitalize text-gray-700">{{ sub.difficulty }}</h3>
              <p class="text-sm text-gray-600">Problems Attempted: <span class="font-bold">{{ sub.count }}</span></p>
              <p class="text-sm text-gray-600">Submissions: <span class="font-bold">{{ sub.submissions }}</span></p>
            </div>
          </div>
        </div>

        <div *ngIf="stats.recentSubmissions?.length" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Recent Submissions</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-2 text-sm font-semibold text-gray-700">Title</th>
                  <th class="p-2 text-sm font-semibold text-gray-700">Language</th>
                  <th class="p-2 text-sm font-semibold text-gray-700">Status</th>
                  <th class="p-2 text-sm font-semibold text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let sub of stats.recentSubmissions" class="border-b hover:bg-gray-50">
                  <td class="p-2 text-blue-600">
                    <a [href]="'https://leetcode.com/problems/' + sub.titleSlug" target="_blank" class="hover:underline">
                      {{ sub.title }}
                    </a>
                  </td>
                  <td class="p-2">{{ sub.lang }}</td>
                  <td class="p-2">{{ sub.statusDisplay }}</td>
                  <td class="p-2">{{ (+sub.timestamp) * 1000 | date: 'medium' }}</td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ng-container>

      <div *ngIf="error" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: LeetCodeStats | null = null;
  loading = false;
  error = '';

  constructor(
    private leetCodeService: LeetCodeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.leetCodeUsername) {
        this.refreshStats();
      }
    });
  }

  refreshStats(): void {
    if (!this.currentUser?.leetCodeUsername) return;

    this.loading = true;
    this.error = '';

    this.leetCodeService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to fetch stats';
        this.loading = false;
      }
    });
  }
}
