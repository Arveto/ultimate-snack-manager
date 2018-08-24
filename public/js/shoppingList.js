
function shoppingListAddProduct(){
    let newProduct = {};
    newProduct.content = $('#shoppingListInput').val();

    socket.emit('shoppingListAddProduct', newProduct);

    $('#shoppingListInput').val('');
}

function shoppingListProductEdit(item){ //Ooooh yeah sooo dirty.
    let el = $('.shoppingProduct'+item.id+'_name').addClass('input').attr('contenteditable', true);
    $('.shoppingProduct'+item.id+' .icon.is-right').hide();
    el.on('keypress', (e)=>{
        let keycode = e.keyCode || e.which;
        if (keycode == 13) {
            $('.shoppingProduct'+item.id+' .icon.is-right').show();
            socket.emit('shoppingListProductEdit', {'content': $('.shoppingProduct'+item.id+'_name').html(), 'id': item.id});
        }
    })
}
function shoppingListCheckProduct(item){
    socket.emit('shoppingListDeleteProduct', (item));
    $('#shoppingListContainer').empty();
}




//**************************************************
// UI EVENTS

$('#shoppingListInput').on('keypress', (e)=>{
    let keycode = e.keyCode || e.which;
    if (keycode == 13) {
        shoppingListAddProduct();
    }
});

$('#button_shoppingListAddProduct').on('click', ()=>{ // TODO: Fix that shit : cannot click on the button
    shoppingListAddProduct();
});

//**************************************************
// SOCKET EVENTS

socket.on('shoppingListProductEdit', (item)=>{
    $('.shoppingProduct'+item.id+'_name').removeClass('input').attr('contenteditable', false).html(item.content);
    $('shoppingProduct'+item.id+' .icon.is-right').show();
});

socket.on('shoppingListDeleteProduct', (item)=>{
    console.log("Received instruction to remove "+item.id);
    $('.shoppingProduct'+item.id).remove();
});

socket.on('shoppingListAddProduct', (item)=>{
    $('<tr>').addClass('<tr class="has-icons-right shoppingProduct'+item.id+'">\
    <td class="shoppingProduct'+item.id+'_name"> '+item.content+' </td>\
    <td class="icon is-right">\
    <a class= "button is-small is-info" onclick="shoppingListProductEdit( {name:'+item.name+', id:'+item.id+'})" href="#">\
    <i class="fa fa-edit "></i>\
    </a><a class= "button is-small is-success" onclick="shoppingListCheckProduct( {name:'+item.name+', id:'+item.id+'})" href="#">\
    <i class="fa fa-check "></i>\
    </td>\
    </tr>').appendTo('#shoppingListProducts');
});
