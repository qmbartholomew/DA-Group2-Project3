import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-chart-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-display.component.html',
  styleUrls: ['./chart-display.component.css']
})
export class ChartDisplayComponent {
  constructor() {}

  _selectedPair: string = '';
  displayText: string = 'Please select a currency pair to view the chart.';
  currencyPairs = [
    { name: 'EUR/USD', val: 'EUR' },
    { name: 'USD/JPY', val: 'JPY' },
    { name: 'USD/CAD', val: 'CAD' }
  ];

  get selectedPair(): string {
    return this._selectedPair;
  }

  set selectedPair(value: string) {
    this._selectedPair = value;
    if (value) {
      this.displayText = '';
      this.plotCharts(value);
    } else {
      this.displayText = 'Please select a currency pair to view the chart.';
    }
  }
  
  plotCharts(pair: any) {
    fetch(`http://localhost:5000/${pair}`)
      .then(response => response.json())
      .then(data => {
        let dates = data.map((d: any) => d.Date);
        let prices = data.map((d: any) => d[" Close"]); 
        let profitsData = data.map((d: any) => d.Profit).filter((p: any) => p !== null && p !== undefined);

        const calculateMA = (priceArray: number[], period: number) => {
          return priceArray.map((_, i) => {
            if (i < period - 1) return null;
            const window = priceArray.slice(i - period + 1, i + 1);
            return window.reduce((sum, val) => sum + val, 0) / period;
          });
        };
  
        let ma5 = calculateMA(prices, 5);
        let ma8 = calculateMA(prices, 8);
        let ma13 = calculateMA(prices, 13);

  
        let traces = [
          { x: dates, y: prices, name: `${pair.toUpperCase()} Price`, mode: 'lines+markers', line: { color: 'black' } },
          { x: dates, y: ma5, name: '5-Day MA', mode: 'lines', line: { color: 'blue' } },
          { x: dates, y: ma8, name: '8-Day MA', mode: 'lines', line: { color: 'orange' } },
          { x: dates, y: ma13, name: '13-Day MA', mode: 'lines', line: { color: 'red' } }
        ];
  
        let layout = {
          title: `${pair.toUpperCase()} with 5-8-13 Moving Averages`,
          xaxis: { title: { text: 'Date' } },
          yaxis: { title: { text: 'Price' } },
          hovermode: 'x unified'
        };
  
        Plotly.newPlot('chart', traces as Partial<Plotly.Data>[], layout as Partial<Plotly.Layout>);

        
        let trades = profitsData.filter((p: number) => p !== 0);
        let profitable = trades.filter((p: number) => p > 0);
        let loss = trades.filter((p: number) => p < 0);

        let totalProfit = Number(trades.reduce((sum: number, val: number) => sum + val, 0).toFixed(4));

        Plotly.newPlot('avgProfitLossChart', [{
          x: ['Total Profit/Loss'],
          y: [totalProfit],
          type: 'bar',
          marker: { color: totalProfit >= 0 ? '#6FCF97' : '#EB5757' },
          text: [`${totalProfit}`],
          textposition: 'auto'
        }], {
          title: {
            text: '<b>Final Profit/Loss</b>',
            font: { 
              size: 24,
              family: 'Times' },
            xref: 'paper',
            x: 0.5
          },
          yaxis: { title: { text: this.selectedPair } }
        });

        Plotly.newPlot('winLossChart', [{
          labels: ['Winning Trades', 'Losing Trades'],
          values: [profitable.length, loss.length],
          type: 'pie',
          marker: { colors: ['#6FCF97', '#EB5757'] },
          textinfo: 'percent',
          textposition: 'inside',
          insidetextorientation: 'radial'
        }], {
          title: {
            text: '<b>Win vs. Loss Distribution</b>',
            font: { 
              size: 24,
              family: 'Times' },
            x: 0.35,
            xanchor: 'center'
          },
          height: 400,
          width: 700,
          margin: { t: 60, b: 50, l: 0, r: 150 }
        });
      });
  }
}
