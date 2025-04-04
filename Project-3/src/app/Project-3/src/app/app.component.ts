import { Component } from '@angular/core';
import { ChartDisplayComponent } from './chart-display/chart-display.component';

@Component({
  selector: 'app-root',
  imports: [ChartDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Project-3';
}
