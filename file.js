calculateMA(data, period) {  //period = 5,8 or 13 days
    let ma = [];                       //ma is short for moving average
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ma.push(null); //leaves a gap while waiting to calculate average during set period(5 days,8 days, 13 days)
      } else {
        let window = data.slice(i - period + 1, i + 1);
        let avg = window.reduce((sum, val) => sum + val, 0) / period; //.reduce adds up all the values in window
        ma.push(avg); 
      }
    }
    return ma;
  }
  
  plotChart(pair) {
    fetch(`/data/${pair}`) // uses JS Fetch API to send a get request to Flask 
      .then(response => response.json())
      .then(data => {
        let dates = data.map(d => d.date);
        let prices = data.map(d => d.price);
  
        let ma5 = calculateMA(prices, 5); 
        let ma8 = calculateMA(prices, 8);
        let ma13 = calculateMA(prices, 13);
  
        let traces = [
          {
            x: dates,
            y: prices,
            name: `${pair.toUpperCase()} Price`,
            mode: 'lines+markers',
            line: { color: 'black' }
          },
          {
            x: dates,
            y: ma5,
            name: '5-Day MA',
            mode: 'lines',
            line: { color: 'blue'}
          },
          {
            x: dates,
            y: ma8,
            name: '8-Day MA',
            mode: 'lines',
            line: { color: 'orange'}
          },
          {
            x: dates,
            y: ma13,
            name: '13-Day MA',
            mode: 'lines',
            line: { color: 'red'}
          }
        ];
  
        let layout = {
          title: `${pair.toUpperCase()} with 5-8-13 Moving Averages`,
          xaxis: { title: 'Date' },
          yaxis: { title: 'Price' }
        };
  
        Plotly.newPlot('chart', traces, layout);
      });
  }
  
  // Initial load
  plotChart('eurusd');
  
  // Listen to dropdown changes
  document.getElementById('currencySelect').addEventListener('change', (e) => {
    plotChart(e.target.value);
  });
  