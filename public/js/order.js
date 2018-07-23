
let date = new Date;

let commandList = []; //IDs of selected products & amount of it
let totalPrice;


//UI EVENTS
$(".product").on('click', function(e) {

    e.stopPropagation()

    //get Id of the product selected
    let productId = getIdFromClassName(this);

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
                productPrice = products[i].price;
                break;
            }
        }


        $("<article>").addClass('media productContainer' + productId).html('\
        <figure class="media-left">\
        <p class="image is-48x48">\
        <img src="https://bulma.io/images/placeholders/128x128.png">\
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
    if (logged && connected.login && connected.hash){
        $("#submitLogin").addClass('is-loading');

        //Build order array

        orderArray = [];
        for(let i=0; i<commandList.length; i++){
            for(let j=0; j<commandList[0].amount; j++){
                orderArray.push(commandList[i].id);
            }
        }

        if (connected.isAdmin == 1) {
            //prepare the order json
            let order = {};
            order.admin = connected;
            order.clientId = clientId;
            order.commandList = orderArray.toString();
            order.isPreorder = false;
            order.price = totalPrice;

            //send it
            socket.emit('order', order);

        } else {  //It's a preorder
        //prepare the order json
        let order = {};
        order.clientId = connected.id;
        order.commandList = orderArray.toString();
        order.isPreorder = true;
        order.price = totalPrice;


        socket.emit('preorder', order);
    }
}


//Reset vars
commandList = [];
$("#commandList").empty();
updatePrice();
});



//SOCKETIO EVENTS

socket.on('commandRecived', ()=>{
    $("#submitLogin").removeClass('is-loading');
    notif('success', 'La commande #000042 a bien été effectuée');
    leaveOrdering();
})
socket.on('accountSold', (data)=>{
    notif('success', 'Solde de <b>'+usersList[data.clientId].name+'</b> : <b>'+data.money+'</b>');
});



//UTILS
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



function decrementProduct(productId) {

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

            if(commandList[i].amount == 0)
            deleteProduct(productId)

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
    totalPrice = 0;  //TODO: Calcuate from commandList (ez)

    //Cycle order array
    for(let i=0; i<commandList.length; i++){
        //Look for price in corresponding 'products' index
        for(let j=0; j<products.length; j++){
            if(products[j].id == commandList[i].id){
                totalPrice += commandList[i].amount * products[j].price;
            }
        }
    }

    //OLD VERSION: $('#total').html((total.reduce((pv, cv) => pv+cv, 0).toFixed(2)));
    $('#total').html(totalPrice);
}



function leaveOrdering(){
    // if (clientId)
    socket.emit('ordering', {clientId: clientId, admin: connected, leave: true});
    deleteAllProducts();
    changeView("userSelection");
    clientId = null;

    commandList = [];
    $("#commandList").empty();
    updatePrice();
}
