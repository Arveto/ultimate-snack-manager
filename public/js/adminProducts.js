
let adminProduct = {};
let addProduct = false;

    //Editing
$(".adminProduct").on('click', function(e) {
    e.stopPropagation();
    addProduct = false;

    //get Id of the product selected
    adminProduct.id = getIdFromClassName(this);

    //First, we look for the product's name and price, from its ID

    for(let i=0; i<products.length; i++){
        if(products[i].id == adminProduct.id){
            adminProduct.name = products[i].name;
            adminProduct.price = products[i].price;
            adminProduct.amount = products[i].stock;
            break;
        }
    }

    $('#adminEditProduct').show();

    $('.adminProductEditInput .productName').html(adminProduct.name);
    $('.adminProductEditInput .productPrice').html(adminProduct.price);
    $('.adminProductEditInput .productAmount').html(adminProduct.amount);
});


    //Amount editing
$('.adminProductEditInput .minus').on('click', ()=>{
    let amount = $('.adminProductEditInput .productAmount').html();
    amount = parseInt(amount);

    if (amount > 0)
        $('.adminProductEditInput .productAmount').html( amount-1 );
});
$('.adminProductEditInput .plus').on('click', ()=>{
    let amount = $('.adminProductEditInput .productAmount').html();
    amount = parseInt(amount);

    $('.adminProductEditInput .productAmount').html( amount+1 );
});


    //Add product
$('#addProduct').on('click', ()=>{
    addProduct = true;

    $('#adminEditProduct').show();

    $('.adminProductEditInput .productName').html("PRODUCT NAME");
    $('.adminProductEditInput .productPrice').html("PRICE");
    $('.adminProductEditInput .productAmount').html("0");
});


    //Cancel/Submit
$('#cancelEdition').on('click', ()=>{
    $('#adminEditProduct').hide();

    adminProduct = {};
    $('.adminProductEditInput .productName').html("--");
    $('.adminProductEditInput .productPrice').html("--");
    $('.adminProductEditInput .productAmount').html("--");
});

$('#submitEdition').on('click', ()=>{
    $('#adminEditProduct').hide();

    let product = {};

    if(addProduct)
        product.name = $('.adminProductEditInput .productName').html().slice(0, -4);    //Fixed BUG: '<br>' added after product name
    else
        product.name = $('.adminProductEditInput .productName').html(); //We don't want to split an existing name

    product.price = $('.adminProductEditInput .productPrice').html();
    product.amount = $('.adminProductEditInput .productAmount').html();

    if (!addProduct){   //It's a product update

        product.id = adminProduct.id;

        socket.emit('adminProduct', {action: 'updateProduct', 'product': product, 'admin': currentUser});

    } else {    //It's a new product
        socket.emit('adminProduct', {action: 'newProduct', 'product': product, 'admin': currentUser});

        //TODO Also update HTML

    }

});
