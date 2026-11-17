import { Component, Input } from '@angular/core';

export interface DepartmentChartRow {
  department: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-department-chart',
  template: `
    @if (rows.length) {
      <div class="chart" role="img" [attr.aria-label]="chartLabel">
        @for (row of rows; track row.department) {
          <div class="chart-row">
            <div class="chart-heading">
              <span>{{ row.department }}</span>
              <span>{{ row.count }}</span>
            </div>
            <div class="chart-track">
              <span class="chart-bar" [style.width.%]="row.percentage"></span>
            </div>
          </div>
        }
      </div>
    } @else {
      <p class="chart-empty">Les données apparaîtront avec les résultats.</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .chart {
      display: grid;
      gap: 1.15rem;
    }
    .chart-row {
      display: grid;
      gap: 0.45rem;
    }
    .chart-heading {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      color: #4a453e;
      font-size: 0.76rem;
    }
    .chart-heading span:first-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chart-heading span:last-child {
      color: #8e877e;
      font-variant-numeric: tabular-nums;
    }
    .chart-track {
      height: 5px;
      background: #e7e1d7;
      border-radius: 99px;
      overflow: hidden;
    }
    .chart-bar {
      display: block;
      height: 100%;
      background: #b94d2b;
      border-radius: inherit;
    }
    .chart-empty {
      color: #837b71;
      font-size: 0.8rem;
      line-height: 1.6;
    }
  `,
})
export class DepartmentChartComponent {
  @Input() rows: DepartmentChartRow[] = [];

  get chartLabel(): string {
    return `Répartition par département parmi les œuvres affichées : ${this.rows
      .map((row) => `${row.department}, ${row.count}`)
      .join('; ')}`;
  }
}
