
let adminProduct = {};  //Acts as a buffer to store data of a product being modified
let addProduct = false; //Tells us if we are adding or modifying a product

    //Editing
$(".adminProduct").on('click', function(e) {
    e.stopPropagation();
    addProduct = false;

    //get Id of the product selected
    //This line gets the value of I in "adminProductI"
    adminProduct.id = getIdFromClassName(this);

    //First, we look for the product's name and price, from its ID

    for(let i=0; i<products.length; i++){
        if(products[i].id == adminProduct.id){
            adminProduct.name = products[i].name;
            adminProduct.price = products[i].price;
            adminProduct.stock = products[i].stock;
            adminProduct.onSale = products[i].onSale;
            break;
        }
    }

    $('#isOnSale').prop("checked", adminProduct.onSale);

    $('#adminEditProduct').show();

    $('.adminProductEditInput .productName').html(adminProduct.name);
    $('.adminProductEditInput .productPrice').html(adminProduct.price);
    $('.adminProductEditInput .productAmount').html(adminProduct.stock);
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


//PRODUCTS SALE, DELETION

$('#isOnSale').on('click',() =>{
    socket.emit("editOnSale", {id: adminProduct.id});
});

$('#removeProduct').on('click',() =>{
    socket.emit("deleteProduct", {id: adminProduct.id});
});


socket.on('productValidation', function(){
    notif('success', 'Changement effectué! Rafraichissez la page pour la mettre à jour.')
});
