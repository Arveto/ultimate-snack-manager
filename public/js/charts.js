    //Creates a placeholder chart for now
var ctx = document.getElementById("chart");

var chartData = {
    type: 'pie',
    data: {
        labels: ["Fanta", "Skittles", "Eau", "Ice Tea", "Kinder Bueno", "Cafe"],
        datasets: [{
            //label: 'Unités vendues',
            data: [5, 7, 12, 19, 22, 31],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {maintainAspectRatio: false}
};

var chart = new Chart(ctx, chartData);
