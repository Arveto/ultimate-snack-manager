// //Creates a placeholder chart for now
// var ctx = document.getElementById("chart");
//
// var chartData = {
//     type: 'pie',
//     data: {
//         labels: ["Fanta", "Skittles", "Eau", "Ice Tea", "Kinder Bueno", "Cafe"],
//         datasets: [{
//             //label: 'Unités vendues',
//             data: [5, 7, 12, 19, 22, 31],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderColor: [
//                 'rgba(255,99,132,1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {maintainAspectRatio: false}
// };
//
// var chart = new Chart(ctx, chartData);


function createGraph(products){
    //Create a pie chart displaying the 6 most sold items

        //Sort items by nOrders
    //WARNING Array sorted ASC, we'll need to iterate it backwards
    products.sort((a, b) => parseFloat(a.nOrders) - parseFloat(b.nOrders));


        //Creation of data
    var chartData = {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                //label: 'Unités vendues',
                data: [],
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

    //Add products
    let iterationBorn = Math.min(products.length, 6);
    let offset = products.length -1;
    for(let i=0; i<iterationBorn; i++){
        chartData.data.labels.push(products[offset - i].name);
        chartData.data.datasets[0].data.push(products[offset - i].nOrders);
    }

        //Create graph
    var ctx = document.getElementById("chart");
    var chart = new Chart(ctx, chartData);
}
