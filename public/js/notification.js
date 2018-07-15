
/*
 * TODO:
 *  >animate notifiation apparition
 */
 // let notifCount = 0;
//
// function notif(type, content) { //TODO: UI
//   notifCount++; //avoid notif duplication
//   let notif = $('<div>').addClass(notifCount +' notification is-'+type);
//   notif.html('<button onclick="removeNotif('+notif+')" class="delete"></button>' + content);
//   notif.appendTo('#notifications');
//
//
// }
//
// function removeNotif(notif){
//   notif.remove();
//   delete notif;
// }


class Notification{

  // notif : undefined;

  constructor (type, content, er) {
    this.notif = $('<div>').addClass(' notification is-'+type);
    this.notif.html('<button onclick="removeNotif('+this.notif+')" class="delete"></button>' + content);
    this.notif.appendTo('#notifications');

    setTimeout(()=>{
      this.removeNotif(this.notif);
    }, 3000);
  }

  removeNotif(el) {
    el.remove();
  }
};
