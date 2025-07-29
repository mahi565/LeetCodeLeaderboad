import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contestRating: number;
  contestGlobalRanking: number;
  contributionPoints: number;
  reputation: number;
  lastUpdated: string;
  totalSubmissions: {
    difficulty: string;
    count: number;
    submissions: number;
  }[];
  recentSubmissions: {
    title: string;
    titleSlug: string;
    statusDisplay: string;
    lang: string;
    timestamp: string;
  }[];
  submissionCalendar: { [timestamp: string]: number };
}

export interface Competitor {
  id: number;
  leetCodeUsername: string;
  displayName?: string;
  addedAt: string;
}

export interface AddCompetitorRequest {
  leetCodeUsername: string;
  displayName?: string;
}

export interface LeaderboardEntry {
  username: string;
  displayName?: string;
  totalSolved: number;
  contestRating: number;
  ranking: number;
  isCurrentUser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LeetCodeService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<LeetCodeStats> {
    return this.http.get<LeetCodeStats>(`${environment.apiUrl}/leetcode/stats`);
  }

  getCompetitors(): Observable<Competitor[]> {
    return this.http.get<Competitor[]>(`${environment.apiUrl}/leetcode/competitors`);
  }

  addCompetitor(request: AddCompetitorRequest): Observable<Competitor> {
    return this.http.post<Competitor>(`${environment.apiUrl}/leetcode/competitors`, request);
  }

  removeCompetitor(competitorId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/leetcode/competitors/${competitorId}`);
  }

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${environment.apiUrl}/leetcode/leaderboard`);
  }
}
