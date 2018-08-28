//Contains functions to create charts and dashbard data

function createAdminGraph(products){
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



function createStandardGraph(graphData, products){
    //Graph data is an array of order content (formatted for the DB)

    let ownProducts = products;   //Will contain infos about the products, including OUR number of orders
    for(let i=0; i<ownProducts.length; i++){
        ownProducts[i].nOrders = 0;
    }

    let currentOrder = [];


    for(let i=0; i<graphData.length; i++){  //Iterating all orders

        currentOrder = graphData[i].content.split(",");


        for(let j=0; j<currentOrder.length; j++){   //Iterating order string

            for(let k=0; k<ownProducts.length; k++){    //Iterating products to find matches
                if(parseInt(currentOrder[j]) == ownProducts[k].id){
                    ownProducts[k].nOrders++;
                    break;
                }
            }

        }

    }

    createAdminGraph(ownProducts);  //We treat this array the same way

    $("#graphTitle").html("Mes articles favoris")
}


function createAdminDashboard(res){
    //Graph
    createAdminGraph(products);  //Found in charts.js

    //Last order
    for(let i=0; i<res.users.length; i++){
        if(res.users[i].id == res.lastCustomer){
            $('#lastOrder').html(res.users[i].fiName + ' ' + res.users[i].faName);
        }
    }

    //Low stock
    let lowerStock;
    let lowerStockIndex;
    for(let i=0; i<products.length; i++){
        if(i == 0){
            lowerStock = products[i].stock;
            lowerStockIndex = i;

        } else {
            if(products[i].stock < lowerStock){
                lowerStock = products[i].stock;
                lowerStockIndex = i;
            }
        }

        if(lowerStock == 0)
            break;
    }

    $("#lowStock").html(products[lowerStockIndex].name+' (x'+lowerStock+')');
}
