import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private statistics: any[] = [];

  constructor() {}

  getStatistics(): Promise<Object[]> {
    return Promise.resolve(this.statistics);
  }

  postStatistic(stat: any) {
    this.statistics.push(stat);
  }
}