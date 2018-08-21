
function addProductShoppingList(){
    let newProduct = {};
    newProduct.name = $('#shoppingListInput').val();

    socket.emit('addProductShoppingList', newProduct);

    $('#shoppingListInput').val('');
}

function shoppingListProductEdit(product){ //Ooooh yeah sooo dirty.
    let el = $('.shoppingProduct'+product.id+'_name').addClass('input').attr('contenteditable', true);
    $('shoppingProduct'+product.id+' .icon.is-right').hide();
    el.on('keypress', (e)=>{
        let keycode = e.keyCode || e.which;
        if (keycode == 13) {
            socket.emit('ShoppingListProductEdit', {'name': $('.shoppingProduct'+product.id+'_name').html(), 'id': product.id});
        }
    })
}
function shoppingListCheckProduct(product){
    socket.emit('ShoppingListCheckProduct', (product));
}




//**************************************************
// UI EVENTS

$('#shoppingListInput').on('keypress', (e)=>{
    let keycode = e.keyCode || e.which;
    if (keycode == 13) {
        addProductShoppingList();
    }
});

$('#button_addProductShoppingList').on('click', ()=>{ // TODO: Fix that shit : cannot click on the button
    addProductShoppingList();
});

//**************************************************
// SOCKET EVENTS

socket.on('shoppingListEdition', (product)=>{
    $('.shoppingProduct'+product.id+'_name').removeClass('input').attr('contenteditable', false).html(product.name);
    $('shoppingProduct'+product.id+' .icon.is-right').show();
})
socket.on('shoppingListDeleteProduct', (product)=>{
  console.log('remove : '+ product.name);
    $('.shoppingProduct'+product.id).remove();
})
socket.on('shoppingListAddProduct', (product)=>{
    $('<tr>').addClass('has-icons-right shoppingProduct'+product.id).html('<td class="shoppingProduct'+product.id+'_name"> '+product.name+' </td>\
    <td class="icon is-right">\
    <a class= "button is-small is-info" onclick="shoppingListProductEdit( {name:\''+product.name+'\', id: '+product.id+'})" href="#">\
    <i class="fa fa-edit "></i>\
    </a><a class= "button is-small is-success" onclick="shoppingListCheckProduct( {name:\''+product.name+'\', id: '+product.id+'})" href="#">\
    <i class="fa fa-check "></i>\
    </td>').appendTo('#shoppingListProducts');
})
