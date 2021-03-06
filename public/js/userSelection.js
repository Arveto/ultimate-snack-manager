//User selection in order menu only, see adminUsers.js for users administration

let customerId; //Customer being served


function bindProfOrder(){

    //get Id of the user selected
    customerId = -1;

    $("#commandFor").html('Prof');

    isMember = false;
    isProf = true;

    //Add visual indicator to price for majoration
    $('#total').addClass('isIncreased');


    changeView('order');
    personalOrder = false;

    $(".moldu").hide();    //Works this way ¯\_(ツ)_/¯
    $('h1.title.admin, h2.subtitle.admin').show();    //Works this way ¯\_(ツ)_/¯
}


    //Bind events when content has been added to DOM
function bindUserOrder(){
    $("button.order").on('click', (e)=>{
        e.preventDefault();

        let currentElement = $(e.target);
        let i=0;    //Just a security to avoid infinite loop

        while(currentElement.prop("tagName") != "BUTTON" && i < 10){
            currentElement = currentElement.parent();
            i++;
        }

        //get Id of the user selected
        customerId = getIdFromClassNameUgly( currentElement );

        let customerIndex;
        for(let i=0; i<users.length; i++){
            if(users[i].id == customerId){
                customerIndex = i;
            }
        }

        $("#commandFor").html(users[customerIndex].fiName+' '+users[customerIndex].faName);

        isMember = users[customerIndex].adherent;
        isProf = false;

        //Add visual indicator to price for majoration
        if(!isMember){
            $('#total').addClass('isIncreased');
        } else {
            $('#total').removeClass('isIncreased');
        }

        changeView('order');
        personalOrder = false;


        $(".moldu")/*.css('display', 'flex').css('visibility', 'collapse')*/.hide();    //Works this way ¯\_(ツ)_/¯
        $('h1.title.admin, h2.subtitle.admin')/*.css('visibility', 'collapse')*/.show();    //Works this way ¯\_(ツ)_/¯

    });


    //AUTOCOMPLETE

    //For main research page
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

    //For dashboard research bar
    $("#dashboardUserInput").on('keyup', (e)=>{
        let keycode = e.keyCode || e.which;

        switch (keycode) {
            case 38:  //arrow up
                e.preventDefault();
                break;
            case 40:  //arrow down
                e.preventDefault();
                break;
            case 13:  //enter key
                console.log("Enter =)");
                changeView('userSelection');
                personalOrder = false;
                e.preventDefault();
                break;
            default:
                let input = $('#dashboardUserInput').val();

            users.forEach((user)=>{
                if (user.name.toLowerCase().search(input.toLowerCase()) < 0){
                    $('.user'+user.id).hide();
                } else {
                    $('.user'+user.id).show();
                }
            });
        }

        $('#userSelectionInput').val(input);
    });
}


//FILL HTML

function insertUserOrder(div, user){
    div.append('<article class="media user'+user.id+'">\
        <figure class="media-left">\
            <p class="image is-48x48">\
                <img src="https://api.adorable.io/avatars/100/'+user.faName+user.fiName+'.png">\
            </p>\
        </figure>\
        <div class="media-content">\
            <div class="content">\
                <p>\
                    <strong>'+user.fiName +' '+user.faName +'</strong><small class="'+user.id+' admin-in-charge"></small><br/>\
                    <small>Solde : <a id="orderSold'+user.id+'">'+user.balance +'€</a>\
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
