
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

function getIdFromClassNameUgly(el){    //Sorry :p

    let str = el.attr("class").match(/\d/g).map(Number);
    let Id =0;
    for (let i=str.length-1, pos=1; i>-1; i--, pos*=10){
        Id += str[i]*pos;
    }

    return Id;
}


function scrollDown(el){
    let h = $(el).get(0).scrollHeight;

    $(el).animate({scrollTop: h});
}


function editSoldHTML(id, price){
    let oldSold = parseFloat($('#adminSold'+id).html());
    let newSold = oldSold - price;
    newSold = newSold.toFixed(2);

    $('#adminSold'+id).html(newSold);
    $('#orderSold'+id).html(newSold+'€');
}
