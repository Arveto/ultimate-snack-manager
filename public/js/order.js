
let commandList = []; //IDs of selected products & amount of it
let totalPrice;
let isProf = false;
let isMember = false;


//UI EVENTS
$(".product").on('click', function(e){

    e.stopPropagation()

    //get Id of the product selected
    let productId = getIdFromClassName(this);

    appendProduct(productId);
});



$("div.product").on('contextmenu', function(e) {
    e.stopPropagation();
    e.preventDefault();
    let productId = getIdFromClassName(this);

    if (commandList.hasOwnProperty(productId) > -1)
    decrementProduct(productId);
})



$('#deleteAllProducts').on('click', ()=>{
    deleteAllProducts();
})



$('#submitCommand').on('click', ()=>{

    if (logged){
        $("#submitLogin").addClass('is-loading');

        //Build order array

        orderArray = [];
        for(let i=0; i<commandList.length; i++){
            for(let j=0; j<commandList[0].amount; j++){
                orderArray.push(commandList[i].id);
            }
        }

        if (!personalOrder && !isProf) { //Standard order

            //prepare the order json
            let order = {};
            order.admin = currentUser;
            order.customerId = customerId;
            order.commandList = orderArray;
            order.price = totalPrice.toFixed(2);

            //Update the dashboard HTML
            let nOrders = parseInt($("#nOrdersSession").html()) + 1;
            $("#nOrdersSession").html(nOrders.toString());

            let profit = parseInt($("#profit").html()) + totalPrice.toFixed(2);
            $("#profit").html(profit.toString() + ' €');

            for(let i=0; i<users.length; i++){
                if(users[i].id == customerId){
                    $("#lastOrder").html(users[i].fiName+" "+users[i].faName);
                }
            }

            //send it
            socket.emit('order', order);
            editSoldHTML(order.customerId, order.price);


        } else if(!isProf) {  //It's a preorder

            //prepare the order json
            let order = {
                customerId : currentUser.id,
                commandList : orderArray.toString(),
                price : totalPrice.toFixed(2)
            };

            socket.emit('preorder', order);

        } else {    //It's a prof order

        //prepare the order json
        let order = {
            admin : currentUser,
            commandList : orderArray.toString(),
            price : totalPrice.toFixed(2)
        };

        socket.emit('profOrder', order);
        }
    }

    //Reset vars
    commandList = [];
    $("#commandList").empty();
    updatePrice();
});



//SOCKETIO EVENTS

socket.on('commandReceived', ()=>{
    $("#submitLogin").removeClass('is-loading');
    notif('success', 'La commande a bien été effectuée');

    leaveOrdering();
})


//UTILS

function appendProduct(productId){
    //First, check if product is already in list
    let itemFound = false;

    for(let i=0; i<commandList.length; i++){
        if(commandList[i].id == productId){
            //If the product is already in list
            itemFound = true;
            incrementProduct(productId);
        }
    }

    if(!itemFound){
        //Append to list
        commandList.push({
            id: productId,
            amount: 1
        });


        //Append to HTML
        //First, we look for the product's name and price, from its ID

        let productName = '';
        let productPrice = 0;
        for(let i=0; i<products.length; i++){
            if(products[i].id == productId){
                productName = products[i].name;
                productPrice = products[i].price.toFixed(2);
                break;
            }
        }


        $("<article>").addClass('media productContainer' + productId).html('\
        <figure class="media-left">\
        <p class="image is-48x48">\
        <img src="img/logo.jpg">\
        </p>\
        </figure>\
        <div class="media-content">\
        <div class="content">\
        <p>\
        <strong id="p' + productId + '">' + productName+ ' (x1)'+'</strong><br/>\
        <small>Prix <a>' + productPrice + '</a> €</small>\
        </p>\
        </div>\
        </div>\
        <div class="media-right order-small-modifiers">\
        <button onclick="deleteProduct('+productId+')" class="delete is-bigger"></button>\
        <div onclick="incrementProduct('+productId+')" class="incProd is-big">\
        <i class="fa fa-plus-circle" ></i>\
        </div>\
        <div onclick="decrementProduct('+productId+')" class="decProd is-small">\
        <i class="fa fa-minus-circle"></i>\
        </div>\      </div>\
        ').appendTo('#commandList');


        updatePrice();

        scrollDown("#commandList");

    }
}



function incrementProduct(productId) {

    productIndex = -1;
    for(let i=0; i<products.length; i++){
        if(products[i].id == productId){
            productIndex = i;
            break;
        }
    }

    //Update list
    commandIndex = -1
    for(let i=0; i<commandList.length; i++){
        if(productId == commandList[i].id){
            commandList[i].amount++;
            commandIndex = i;
            break;
        }
    }

    //Update HTML
    $("#p" + productId).html(products[productIndex].name + '&nbsp; (&times ' + commandList[commandIndex].amount + ')');

    updatePrice();
}



function decrementProduct(productId){

    productIndex = -1;
    for(let i=0; i<products.length; i++){
        if(products[i].id == productId){
            productIndex = i;
            break;
        }
    }

    //Update list
    commandIndex = -1
    for(let i=0; i<commandList.length; i++){
        if(productId == commandList[i].id){
            commandList[i].amount--;

            if(commandList[i].amount == 0){
                deleteProduct(productId);
            }


            commandIndex = i;
            break;
        }
    }

    //Update HTML
    if(commandList.length > 0){
        if(commandList[commandIndex].amount > 0)
        $("#p" + productId).html(products[productIndex].name + '&nbsp; (&times ' + commandList[commandIndex].amount + ')');
    }


    updatePrice();
}



function deleteProduct(productId) {
    //Update HTML
    $('article.media.productContainer' + productId).remove();

    //Update list
    for(let i=0; i<commandList.length; i++){
        if(commandList[i].id == productId){
            commandList.splice(i, 1);
            break;
        }
    }

    updatePrice();
}



function deleteAllProducts(){
    //Update list
    commandList = [];
    $("#commandList").empty();


    updatePrice();
}



function updatePrice(){
    totalPrice = 0;

    //Cycle order array
    for(let i=0; i<commandList.length; i++){
        //Look for price in corresponding 'products' index
        for(let j=0; j<products.length; j++){
            if(products[j].id == commandList[i].id){
                totalPrice += commandList[i].amount * products[j].price.toFixed(2);

                if(!isMember)
                    totalPrice += commandList[i].amount * 0.10.toFixed(2);

            }
        }
    }

    $('#total').html(totalPrice.toFixed(2) + ' €');

}



function leaveOrdering(){
    deleteAllProducts();
    changeView("userSelection");
    customerId = null;

    commandList = [];
    $("#commandList").empty();
    updatePrice();
}
