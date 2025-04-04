import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-display.component.html',
  styleUrls: ['./chart-display.component.css']
})
export class ChartDisplayComponent {
  _selectedPair: string = '';
  displayText: string = 'Please select a currency pair to view the chart.';
  currencyPairs: string[] = ['EUR/USD', 'JPY/USD', 'CAD/USD'];

  get selectedPair(): string {
    return this._selectedPair;
  }

  set selectedPair(value: string) {
    this._selectedPair = value;
    this.displayText = value
      ? `Chart for ${value} will be displayed here.`
      : 'Please select a currency pair to view the chart.';
  }
}
