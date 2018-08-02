//used to receive preorders only


socket.on('preorder', (command) =>{
    addPreorder(command);
});

socket.on('preorderDone', (customerId)=>{
    $("article.preco"+customerId).remove(); // remove order from the preordersList
    $(".precoBell"+customerId).remove(); //remove the bell in the userSelection
})



//Functions

function precoButtonDirtyFuncBecauseDidntFollowedPOOPrecepts(customerId){
    //What the fuck is that function?
    //We're gonna talk about that
    $('button.order.'+customerId).trigger('click');
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

    //Create display name
    let displayName = command.name.fiName;
    if(command.name.pseudo != ''){
        displayName += ' "'+command.name.pseudo+'" ';
    }
    displayName += command.name.faName;

    //Create date object;
    let date = new Date(Date.parse(command.date))

    let dateString = date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();



    notif('info', '<b>'+ command.name.fiName + ' ' + command.name.faName +'</b> a envoyé une commande !')

    let container = $('<article>').addClass('media box preco'+command.customerId).appendTo('#preorders');
    container.html('\
    <figure class="media-left">\
    <p class="image is-48x48">\
    <img src="https://bulma.io/images/placeholders/128x128.png">\
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
