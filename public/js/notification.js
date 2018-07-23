
/*
* TODO:
*  >animate notifiation apparition
*/


function notif(type, content) {
    let el = $('<div>').addClass('notification is-'+type).appendTo('#notifications');
    el.html('<button onclick="removeNotif('+el+')" class="delete"></button>' + content);

    setTimeout(()=>{
        removeNotif(el);
    }, 2000);
}

function removeNotif(el){
    el.remove();
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
