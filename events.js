function socketIoEvents(socket, database){
    console.log('new connected');

    //New user connection
    socket.on('login', (user) => {

        //First get users
        let query = 'SELECT admin, id FROM users WHERE (email = ?) AND (password = ?);';

        database.query(query, [user.email, user.password])
        .then(rows => {


            if(rows.length > 0){

                //User found
                let isAdmin = rows[0].admin;
                let id = rows[0].id;

                let itemsRes;
                let users;

                //We need to fetch the items (and later users) list(s) and current preorders
                //For items, we currently select needed data only => Fetch graph data later?
                let query = 'SELECT id, name, price, stock FROM items ORDER BY id ASC;';
                database.query(query)
                .then(rows => {
                    itemsRes = rows;

                    //Select members
                    let query = 'SELECT id, faName, fiName, pseudo, email, balance, adherent, admin FROM users WHERE email != ?;';
                    return database.query(query, [user.email]);
                })
                .then(rows => {
                    users = rows;
                    //Select preorders
                    let query = 'SELECT customerId, date, price, content FROM orders WHERE pending = 1;';
                    return database.query(query);
                })
                .then(rows => {
                    if(isAdmin == 1){
                        //Send data for an admin member
                        let preorders = [];
                        let name;

                        //Look for name of customers having a preorder
                        for(let i=0; i<rows.length; i++){

                            for(let j=0; j<users.length; j++){
                                if(rows[i].customerId == users[j].id){
                                    name = {faName: users[j].faName, fiName: users[j].fiName, pseudo: users[j].pseudo}
                                    preorders.push({ commandList: rows[i].content, customerId : rows[i].customerId, date: rows[i].date, name : name });
                                }
                            }

                        }

                        //We also send preorders and users
                        socket.emit('login', {ok: true, id: id, isAdmin: isAdmin, itemsList : itemsRes, preorders : preorders, users: users});
                    }
                    else
                    //Send data for a non admin member
                    socket.emit('login', {ok: true, id: id, isAdmin: isAdmin, itemsList : itemsRes});
                });

            } else{
                //User not found
                socket.emit('login', {ok: false});
            }

        })
    });


    //Receiving an account creation request
    socket.on('signup', (data) => {

        //TODO Maybe add more contraints for account creation?

        let query = 'SELECT email FROM users WHERE email = ?;';
        database.query(query, data.email)
        .then(rows => {
            //If the mail doesn't exist yet in DB
            if (rows.length) {
                socket.emit("signupFailure");
            } else {
                query = "INSERT INTO users (faName, fiName, pseudo, email, password) VALUES(?, ?, ?, ?);"
                database.query(query, [data.faName, data.fiName, data.pseudo, data.email, data.password])
                .then(rows => {
                    console.log("User added!");
                    socket.emit("signupSuccess");
                });
            }
        });
    });



    //An admin is placing an order -> trigger an UI event
    //WARNING Uncomplete: how is the list of items sent (now or on login)?
    socket.on('ordering', (data) => {

        let query = 'SELECT admin, id FROM users WHERE (email = ?) AND (password = ?);';
        database.query(query, [data.admin.login, data.admin.hash])
        .then(rows => {

            //Check if the user sending event is an admin
            let isAdmin = false;
            if(rows.length){
                if(rows[0].admin){
                    isAdmin = true;
                }
            }

            if (!data.leave && isAdmin) {
                socket.broadcast.emit('ordering', {
                    customerId: data.customerId,
                    adminName: data.admin.login,
                    leave: data.leave
                });
            } else if(isAdmin) {
                socket.broadcast.emit('ordering', {
                    customerId: data.customerId,
                    adminName: '',
                    leave: data.leave
                });
            }
        });
    });


    //Receiving an order
    socket.on('order', (order) => {
        //WARNING Uncomplete
        //TODO Testing on orders validating queries

        let query = 'SELECT admin, id FROM users WHERE (email = ?) AND (password = ?);';
        database.query(query, [order.admin.login, order.admin.hash])
        .then(rows => {
            if(rows[0].admin == 1){

                console.log("Command from " + order.admin.login + " for " + order.customerId);
                socket.emit('commandReceived');


                //If command was a preorder, check it
                //WARNING Probably needs a dedicated event (eg. 'validatePreorder', sending order or user Id only)

                //If it was a 'classic' order:

                //Insert the order in DB
                let query = 'INSERT INTO orders (customerId, price, content) VALUES(?, ?, ?)';
                database.query(query, [order.customerId, order.price, order.commandList.toString()])
                .then((rows) => {
                    let query = 'UPDATE users SET balance = balance - ? WHERE id = ?';
                    return database.query(query, [order.price, order.customerId]);
                })
                //Update client's sold
                .then(rows => {
                    console.log('Account debited');
                });


                // TODO: debit the account
            }
        });
    });


    socket.on('preorder', (order)=>{
        let query = 'SELECT id FROM orders WHERE pending = 1 AND customerId = ?';
        database.query(query, [order.customerId])
        .then(rows => {
            //We check that the user has no preorder yet
            if(rows.length > 0){
                let query = 'INSERT INTO orders (customerId, price, content, pending) VALUES(?, ?, ?, 1)';
                database.query(query, [order.customerId, order.price, order.commandList.toString()])
                .then((rows) => {
                    let query = 'SELECT faName, fiName, pseudo FROM users WHERE id = ?;';
                    return database.query(query, [order.customerId]);
                })
                .then((rows) => {
                    socket.broadcast.emit('preorder', {customerId: order.customerId, commandList: order.commandList, price: order.price, date: new Date().toLocaleString(), name: rows[0]});
                });
            }
        })


    });


    /***********************    ADMINISTRATION  STUFF ******************************/

    //PRODUCTS ADMINISTRATION
    socket.on('adminProduct', (data)=>{

        let query = 'SELECT admin FROM users WHERE email = ?;';
        database.query(query, [data.admin.login])
        .then(rows => {

            if (rows[0].admin) {


                switch (data.action){
                    case 'updateProduct': // TODO: DB link
                    console.log('Product update:');

                    let query1 = 'UPDATE items SET name = ?, price = ?, stock = ? WHERE id = ?;';
                    database.query(query1, [data.product.name, parseFloat(data.product.price), parseFloat(data.product.amount), data.product.id])
                    .then(rows => {
                        console.log('Update successfull');
                    });

                    break;

                    case 'newProduct':  // TODO: DB link
                    console.log('Product addition:');
                    let query2 = 'INSERT INTO items (name, price, stock) VALUES(?, ?, ?);';
                    database.query(query2, [data.product.name, parseFloat(data.product.price), parseFloat(data.product.amount), data.product.id])
                    .then(rows => {
                        console.log('Insertion successfull');
                    });

                    break;
                }
            }
        });
    });

    //USERS ADMINISTRATION
    socket.on('editUser', (data)=>{

        console.log("Receiving edit");

        let query = 'SELECT admin FROM users WHERE email = ?';
        database.query(query, [data.admin.login])
        .then(rows => {

            //For an edition
            if(!data.edition.hasOwnProperty('remove')){
                if (rows[0].admin) {
                    let query = 'UPDATE users SET fiName = ?, faName = ?, pseudo = ?, balance = ?, email = ?, adherent = ?, admin = ? WHERE id = ?';
                    database.query(query, [data.edition.fiName, data.edition.faName, data.edition.pseudo, data.edition.balance, data.edition.email, data.edition.adherent, data.edition.admin, data.edition.id])
                    .then(rows =>{

                        console.log("Edit successfull");

                        socket.emit('editUser', data.edition);
                        socket.broadcast.emit('editUser', data.edition);
                    })
                }
                //For a removal
            } else{
                let query = 'REMOVE FROM users WHERE id = ? LIMIT 1;';
                database.query(query, [data.edition.id])
                .then(rows =>{
                    console.log("Removal successfull")
                });
            }
        });
    });

}

module.exports = {socketIoEvents};
