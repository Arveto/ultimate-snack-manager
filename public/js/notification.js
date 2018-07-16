
/*
 * TODO:
 *  >animate notifiation apparition
 */

 let notifCount = 0;

function notif(type, content) {
  notifCount++; //avoid notif duplication
  let notif = $('<div>').addClass(notifCount +' notification is-'+type);
  notif.html('<button onclick="removeNotif('+notifCount+')" class="delete"></button>' + content);
  notif.appendTo('#notifications');

  setTimeout(()=>{
    removeNotif(notifCount);
  }, 3000);
}

function removeNotif(id){
  $('.notification.'+id).remove();
}


// class Notification{
//
//   constructor (type, content, er) {
//     this.notif = $('<div>').addClass(' notification is-'+type);
//     this.notif.html('<button onclick="$(this).parent().removeNotif()" class="delete"></button>' + content);
//     this.notif.appendTo('#notifications');
//
//     setTimeout(()=>{
//       this.removeNotif();
//     }, 10000);
//   }
//
// };
//
// function removeNotif(el) {
//   this.notif.remove();
// }
