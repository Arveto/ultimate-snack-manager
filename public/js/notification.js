
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
