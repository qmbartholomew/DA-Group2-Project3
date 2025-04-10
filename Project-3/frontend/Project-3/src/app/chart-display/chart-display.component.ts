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
        
        // let avg = (arr: any[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        // let avgProfit = avg(profitable).toFixed(4);
        // let avgLoss = avg(loss).toFixed(4);

        let totalProfit = Number(trades.reduce((sum: number, val: number) => sum + val, 0).toFixed(4))
        // will have to correct the currency with respect to the country(?)
  
        // Plotly.newPlot('avgProfitLossChart', [{
        //   x: ['Average Profit', 'Average Loss'],
        //   y: [avgProfit, avgLoss],
        //   type: 'bar',
        //   marker: { color: ['#6FCF97', '#EB5757'] }
        // }], {
        //   title: 'Average Profit vs. Average Loss per Trade',
        //   xaxis: { title: { text: 'Trade Type' } },             // optional but clear
        //   yaxis: { title: { text: 'Profit/Loss ($)' } }
        // });

        // Plotly.newPlot('avgProfitLossChart', [{
        //   x: ['Total Profit/Loss'],
        //   y: [(totalProfit)],
        //   type: 'bar',
        //   marker: { color: totalProfit >= 0 ? '#6FCF97' : '#EB5757' }, 
        //   text: [`${totalProfit}`],
        //   textposition: 'auto'
        // }], {
        //   title: 'Final Profit/Loss',
        //   // xaxis: { title: { text: 'Trade Summary' } },
        //   yaxis: { title: { text: 'Currency' }}
        // });

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
          yaxis: { title: { text: 'Currency' } }
        });
  
        // Plotly.newPlot('winLossChart', [{
        //   labels: ['Winning Trades', 'Losing Trades'],
        //   values: [profitable.length, loss.length],
        //   type: 'pie',
        //   marker: { colors: ['#6FCF97', '#EB5757'] },
        //   textinfo: 'percent',
        //   textposition: 'inside',
        //   insidetextorientation: 'radial'
        // }], {
        //   title: 'Win vs. Loss Distribution',
        //   height: 400,
        //   width: 400,
        //   margin: { t: 50, b: 50, l: 50, r: 50 }
        // });
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
            x: 0.35,               // centers the title
            xanchor: 'center'
          },
          height: 400,
          width: 700,
          margin: { t: 60, b: 50, l: 0, r: 150 } // top margin gives room for the title
        });
      });
  }
}
