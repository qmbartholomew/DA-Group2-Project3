// Load CSV file
// d3.csv("Foreign_Currency").then(function(data) {
//     console.log(data); // Check the loaded data in the console
  
    // // Example: Log each row
    // data.forEach(row => {
    //   console.log(row);
    // });
//   });

//load sqlite file
// Load JSON data into D3
d3.json("data.json").then(function(data) {
    console.log(data); // View the data in the console

    // // Example: Append data to an HTML table
    // d3.select("#data-table tbody") // Assuming an existing <table>
    //   .selectAll("tr")
    //   .data(data)
    //   .enter()
    //   .append("tr")
    //   .html(d => `<td>${d.column1}</td><td>${d.column2}</td>`); // Adjust based on your columns
});