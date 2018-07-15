
let commandList = {}; //IDs of selected products & amount of it
let total = [];

//UI EVENTS
$(".product").on('click', function(e) {
  e.stopPropagation()

  //get Id of the product selected
  let productId = getIdFromClassName(this);

  if (typeof commandList[productId] == 'undefined') {
    commandList[productId] = {
      id: productId,
      amount: 1
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
      <strong id="p' + productId + '">' + productsList[productId].name + '</strong><br/>\
      <small>Prix <a>' + productsList[productId].price + '</a> €</small>\
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

      total.push(1*productsList[productId].price);
      updateTotal();
  } else {
    incrementProduct(productId);
  }

  scrollDown("#commandList");
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
      //prepare command
    let command = {};
    command.admin = connected;
    command.clientId = clientId;
    command.commandList = commandList;
      //send it
    socket.emit('command', command);

    socket.on('commandRecived', ()=>{
      $("#submitLogin").removeClass('is-loading');
      new Notification('success', 'La commande #000042 a bien été effectuée');
      leaveOrdering();
    })
    socket.on('accountSold', (data)=>{
      new Notification('success', 'Solde de <b>'+usersList[data.clientId].name+'</b> : <b>'+data.money+'</b>');
    });
  } else {
    notif('danger', "Vous n'êtes pas connecté !")
  }

  clientId = undefined;
});
  


//UTILS
function incrementProduct(productId) {
  commandList[productId].amount++;
  $("#p" + productId).html(productsList[productId].name + '&nbsp; (&times ' + commandList[productId].amount + ')');
  total.push(1*productsList[productId].price);
  updateTotal();
}

function decrementProduct(productId) {
  commandList[productId].amount--;
  if (commandList[productId].amount > 0) {
    $("#p" + productId).html(productsList[productId].name + '&nbsp; (&times ' + commandList[productId].amount + ')');
    total.push( -1 * productsList[productId].price );
  } else {
    deleteProduct(productId);
  }
  updateTotal();
}


function deleteProduct(productId) {
  $('article.media.productContainer' + productId).remove();
  total.push(-1*productsList[productId].price*commandList[productId].amount);
  updateTotal();

  delete commandList[productId];
}

function deleteAllProducts(){
  commandList = {};
  total = [];
  $("#commandList").empty();
  updateTotal();
}

function updateTotal(){
  $('#total').html((total.reduce((pv, cv) => pv+cv, 0).toFixed(2)));
}

function leaveOrdering(){
  console.log("oiu");
  socket.emit('ordering', {clientId: clientId, admin: connected, leave: true});
  deleteAllProducts();
  changeView("userSelection");
}
