function signup(formData) {
    // At this point, all user's data are considered valid
    $("#loginNav").addClass('is-loading');

    socket.emit("signup", {
        faName: formData.faName,
        fiName: formData.fiName,
        pseudo: formData.pseudo,
        email: formData.email,
        password: formData.password1,
    });
}

socket.on('signupSuccess', (res)=>{
    notif('success', "Connecté en tant que <b>"+currentUser.login+"</b>")
    logged = true;
    changeView('dashboard');
    $('.username').val('');
    $("#loginNav").removeClass('is-loading').html('Connecté: <b> &nbsp; '+currentUser.login+'</b>');
    $('#loginPopup').hide();

    //Empty password fields (4 security, yaknow?)
    $('#password1').val('');
    $('#password2').val('');
});

socket.on('signupFailure', (res)=>{
    notif('danger', "Addresse déjà utilisée")
    $("#loginNav").removeClass('is-loading').html('Login');
    $('#loginPopup').hide();
});


function hash(string){
    let shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.update(string);
    return shaObj.getHash('HEX');
}


//Event on Validation button
$('#submitSignup').on('click', (e) => {
    let emailInput = $('#emailSignup');
    let passwordValidation = $('#password2');

    // Remove previous error messages
    emailInput.removeClass('is-danger');
    $('#emailError').remove();

    passwordValidation.removeClass('is-danger');
    $('#passwordError').remove();

    //Gather form data
    var formData = {
        'faName': $('#faName').val(),
        'fiName': $('#fiName').val(),
        'pseudo': $('#pseudo').val(),
        'email': $('#emailSignup').val(),
        'password1': $('#password1').val(),
        'password2': $('#password2').val()
    };

    //Check that values are not blank
    var notEmpty = true;
    for(key in formData){
        if(formData[key] == '' && key != 'pseudo')  //Pseudo is optionnal
        notEmpty = false;
    }

    //Encrypt passwords
    formData.password1 = hash(formData.password1);
    formData.password2 = hash(formData.password2);

    //To test validity of email
    var emailRegex =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    //Send request or returns errors to client
    if(notEmpty && emailRegex.test(formData.email) && formData.password1 == formData.password2)
    signup(formData)


    if(!emailRegex.test(formData.email)){
        //Send email error to client
        emailInput.addClass('is-danger');
        emailInput.after('<p class="help is-danger" id="emailError">Addresse invalide ;(</p>');
    }


    if(formData.password1 != formData.password2){
        //Send password error to client
        passwordValidation.addClass('is-danger');
        passwordValidation.after('<p class="help is-danger" id="passwordError">Mots de passe non identiques ;(</p>');
    }

});
