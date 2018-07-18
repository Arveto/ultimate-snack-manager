
socket.on('preorders', (commands)=>{
  $.each(commands, (clientId, command)=>{
    if (logged)
      notif('info', '<b>'+usersList[command.clientId].name+'</b> a envoyé une commande !')

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
    <strong>'+usersList[command.clientId].name+'</strong>&nbsp;·&nbsp;<small class="preorder-uptime">à '+command.timestamp+'</small><br/>\
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

    for (let product in command.commandList){
      if (command.commandList.hasOwnProperty(product)) {
        $('<li>').html(productsList[product.id].name + '(x'+product.amount+')').appendTo('#preco'+command.clientId);
      }
    }
  })
});

socket.on('preorderDone', (clientId)=>{
  $("article.preco"+clientId).remove(); // remove order from the preordersList
  $(".precoBell"+clientId).remove(); //remove the bell in the userSelection
})


function precoButtonDirtyFuncBecauseDidntFollowedPOOPrecepts(clientId){
  $('button.order.'+clientId).trigger('click');
}
