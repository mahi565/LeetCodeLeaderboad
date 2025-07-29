import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeetCodeService, Competitor, AddCompetitorRequest } from '../../services/leetcode.service';

@Component({
  selector: 'app-competitors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Manage Competitors</h1>
        
        <form (ngSubmit)="addCompetitor()" #competitorForm="ngForm" class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="leetCodeUsername" class="block text-sm font-medium text-gray-700 mb-2">
                LeetCode Username *
              </label>
              <input
                type="text"
                id="leetCodeUsername"
                name="leetCodeUsername"
                [(ngModel)]="newCompetitor.leetCodeUsername"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">
                Display Name (Optional)
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                [(ngModel)]="newCompetitor.displayName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter display name"
              />
            </div>
            
            <div class="flex items-end">
              <button
                type="submit"
                [disabled]="!competitorForm.form.valid || loading"
                class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
              >
                {{ loading ? 'Adding...' : 'Add Competitor' }}
              </button>
            </div>
          </div>
        </form>

        <div *ngIf="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>

        <div *ngIf="success" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ success }}
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Your Competitors</h2>
        
        <div *ngIf="competitors.length > 0; else noCompetitorBlock" class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Display Name</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Added</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let competitor of competitors" class="border-b hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <span class="font-medium text-gray-900">
                    {{ competitor.displayName || competitor.leetCodeUsername }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-gray-600">{{ '@' + competitor.leetCodeUsername }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-sm text-gray-500">{{ competitor.addedAt | date:'short' }}</span>
                </td>
                <td class="px-4 py-3">
                  <button
                    (click)="removeCompetitor(competitor.id)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #noCompetitorBlock>
          <div class="text-center py-8">
            <p class="text-gray-500">No competitors added yet. Add some competitors to track their progress!</p>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class CompetitorsComponent implements OnInit {
  competitors: Competitor[] = [];
  newCompetitor: AddCompetitorRequest = {
    leetCodeUsername: '',
    displayName: ''
  };

  loading = false;
  error = '';
  success = '';

  constructor(private leetCodeService: LeetCodeService) {}

  ngOnInit(): void {
    this.loadCompetitors();
  }

  loadCompetitors(): void {
    this.leetCodeService.getCompetitors().subscribe({
      next: (competitors) => {
        this.competitors = competitors;
      },
      error: () => {
        this.error = 'Failed to load competitors';
      }
    });
  }

  addCompetitor(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.leetCodeService.addCompetitor(this.newCompetitor).subscribe({
      next: (competitor) => {
        this.competitors.push(competitor);
        this.newCompetitor = { leetCodeUsername: '', displayName: '' };
        this.success = 'Competitor added successfully!';
        this.loading = false;

        setTimeout(() => (this.success = ''), 3000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to add competitor';
        this.loading = false;
      }
    });
  }

  removeCompetitor(competitorId: number): void {
    if (!confirm('Are you sure you want to remove this competitor?')) return;

    this.leetCodeService.removeCompetitor(competitorId).subscribe({
      next: () => {
        this.competitors = this.competitors.filter((c) => c.id !== competitorId);
        this.success = 'Competitor removed successfully!';
        setTimeout(() => (this.success = ''), 3000);
      },
      error: () => {
        this.error = 'Failed to remove competitor';
      }
    });
  }
}
