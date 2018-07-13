
$("button.order").on('click', (e)=>{
   //get Id of the user selected
  let userId = getIdFromClassName( e.target );

  $("#commandFor").html(usersList[userId].name);

  changeView('order');
});
