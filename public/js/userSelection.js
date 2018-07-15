
let clientId;

$("button.order").on('click', (e)=>{
   //get Id of the user selected
  clientId = getIdFromClassName( e.target );

  $("#commandFor").html(usersList[clientId].name);

  changeView('order');

  socket.emit('ordering', {clientId: clientId, admin: connected});
});

socket.on('ordering', (data)=>{
  if (data.adminName){
    $(".order."+data.clientId).removeClass('is-success').addClass('is-warning');
  } else {
    $(".order."+data.clientId).removeClass('is-warning').addClass('is-success');
  }
  $('.amdin-in-charge.'+data.clientId).html('--servi par '+ data.adminName);
})
