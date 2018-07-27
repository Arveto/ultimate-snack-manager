
let customerId;
var users = [];


$("button.order").on('click', (e)=>{
    //get Id of the user selected
    customerId = getIdFromClassName( e.target );

    $("#commandFor").html(usersList[customerId].name);

    changeView('order');

    socket.emit('ordering', {customerId: customerId, admin: currentUser, leave: false,});
});

socket.on('ordering', (data)=>{
    if (!data.leave){
        $(".order."+data.customerId).removeClass('is-success').addClass('is-warning');
    } else {
        $(".order."+data.customerId).removeClass('is-warning').addClass('is-success');
    }
    $('.amdin-in-charge.'+data.customerId).html('--servi par '+ data.adminName);
});


//AUTOCOMPLETE

$('#userSelectionInput').on('keyup', (e)=>{
    let keycode = e.keyCode || e.which;

    switch (keycode) {
        case 38:  //arrow up
        e.preventDefault();
        break;
        case 40:  //arrow down
        e.preventDefault();
        break;
        case 13:  //enter key
        e.preventDefault();
        break;
        default:
        let input = $('#userSelectionInput').val();

        usersList.forEach((user)=>{
            if (user.name.toLowerCase().search(input.toLowerCase()) < 0){
                $('.user'+user.id).hide();
            } else {
                $('.user'+user.id).show();
            }
        })
    }
});
