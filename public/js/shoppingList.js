function shoppingListAddProduct(){let a={};a.content=$("#shoppingListInput").val(),socket.emit("shoppingListAddProduct",a),$("#shoppingListInput").val("")}function shoppingListProductEdit(a){a.content=$("#shoppingContent"+a.id).text(),$("#shoppingContent"+a.id).html("<input id=\"shoppingInput"+a.id+"\"></input>"),$("#shoppingInput"+a.id).val(a.content),$("#shoppingInput"+a.id).on("keypress",b=>{let c=b.keyCode||b.which;13==c&&socket.emit("shoppingListProductEdit",{content:$("#shoppingInput"+a.id).val(),id:a.id})})}function shoppingListCheckProduct(a){socket.emit("shoppingListDeleteProduct",a)}$("#shoppingListInput").on("keypress",a=>{let b=a.keyCode||a.which;13==b&&shoppingListAddProduct()}),$("#button_shoppingListAddProduct").on("click",()=>{shoppingListAddProduct()}),socket.on("shoppingListProductEdit",a=>{$("#shoppingContent"+a.id).html(a.content)}),socket.on("shoppingListDeleteProduct",a=>{$("#shoppingProduct"+a.id).remove()}),socket.on("shoppingListAddProduct",a=>{$("#shoppingListContainer").append(`<tr class="has-icons-right" id="shoppingProduct`+a.id+`">\
        <td id="shoppingContent`+a.id+`"> `+a.content+` </td>\
            <td class="icon is-right">\
                <a class= "button is-small is-info" onclick="shoppingListProductEdit( {name:'`+a.content+`', id:`+a.id+`})" href="#">\
                    <i class="fa fa-edit "></i>\
                </a>\
                <a class= "button is-small is-success" onclick="shoppingListCheckProduct( {name:'`+a.content+`', id:`+a.id+`})" href="#">\
                    <i class="fa fa-check "></i>\
                </a>\
        </td>\
        </tr>`).appendTo("#shoppingListProducts")});