function socketIoEvents(socket, database){
    console.log('new connected');

/***********************  ACCOUNT LOGIN/SIGNUP  ******************************/

    //New user connection
    socket.on('login', (user) => {
        let isAdmin;
        let id;
        let userData;

        //First get users
        let query = 'SELECT admin, id, fiName, faName, pseudo, email, balance, adherent FROM users WHERE (email = ?) AND (password = ?);';

        database.query(query, [user.email, user.password])
        .then(rows => {

            if(rows.length > 0){

                //User found
                isAdmin = rows[0].admin;
                id = rows[0].id;
                userData = rows[0];

                let itemsRes;
                let users;

                //We need to fetch the items (and later users) list(s) and current preorders
                //For items, we currently select needed data only => Fetch graph data later?
                let query = 'SELECT id, name, price, stock, nOrders FROM items ORDER BY id ASC;';
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

                        //Also get data to display on the dashboard (currently the last order)
                        let query = 'SELECT customerId FROM orders ORDER BY date DESC LIMIT 1;'
                        database.query(query)
                        .then(rows => {
                            let lastCustomer = rows[0].customerId;
                            socket.emit('login', {ok: true, isAdmin: isAdmin, itemsList : itemsRes, preorders : preorders, users: users, lastCustomer: lastCustomer, userData: userData});
                        });


                    }
                    else{
                        //Send data for a non admin member
                        //TODO Select data relevant for the user to display it on dashboard (currently its recent favorite products)

                        let query = 'SELECT content FROM orders WHERE id = ? LIMIT 10;';
                        database.query(query, [id])
                        .then(rows =>{
                            socket.emit('login', {ok: true, isAdmin: isAdmin, itemsList : itemsRes, userData: userData, graphData: rows});
                        });

                    }
                });

            } else{
                //User not found
                socket.emit('login', {ok: false});
            }

        })
    });


    //Receiving an account creation request
    socket.on('signup', (data) => {

        //TODO Allow the user to login immediatly (needsss queries, etc)

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
                    socket.emit("signupSuccess", {faName: data.faName, fiName: data.fiName, pseudo: data.pseudo, email: data.email, admin: false});
                });
            }
        });
    });

/***********************  ORDER, PREORDER EVENTS  ******************************/

    //Receiving an order
    socket.on('order', (order) => {
        //TODO Also support preorders (different query for the order INSERTION)

        console.log("Received an order =)");

        let query = 'SELECT admin, id FROM users WHERE (email = ?) AND (password = ?);';
        database.query(query, [order.connectionData.login, order.connectionData.hash])
        .then(rows => {
            if(rows[0].admin == 1){

                console.log("Command from " + order.admin.login + " for " + order.customerId);
                socket.emit('commandReceived');

                //Insert the order in DB
                let query = 'INSERT INTO orders (customerId, price, content) VALUES(?, ?, ?)';
                database.query(query, [order.customerId, order.price, order.commandList.toString()])
                .then((rows) => {
                    let query = 'UPDATE users SET balance = balance - ? WHERE id = ?';
                    return database.query(query, [order.price, order.customerId]);
                })
                //Update client's sold
                .then(rows => {
                    console.log("Sold updated!");
                });

                //Update the nOrders Factor (WARNING Ugly as f***)
                query = 'UPDATE items SET nOrders = nOrders + 1, stock = stock - 1 WHERE id = ? AND stock > 0;'
                for(let i=0; i<order.commandList.length; i++){
                    database.query(query, [order.commandList[i]])
                    .then(rows => {});
                }
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
