//User selection in order menu only, see adminUsers.js

let customerId;
var users = [];

    //Bind events when content has been added to DOM
function bindUserOrder(){
    $("button.order").on('click', (e)=>{
        //get Id of the user selected

        customerId = getIdFromClassName( e.target );

        let customerIndex;
        for(let i=0; i<users.length; i++){
            if(users[i].id == customerId){
                customerIndex = i;
            }
        }

        $("#commandFor").html(users[customerIndex].faName);

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

            users.forEach((user)=>{
                if (user.name.toLowerCase().search(input.toLowerCase()) < 0){
                    $('.user'+user.id).hide();
                } else {
                    $('.user'+user.id).show();
                }
            });
        }
    });
}


//FILL HTML

function insertUserOrder(div, user){
    div.append('<article class="media user'+user.id+'">\
        <figure class="media-left">\
            <p class="image is-48x48">\
                <img src="https://bulma.io/images/placeholders/128x128.png">\
            </p>\
        </figure>\
        <div class="media-content">\
            <div class="content">\
                <p>\
                    <strong>'+user.fiName +' '+user.faName +'</strong><small class="'+user.id+' admin-in-charge"></small><br/>\
                    <small>Solde : <a>'+user.balance +'€</a>\
                    </small>\
                </p>\
            </div>\
        </div>\
        <div class="media-right">\
            <button class="button order is-medium is-success '+user.id+'">\
                <span class="icon is-large is-left">\
                    <i class="fa fa-arrow-right"></i>\
                </span>\
            </button>\
        </div>\
    </article>');
}
