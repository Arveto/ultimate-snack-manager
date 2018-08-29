//used to receive preorders only
var preorders = [];

socket.on('preorder', (command) =>{
    if(currentUser.admin)   //Avoid normal user to receive notifs
        addPreorder(command);
});

socket.on('preorderDone', (customerId)=>{
    $("article.preco"+customerId).remove(); // remove order from the preordersList
    $(".precoBell"+customerId).remove(); //remove the bell in the userSelection
    editSoldHTML(customerId);
})


socket.on("preorderFailure", () => {
    notif("danger", "Erreur: vous avez déjà une précommande en cours!");
});


    //Functions

//Triggered when clicking a preorder (now validates and closes it)
function precoButtonDirtyFuncBecauseDidntFollowedPOOPrecepts(customerId){
    //What the fuck is that function?
    //We're gonna talk about that

    for(let i=0; i<preorders.length; i++){
        if(preorders[i].customerId == customerId){



            //Once preorder is found, reformats its content for the DB
            let orderContent = '';
            let price = 0.00;

            for(let j=0; j<preorders[i].commandList.length; j++){
                for(let k=0; k<preorders[i].commandList[j].amount; k++){

                    orderContent.concat(preorders[i].commandList[j].id.toString());

                    for(let l=0; l<products.length; l++){   //Thats a lot of counters =/
                        if(l == preorders[i].commandList[j].id){
                            price = parseFloat(price + products[l].price.toFixed(2));
                            break;
                        }

                    }
                }
            }


            console.log({customerId: customerId, commandList: orderContent, price: price.toFixed(2)});
            socket.emit("validatePreorder", {customerId: customerId, commandList: orderContent, price: price.toFixed(2)});
            editSoldHTML(customerId, price.toFixed(2));

            notif('success', 'La commande a bien été traitée!');
            $('.media.box.preco'+customerId.toString()).remove();

            //Finally, update client-side sold, and nOrders on dashboard
            let clientIndex;

            for(let i=0; i<users.length; i++){
                if(customerId == users[i].id){
                    clientIndex = i;
                    break;
                }
            }

            users[clientIndex].sold -= price;
            $('#lastOrder').html(users[clientIndex].fiName + ' ' + users[clientIndex].faName);

            let nOrders = parseInt($("#nOrdersSession").html()) + 1;
            $("#nOrdersSession").html(nOrders.toString());

            $('#profit').html(price +'€');
        }
    }
}


//Used when clicking remove button
function removePreorder(customerId){
    $('.media.box.preco'+customerId.toString()).remove();
    notif('info', 'Commande supprimée')

    //Send event to remove DB entry
    socket.emit("removePreorder", {customerId: customerId});
}


    //Used on login, and when receiving a preorder
function addPreorder(command){
    //Reconstitute commandList array (with JSON containing ID  and amount)
    command.commandList = command.commandList.split(',');

    let commandList = [];
    let articleFound;
    for(let i=0; i<command.commandList.length; i++){
        //Check if article is already in commandList
        articleFound = false;

        for(let j=0; j<commandList.length; j++){
            if(command.commandList[i] == commandList[j].id){
                commandList[j].amount++;
                articleFound = true;
                break;
            }
        }

        if(!articleFound)
            commandList.push({id: command.commandList[i], amount: 1});
    }

    //Needed to automatically add preorder content when selected
    command.commandList = commandList;

    //Create display name
    let displayName = command.name.fiName;
    if(command.name.pseudo != ''){
        displayName += ' "'+command.name.pseudo+'" ';
    }
    displayName += command.name.faName;

    //Create date object;
    let date = new Date(Date.parse(command.date))
    let dateString = date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();

    if(dateString == "NaN:NaN:NaN"){
        //Ugly bug fix for live preorders
        date = new Date()
        dateString = date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
    }


    notif('info', '<b>'+ command.name.fiName + ' ' + command.name.faName +'</b> a envoyé une commande !')

    let container = $('<article>').addClass('media box preco'+command.customerId).appendTo('#preorders');
    container.html('\
    <figure class="media-left">\
    <p class="image is-48x48">\
    <img src="https://api.adorable.io/avatars/100/'+command.name.faName+command.name.fiName+'.png">\
    </p>\
    </figure>\
    <div class="media-content">\
    <div class="content">\
    <p>\
    <strong>'+ displayName +'</strong>&nbsp;·&nbsp;<small class="preorder-uptime">à '+dateString+'</small><br/>\
    <ul id="preco'+command.customerId+'">\
    </ul>\
    </p>\
    </div>\
    </div>\
    <div class="media-right">\
    <button class="button is-medium is-failure preco" onclick="removePreorder('+command.customerId+')">\
    <span class="icon is-large is-left">\
    <i class="fa fa-trash-alt "></i>\
    </span>\
    </button>\
    <button class="button is-medium is-success preco" onclick="precoButtonDirtyFuncBecauseDidntFollowedPOOPrecepts('+command.customerId+')"><!--I m sorry for that..-->\
    <span class="icon is-large is-left">\
    <i class="fa fa-arrow-right"></i>\
    </span>\
    </button>\
    </div><br/>');

    //Append command content to HTML, look for names
    for(let i=0; i<commandList.length; i++){
        for(let j=0; j<products.length; j++){
            if(products[j].id == commandList[i].id){
                $('<li>').html(products[j].name + '(x'+commandList[i].amount+')').appendTo('#preco'+command.customerId);
                break;
            }
        }
    }

    preorders.push(command);
}
