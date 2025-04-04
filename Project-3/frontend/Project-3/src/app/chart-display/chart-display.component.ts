import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-chart-display',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chart-display.component.html',
  styleUrls: ['./chart-display.component.css']
})
export class ChartDisplayComponent {
  constructor(private http: HttpClient) {}

  _selectedPair: string = '';
  displayText: string = 'Please select a currency pair to view the chart.';
  currencyPairs = [
    { name: 'EUR/USD', val: 'EUR' },
    { name: 'JPY/USD', val: 'JPY' },
    { name: 'CAD/USD', val: 'CAD' }
  ];

  get selectedPair(): string {
    return this._selectedPair;
  }

  set selectedPair(value: string) {
    this._selectedPair = value;
    if (value) {
      this.displayText = '';
      this.fetchAndRenderChart(value);
    } else {
      this.displayText = 'Please select a currency pair to view the chart.';
    }
  }

  fetchAndRenderChart(pair: string): void {
    this.http.get<any[]>(`http://localhost:5000/${pair}`).subscribe({
      next: (list) => {
        let data = list.map(d => ({
          date: d.Date,
          price: d[" Close"]
        }));

        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const calculateMA = (data: any, period: any) => {
          return data.map((_: any, i: any) => {
            if (i < period - 1) return null;
            const window = data.slice(i - period + 1, i + 1).map((d: { price: any; }) => d.price);
            return window.reduce((sum: any, val: any) => sum + val, 0) / period;
          });
        };

        const dates = data.map(d => d.date);
        const prices = data.map(d => d.price);
        const ma5 = calculateMA(data, 5);
        const ma8 = calculateMA(data, 8);
        const ma13 = calculateMA(data, 13);

        const traces = [
          { x: dates, y: prices, name: `${pair} Price`, mode: 'lines+markers', line: { color: 'black' } },
          { x: dates, y: ma5, name: '5-Day MA', mode: 'lines', line: { color: 'blue' } },
          { x: dates, y: ma8, name: '8-Day MA', mode: 'lines', line: { color: 'orange' } },
          { x: dates, y: ma13, name: '13-Day MA', mode: 'lines', line: { color: 'red' } }
        ];

        const layout: Partial<Plotly.Layout> = {
          title: 'EUR/USD with 5-8-13 Moving Averages',
          xaxis: { title: 'Date' },
          yaxis: { title: 'Price' },
          hovermode: 'x unified'
        };

        Plotly.newPlot('chart', traces, layout);
      },
      error: (err) => {
        console.error('Error fetching chart data:', err);
        this.displayText = 'Failed to load chart data.';
      }
    });
  }
}
