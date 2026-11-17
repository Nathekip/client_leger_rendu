import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { DepartmentChartComponent } from './department-chart.component';

describe('DepartmentChartComponent', () => {
  it('renders the department distribution with an accessible label', () => {
    const fixture = TestBed.createComponent(DepartmentChartComponent);
    fixture.componentInstance.rows = [
      { department: 'European Paintings', count: 3, percentage: 75 },
      { department: 'Arts of Asia', count: 1, percentage: 25 },
    ];

    fixture.detectChanges();

    const chart = fixture.nativeElement.querySelector('.chart') as HTMLElement;
    expect(fixture.nativeElement.querySelectorAll('.chart-row')).toHaveLength(2);
    expect(chart.getAttribute('aria-label')).toContain('European Paintings, 3');
  });
});
