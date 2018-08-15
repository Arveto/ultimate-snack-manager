function fillEditForm(currentUser){
    $('#editFaName').val(currentUser.faName);
    $('#editFiName').val(currentUser.fiName);
    $('#editPseudo').val(currentUser.pseudo);
    $('#editEmail').val(currentUser.email);
}


function accountEdit(formData) {
    // At this point, all user's data are considered valid

    //We just check if password is edited or not to send hash or empty string
    sendedPassword = "";
    if($('#editPassword1').val() != "")
        sendedPassword = formData.password1;

    socket.emit("editAccount", {
        faName: formData.faName,
        fiName: formData.fiName,
        pseudo: formData.pseudo,
        email: formData.email,
        password: sendedPassword,
        id: currentUser.id
    });

}

socket.on('editSuccess', (res)=>{
    //First we'll send a login event with our newly created values
    notif('success', "Votre compte a bien été édité!");

    $('#editPassword1').val("");
    $('#editPassword2').val("");
});

socket.on('editFailure', (res)=>{
    notif('danger', "Addresse email déjà utilisée")
});


function hash(string){
    let shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.update(string);
    return shaObj.getHash('HEX');
}


//Event on Validation button
$('#submitEdit').on('click', (e) => {


    let emailInput = $('#emailEdit');
    let passwordValidation = $('#password2');

    // Remove previous error messages
    emailInput.removeClass('is-danger');
    $('#emailError').remove();

    passwordValidation.removeClass('is-danger');
    $('#passwordError').remove();

    //Gather form data
    var formData = {
        'faName': $('#editFaName').val(),
        'fiName': $('#editFiName').val(),
        'pseudo': $('#editPseudo').val(),
        'email': $('#editEmail').val(),
        'password1': $('#editPassword1').val(),
        'password2': $('#editPassword2').val()
    };

    //Check that values are not blank
    var notEmpty = true;
    for(key in formData){
        if(formData[key] == '' && key != 'pseudo' && key != 'password1' && key != 'password2' )  //Pseudo is optionnal, and password too on edit
            notEmpty = false;
    }


    //Encrypt passwords
    formData.password1 = hash(formData.password1);
    formData.password2 = hash(formData.password2);


    //To test validity of email
    var emailRegex =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    //Send request or returns errors to client
    if(notEmpty && emailRegex.test(formData.email) && formData.password1 == formData.password2){
        console.log("Ok, sending event");
        accountEdit(formData);
    }

    if(!emailRegex.test(formData.email))
        notif('danger', 'Email au mauvais format');

    if(formData.password1 != formData.password2)
        notif('danger', 'Mots de passes non identiques');


    //BUG Classes additions not working too lazy to fix, sends notfis for now
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
