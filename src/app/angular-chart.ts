import { Chart } from '@angular-charts/chart-engine';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';

/* eslint-disable */

@Component({
  selector: 'angular-chart',
  template: `
  <canvas id="chart"></canvas>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class AngularChart {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.chart = new Chart(document, 'chart');
    console.log(this.chart)
  }

  chart: Chart;
}
