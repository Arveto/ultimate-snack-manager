
function addProductShoppingList(){
  let newProduct = {};
  newProduct.name = $('#shoppingListInput').val();

  socket.emit('addProductShoppingList', newProduct);

  $('#shoppingListInput').val('');
}

function shoppingListProductEdit(product){ //Ooooh yeah sooo dirty.
  socket.emit('ShoppingListProductEdit', (product));
}
function shoppingListCheckProduct(product){
  socket.emit('ShoppingListCheckProduct', (product));
}
function shoppingListDeleteProduct(product){
  socket.emit('ShoppingListDeleteProduct', (product));
}



//**************************************************
  // EVENTS

$('#shoppingListInput').on('keypress', (e)=>{
  let keycode = e.keyCode || e.which;
  if (keycode == 13) {
    addProductShoppingList();
  }
});

$('#button_addProductShoppingList').on('click', ()=>{ // TODO: Fix that shit
  console.log('oui');
  addProductShoppingList();
});
