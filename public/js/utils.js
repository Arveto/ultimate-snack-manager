function getIdFromClassName(a){let b=a.className.match(/\d/g).map(Number),c=0;for(let d=b.length-1,e=1;-1<d;d--,e*=10)c+=b[d]*e;return c}function getIdFromClassNameUgly(a){let b=a.attr("class").match(/\d/g).map(Number),c=0;for(let d=b.length-1,e=1;-1<d;d--,e*=10)c+=b[d]*e;return c}function scrollDown(a){let b=$(a).get(0).scrollHeight;$(a).animate({scrollTop:b})}function editSoldHTML(a,b){let c=parseFloat($("#adminSold"+a).html()),d=c-b;d=d.toFixed(2),$("#adminSold"+a).html(d),$("#orderSold"+a).html(d+"\u20AC")}