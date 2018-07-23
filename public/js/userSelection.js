
let clientId;

$("button.order").on('click', (e)=>{
    //get Id of the user selected
    clientId = getIdFromClassName( e.target );

    $("#commandFor").html(usersList[clientId].name);

    changeView('order');

    socket.emit('ordering', {clientId: clientId, admin: connected, leave: false});
});

socket.on('ordering', (data)=>{
    if (!data.leave){
        $(".order."+data.clientId).removeClass('is-success').addClass('is-warning');
    } else {
        $(".order."+data.clientId).removeClass('is-warning').addClass('is-success');
    }
    $('.amdin-in-charge.'+data.clientId).html('--servi par '+ data.adminName);
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
