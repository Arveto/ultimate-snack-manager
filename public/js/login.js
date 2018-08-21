let connectionData = {
    login: undefined,
    hash: undefined,
}

let currentUser = {
    //Will contain data bout the connected user
};

/*
*   ENCRYPTION WITH https://github.com/Caligatio/jsSHA
*/

//Sends login event to server
function login(email, password) {
    $("#loginNav").addClass('is-loading');
    let shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.update(password);
    connectionData.login = email;
    connectionData.hash = shaObj.getHash("HEX");

    socket.emit("login", {
        email: email,
        password: connectionData.hash
    });
}

socket.on('login', (res) => {
    if (res.ok) {

        notif('success', "Connecté en tant que <b>" + res.userData.fiName + ' ' + res.userData.faName + "</b>");
        currentUser = res.userData;

        products = res.itemsList;

        //Add own sold to HTML
        $("#ownSold").html('Mon solde: '+res.userData.balance.toFixed(2).toString() + '€');

        if (res.isAdmin || res.isSuperAdmin){
            currentUser.admin = true;

                //Add current preoders
            for(let i=0; i<res.preorders.length; i++){
                addPreorder(res.preorders[i]);
            }

            notif('success', 'You are <b>ADMIN</b>')
            $(".admin").css('display', 'flex').css('visibility', 'visible');
            $('.moldu').hide().css('visibility', 'collapse');

            //Add users to HTML
            let usersOrderDiv = $('#userSelectionOrder');
            let usersAdminDiv = $('#userSelectionEdit');   //Wtf...
            // window.users = res.users
            // users.forEach
            res.users.forEach( user =>{
                insertUserOrder(usersOrderDiv, user);
                insertUserAdmin(usersAdminDiv, user);

                bindUserOrder();
                bindUserAdmin();
            });

                //Create dashboard data
            createAdminDashboard(res);

            $("#preordersContainer").show();

            users = res.users;
            users.forEach((user)=>{
              user.name = user.fiName + ' ' + ' "' + user.pseudo + '" '+ user.faName;
            })


        } else {
            //Casual user
            createStandardGraph(res.graphData, products);
            currentUser.admin = false;
            $("#productsNav").hide;

            //Add sold tile
            $("#main-graph").after('<div class ="tile is-parent is-vertical">\
                <div class="tile is-child is-8 is-vertical box">\
                    <p class="tile-title" size="1">\
                        Mon solde\
                    </p>\
                    <p class="subtitle">\
                        42.42€\
                    </p>\
                </div>\
            </div>');
        }

        //Hide administration elements to not superadmin users
        if(!res.isSuperAdmin){
            $('#toAdminUsers').hide();
            $('#productsNav').hide();
        }

        logged = true;


        changeView('dashboard');
        if(currentUser.admin)
            $('#preordersContainer').show();


        $('.login').val('');
        $("#loginNav").html('Connecté: <b> &nbsp; ' + currentUser.fiName + ' ' + currentUser.faName + '</b>');
        $('#loginPopup').hide();
    } else {
        notif('danger', 'Wrong credentials');
    }
    $('#loginNav').removeClass('is-loading');
    $('.password').val('');


});


/*
*  UI EVENTS
*/
//Main login
$('#submitLogin').on('click', (e) => {

    let email = $('#loginAdmin').val();
    let password = $('#password').val();


    login(email, password);
});

$('#submitLoginPopup').on('click', (e) => {

    let email = $('#emailPopup').val();
    let password = $('#passwordPopup').val();


    login(email, password);
});


$('.password').on('keypress', (e) => {
  let keycode = e.keyCode || e.which;
    if (keycode == 13) {

        $("#loginNav").addClass('is-loading');

        let username = $((currentView == 'login') ? '#loginAdmin' : '#loginPopup').val();
        let clear = $((currentView == 'login') ? '#password' : '#passwordPopup').val();

        login(username, clear);
    }
});

$("#emailPopup").on('keypress', (e)=>{
    let keycode = e.keyCode || e.which
    if (keycode == 9){
        e.preventDefault();
        // e.stopPropagation();
        $("#loginNav").trigger('click')
        $("#passwordPopup").focus();
    }
})

//Account creation
$('#toSignUp').on('click', (e) => {
    changeView('signup');
});
