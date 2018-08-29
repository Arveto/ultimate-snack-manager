
let edition = {};   //Acts as a buffer to store data of a user being modified
let editedUser; //Id of an edited user

//Bind event after content has been added to the DOM
function bindUserAdmin(){

    $(".adminUserAction").unbind().click(function(e){
        e.stopPropagation();

        if(currentUser.superadmin){
            //get Id of the user selected
            let el = e.target.closest(".adminUserAction"); //It works like that. its 6:36am and i dont wanna search why the fuck it works
            let userId = getIdFromClassName( el );



            let userIndex;
            for(let i=0; i<users.length; i++){
                if(users[i].id == userId){
                    userIndex = i;
                }
            }

            edition = users[userIndex];

            switch (el.className.match(/action_[^ ]*/g)[0]){
                case 'action_toggleSetAdminUser':
                    edition.admin = !(edition.admin);
                    sendEdition(edition);
                    break;
                case 'action_toggleSetMemberUser':
                    edition.adherent = !(edition.adherent);
                    sendEdition(edition);
                    break;
                case 'action_editUser':
                    editedUser = edition.id;
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
        }

    });

}


function sendEdition(edition){
    socket.emit('editUser', {'admin': currentUser, 'edition': edition});
    $('#adminUsers div.blur').removeClass('blur');
    $("#userAdministrationPopup").hide();
}


function userAdminPopup(){
    $('#adminUsers div').addClass('blur');
    $('#userAdministrationPopup').show();

    $('#userAdmin_avatar').attr('src', 'https://api.adorable.io/avatars/100/'+edition.faName+edition.fiName+'.png')
    $('.title.userAdminName').html(edition.name);
    $("#userAdmin_fiName").val(edition.fiName);
    $("#userAdmin_faName").val(edition.faName);
    $("#userAdmin_pseudo").val(edition.pseudo);
    $("#userAdmin_money").val(edition.balance);
    $("#userAdmin_email").val(edition.email);
}

$("#userAdmin_apply").on('click', ()=>{
    //Look for user's data
    for(let i=0; i<users.length; i++){
        if(users[i].id = editedUser){
            edition = users[i];
            break;
        }
    }

    edition.fiName = $("#userAdmin_fiName").val();
    edition.faName = $("#userAdmin_faName").val();
    edition.pseudo = $("#userAdmin_pseudo").val();
    edition.balance = $("#userAdmin_money").val();
    edition.email = $("#userAdmin_email").val();

    sendEdition(edition);
})

function editUsersSolde(id) {
  let userId = id

  let userIndex;
  for(let i=0; i<users.length; i++){
      if(users[i].id == userId){
          userIndex = i;
      }
  }

  edition = users[userIndex];

  $('.user'+id+'_solde').addClass('box').attr('contenteditable', true);
  $('.user'+id+'_solde').on('keypress', (e) => {
    let keycode = e.keyCode || e.which;
    if (keycode == 13) {
        edition.balance = $('.user'+id+'_solde').html()
        sendEdition(edition);
        $('.user'+id+'_solde').removeClass('box').attr('contenteditable', false);
        $('.user'+id+'_solde').off('keypress');
    }
  })
}


// INNER SOCKIO EVENTS

socket.on('editUser', (edition)=>{
    //Get edited user's index in our array
    let userIndex;
    for(let i=0; i<users.length; i++){
        if(users[i].id == edition.id){
            userIndex = i;
            break;
        }
    }


    //Removal
  if (edition.hasOwnProperty('remove')){
        //TODO Check that removal is properly done
        $('#user'+edition.id).remove();
        users.splice(userIndex, 1);

    //Edition
  } else {
    console.log(edition);
      users[userIndex] = edition;

      $('.userAdmin_info'+edition.id + ' strong').html(edition.name);
      $('.user'+edition.id+'_solde').html(edition.balance);

      if (edition.admin) {
          $('.'+edition.id+'.adminUserAction .isNotCafetier').addClass('confirmedAdmin').hide();
          $('.'+edition.id+'.adminUserAction .isCafetier').addClass('confirmedAdmin').show();
      } else {
          $('.'+edition.id+'.adminUserAction .isCafetier').removeClass('confirmedAdmin').hide();
          $('.'+edition.id+'.adminUserAction .isNotCafetier').removeClass('confirmedAdmin').show();
      }

      if (edition.adherent) {
          $('.'+edition.id+'.adminUserAction .isNotMember').addClass('confirmedAdmin').hide();
          $('.'+edition.id+'.adminUserAction .isMember').addClass('confirmedAdmin').show();
      } else {
          $('.'+edition.id+'.adminUserAction .isMember').removeClass('confirmedAdmin').hide();
          $('.'+edition.id+'.adminUserAction .isNotMember').removeClass('confirmedAdmin').show();
      }
  }

});


//HTML FILLING
function insertUserAdmin(div, user){

    div.append('<article class="media adminUser'+user.id+'">\
    <figure class="media-left">\
        <p class="image is-48x48">\
            <img src="https://api.adorable.io/avatars/100/'+user.faName+user.fiName+'.png">\
        </p>\
    </figure>\
    <div class="media-content columns">\
        <div class="content column">\
            <p class="userAdmin_info'+user.fiName+' '+user.fiName+'">\
                <strong>'+user.fiName+' '+user.faName+'</strong><br/>\
                <small>Solde : <a class="user'+user.id+'_solde" onclick="editUsersSolde('+user.id+')" id="adminSold'+user.id+'">'+ user.balance +'</a>€</small>\
            </p>\
        </div>\
        <div class="column has-text-centered '+ user.id +' action_toggleSetMemberUser adminUserAction">\
          <p class="heading">\
            Adhérent\
          </p>\
          <p class="subtitle isMember" id="isMember'+user.id+'">\
            <i class="fa fa-check"></i>\
          </p>\
          <p class="subtitle isNotMember" id="isNotMember'+user.id+'">\
            <i class="fa fa-times"></i>\
          </p>\
        </div>\
        <div class="column has-text-centered '+ user.id +' action_toggleSetAdminUser adminUserAction">\
          <p class="heading">\
            Cafetier\
          </p>\
          <p class="subtitle isCafetier" id="isAdmin'+user.id+'">\
            <i class="fa fa-coffee"></i>\
          </p>\
          <p class="subtitle isNotCafetier" id="isNotAdmin'+user.id+'">\
            <i class="fa fa-times"></i>\
          </p>\
        </div>\
        <div class="column has-text-centered superadmin '+ user.id +' action_editUser adminUserAction">\
          <p class="heading">\
            Editer\
          </p>\
          <p class="subtitle">\
            <i class="fa fa-user-edit"></i>\
          </p>\
        </div>\
        <div class="column has-text-centered superadmin '+ user.id +' action_removeUser adminUserAction">\
          <p class="heading">\
            Supprimer\
          </p>\
          <p class="subtitle">\
            <i class="fa fa-trash"></i>\
          </p>\
        </div>\
    </div>\
    </article>');

    //Display correct elements (admin bell, member check)
    if(!user.admin){
        $('#isAdmin'+user.id).hide();
        $('#isNotAdmin'+user.id).show();

    } else {
        $('#isAdmin'+user.id).addClass('confirmedAdmin');
        $('#isNotAdmin'+user.id).addClass('confirmedAdmin');
    }

    if(user.adherent == 0){
        $('#isMember'+user.id).hide();
        $('#isNotMember'+user.id).show();
    } else {
        $('#isMember'+user.id).addClass('confirmedAdmin');
        $('#isNotMember'+user.id).hide().addClass('confirmedAdmin');
    }
}


//*** Research ***
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
                $('.adminUser'+user.id).hide();
            } else {
                $('.adminUser'+user.id).show();
            }
        });
    }
});
