
/**
* Get the number passed in the classname
*
* @name getIdFromClassName
* @function
* @param el {jQuery event.target}
* @return {Number} founded number
*/

function getIdFromClassName(el){

    let str = el.className.match(/\d/g).map(Number);
    let Id =0;
    for (let i=str.length-1, pos=1; i>-1; i--, pos*=10){
        Id += str[i]*pos;
    }

    return Id;
}


/**
* Scroll down the section in parameter
*
* @name getIdFromClassName
* @function
* @param el {CSS selector}
* @return {none}
*/

function scrollDown(el){
    let h = $(el).get(0).scrollHeight;

    $(el).animate({scrollTop: h});
}
