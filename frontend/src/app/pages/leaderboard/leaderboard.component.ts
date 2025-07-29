import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeetCodeService, LeaderboardEntry } from '../../services/leetcode.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Leaderboard</h1>
          <button 
            (click)="refreshLeaderboard()"
            [disabled]="loading"
            class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <div *ngIf="leaderboard.length > 0; else noData" class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Problems Solved</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contest Rating</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Global Ranking</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                *ngFor="let entry of leaderboard; let i = index"
                [class.bg-blue-50]="entry.isCurrentUser"
                class="border-b hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <span 
                      class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white"
                      [ngClass]="{
                        'bg-yellow-500': i === 0,
                        'bg-gray-400': i === 1,
                        'bg-orange-600': i === 2,
                        'bg-blue-500': i > 2
                      }"
                    >
                      {{ i + 1 }}
                    </span>
                    <span *ngIf="entry.isCurrentUser" class="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      YOU
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div>
                    <p class="font-medium text-gray-900">{{ entry.displayName || entry.username }}</p>
                    <p class="text-sm text-gray-500">{{ entry.username }}</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="text-lg font-semibold text-blue-600">{{ entry.totalSolved }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-lg font-semibold text-green-600">{{ entry.contestRating }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-sm text-gray-600">#{{ entry.ranking | number }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #noData>
          <div class="text-center py-8">
            <p class="text-gray-500 mb-4">No data available. Add some competitors to see the leaderboard!</p>
            <a routerLink="/competitors" class="text-blue-500 hover:text-blue-600">
              Add Competitors
            </a>
          </div>
        </ng-template>
      </div>

      <div *ngIf="error" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>
    </div>
  `
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  loading = false;
  error = '';

  constructor(private leetCodeService: LeetCodeService) {}

  ngOnInit(): void {
    this.refreshLeaderboard();
  }

  refreshLeaderboard(): void {
    this.loading = true;
    this.error = '';

    this.leetCodeService.getLeaderboard().subscribe({
      next: (leaderboard) => {
        this.leaderboard = leaderboard;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to fetch leaderboard';
        this.loading = false;
      }
    });
  }
}
