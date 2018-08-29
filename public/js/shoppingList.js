
function shoppingListAddProduct(){
    let newProduct = {};
    newProduct.content = $('#shoppingListInput').val();

    socket.emit('shoppingListAddProduct', newProduct);

    $('#shoppingListInput').val('');
}

function shoppingListProductEdit(item){ //Ooooh yeah sooo dirty.
    item.content = $('#shoppingContent'+item.id).text();

    $('#shoppingContent'+item.id).html('<input id="shoppingInput'+item.id+'"></input>');

    $("#shoppingInput"+item.id).val(item.content);

    $("#shoppingInput"+item.id).on('keypress', (e)=>{
        let keycode = e.keyCode || e.which;
        if (keycode == 13) {
            socket.emit('shoppingListProductEdit', {'content': $("#shoppingInput"+item.id).val(), 'id': item.id});
        }
    });
}

function shoppingListCheckProduct(item){
    socket.emit('shoppingListDeleteProduct', (item));
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
    $('#shoppingContent'+item.id).html(item.content);
});

socket.on('shoppingListDeleteProduct', (item)=>{
    $('#shoppingProduct'+item.id).remove();
});

socket.on('shoppingListAddProduct', (item)=>{

    $('#shoppingListContainer').append(`<tr class="has-icons-right" id="shoppingProduct`+item.id+`">\
        <td id="shoppingContent`+item.id+`"> `+item.content+` </td>\
            <td class="icon is-right">\
                <a class= "button is-small is-info" onclick="shoppingListProductEdit( {name:'`+item.content+`', id:`+item.id+`})" href="#">\
                    <i class="fa fa-edit "></i>\
                </a>\
                <a class= "button is-small is-success" onclick="shoppingListCheckProduct( {name:'`+item.content+`', id:`+item.id+`})" href="#">\
                    <i class="fa fa-check "></i>\
                </a>\
        </td>\
        </tr>`).appendTo('#shoppingListProducts');
});
