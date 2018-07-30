
let edition = {};

//Bind event after content has been added to the DOM
function bindUserAdmin(){

    $('#adminUsersInput').on('keyup', (e)=>{
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
            let input = $('#adminUsersInput').val();

            users.forEach((user)=>{
                if (user.name.toLowerCase().search(input.toLowerCase()) < 0){
                    $('.user'+user.id).hide();
                } else {
                    $('.user'+user.id).show();
                }
            })
        }
    });

    $(".adminUserAction").on('click', function(e){
        //get Id of the user selected

        console.log('Triggered edit event');

        let el = e.target.closest(".adminUserAction"); //Do not remove ! It works like that, its 6:36am and i dont wanna think too much
        let userId = getIdFromClassName( el );

        let userIndex;
        for(let i=0; i<users.length; i++){
            if(users[i].id == userId){
                userIndex = i;
            }
        }

        edition = users[userIndex];
        edition.remove = false;

        switch (el.className.match(/action_[^ ]*/g)[0]){
            case 'action_toggleSetAdminUser':
                edition.admin = !(edition.admin);
                sendEdition(edition);
                break;
            case 'action_editUser':
                userAdminPopup(edition);
                break;
            case 'action_removeUser':
                edition.remove = true;
                sendEdition(edition);
                edition = {};
                break;
            default:
                alert("Impossible, une erreur dans mon code ??")
        }

    });

    //Send edition to server
    $('#userAdminApply').on('click', function(e){
        sendEdition(edition);
    });
}


function sendEdition(){
    console.log('Emitting editUser');
    socket.emit('editUser', {'admin': currentUser, 'edition': edition});
    edition = {};
    $('#adminUsers div.blur').removeClass('blur');
    $("#userAdministrationPopup").hide();
}


function userAdminPopup(){
    console.log(edition);
    $('#adminUsers div').addClass('blur');
    $('#userAdministrationPopup').show();

    $('.title.userAdminName').html(edition.name);
    $("#userAdmin_fiName").val(edition.fiName);
    $("#userAdmin_faName").val(edition.faName);
    $("#userAdmin_pseudo").val(edition.pseudo);
    $("#userAdmin_money").val(edition.balance);
    $("#userAdmin_email").val(edition.email);
}
$("#userAdmin_apply").on('click', ()=>{
    edition.fiName = $("#userAdmin_fiName").val();
    edition.faName = $("#userAdmin_faName").val();
    edition.pseudo = $("#pseudo").val();
    edition.balance = $("#userAdmin_money").val();
    edition.email = $("#userAdmin_email").val();

    sendEdition();
})


// INNER SOCKIO EVENTS

socket.on('editUser', ()=>{  // TODO: Finish that shit, its too much for me. 7:43am. Hands up. Goona leave thoses awesome lines. Kiss ya.

    $('#adminUsers div.blur').removeClass('blur');
    $("#userAdministrationPopup").hide();


    if (edition.hasOwnProperty('remove')){
        $('.user'+edition.id).remove();
    } else {
        $('.userAdmin_info'+edition.id + ' strong').html(edition.name);
        $('.userAdmin_info'+edition.id + ' small').html(edition.money);

        if (edition.admin) {
            $('.'+edition.id+'.adminUserAction .isNotCafetier').addClass('confirmedAdmin');
            $('.'+edition.id+'.adminUserAction .isCafetier').addClass('confirmedAdmin');
        } else {
            $('.'+edition.id+'.adminUserAction .isCafetier').removeClass('confirmedAdmin');
            $('.'+edition.id+'.adminUserAction .isNotCafetier').removeClass('confirmedAdmin');
        }
    }

    console.log(edition);
})


//HTML FILLING
function insertUserAdmin(div, user){
    div.append('<article class="media user'+user.id+'">\
    <figure class="media-left">\
        <p class="image is-48x48">\
            <img src="https://bulma.io/images/placeholders/128x128.png">\
        </p>\
    </figure>\
    <div class="media-content columns">\
        <div class="content column">\
            <p class="userAdmin_info'+user.fiName+' '+user.fiName+'">\
                <strong>'+user.fiName+' '+user.faName+'</strong><br/>\
                <small>Solde : <a>'+ user.balance +'€</a></small>\
            </p>\
        </div>\
        <div class="column"></div>\
        <div class="column has-text-centered '+ user.id +' action_toggleSetAdminUser adminUserAction">\
          <p class="heading">\
            Cafetier\
          </p>\
          <p class="subtitle isCafetier" id="isAdmin'+user.id+'">\
            <i class="fa fa-concierge-bell"></i>\
          </p>\
          <p class="subtitle isNotCafetier" id="isNotAdmin'+user.id+'">\
            <i class="fa fa-times"></i>\
          </p>\
        </div>\
        <div class="column has-text-centered '+ user.id +' action_editUser adminUserAction">\
          <p class="heading">\
            Editer\
          </p>\
          <p class="subtitle">\
            <i class="fa fa-user-edit"></i>\
          </p>\
        </div>\
        <div class="column has-text-centered '+ user.id +' action_removeUser adminUserAction">\
          <p class="heading">\
            Supprimer\
          </p>\
          <p class="subtitle">\
            <i class="fa fa-trash"></i>\
          </p>\
        </div>\
    </div>\
    </article>');

    //Display correct elements (admin bell)
    if(!user.admin){
        $('#isAdmin'+user.id).hide();
        $('#isNotAdmin'+user.id).show();
    } else {
        $('#isAdmin'+user.id).addClass('confirmedAdmin');
        $('#isNotAdmin'+user.id).addClass('confirmedAdmin');
    }
}
