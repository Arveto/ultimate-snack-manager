//used to receive preorders only
var preorders = [];

socket.on('preorder', (command) =>{
    console.log("Received preorder! Sugoiiii!")

    //TODO Get user's first and family names && Format timestamp

    notif('info', '<b>'+'PlaceHolder Name'+'</b> a envoyé une commande !')

    let container = $('<article>').addClass('media box preco'+command.clientId).appendTo('#preorders');
    container.html('\
    <figure class="media-left">\
    <p class="image is-48x48">\
    <img src="https://bulma.io/images/placeholders/128x128.png">\
    </p>\
    </figure>\
    <div class="media-content">\
    <div class="content">\
    <p>\
    <strong>'+'PlaceHolder Name'+'</strong>&nbsp;·&nbsp;<small class="preorder-uptime">à '+command.timestamp+'</small><br/>\
    <ul id="preco'+command.clientId+'">\
    </ul>\
    </p>\
    </div>\
    </div>\
    <div class="media-right">\
    <button class="button is-medium is-success preco" onclick="precoButtonDirtyFuncBecauseDidntFollowedPOOPrecepts('+command.clientId+')"><!--I m sorry for that..-->\
    <span class="icon is-large is-left">\
    <i class="fa fa-arrow-right"></i>\
    </span>\
    </button>\
    </div><br/>');

    //Append command content to HTML, look for names
    for(let i=0; i<command.commandList.length; i++){
        for(let j=0; j<products.length; j++){
            if(products[j].id == command.commandList[i].id){
                $('<li>').html(products[command.coommandlist[i].id].name + '(x'+command.coommandlist[i].amount+')').appendTo('#preco'+command.clientId);
            }
        }
    }

    preorder.append(command);

});

socket.on('preorderDone', (clientId)=>{
    $("article.preco"+clientId).remove(); // remove order from the preordersList
    $(".precoBell"+clientId).remove(); //remove the bell in the userSelection
})


function precoButtonDirtyFuncBecauseDidntFollowedPOOPrecepts(clientId){
    //What the fuck is that function?
    //We're gonna talk about that
    $('button.order.'+clientId).trigger('click');
}
