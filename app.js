const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const jsSHA = require("jssha");
const mysql = require('mysql');

const databaseWrapper = require('./db_wrapper.js');

/******************************************************************************/

/*
*  Testing variables
*  TODO: fill them with weird SQL stuff...
*/

let users = [{
    id: 0,
    name: "Soursou",
    money: 24.03,
    hasOrdered: false
}, //All users
{
    id: 1,
    name: "Calcado",
    money: -238.00,
    hasOrdered: true
},
{
    id: 2,
    name: "Pian",
    money: 999.99,
    hasOrdered: false
},
{
    id: 3,
    name: "Sadre",
    money: 654.58,
    hasOrdered: false
},
{
    id: 4,
    name: "TERRUSS",
    money: 100000000,
    hasOrdered: false
}
];

let user = "ESSAIM";

let shaObj = new jsSHA("SHA-512", "TEXT");
shaObj.update("toor");
let passwordHash = shaObj.getHash("HEX");

    //OLD: Now fetched by DB on demand
// let products = [{
//     id: 0,
//     name: 'Coca-cola',
//     price: 1.49
// },
// {
//     id: 1,
//     name: 'Fanta',
//     price: 1.37
// },
// {
//     id: 2,
//     name: 'Cafe',
//     price: 0.49
// },
// {
//     id: 3,
//     name: 'Mountain Dew',
//     price: 1111
// },
// {
//     id: 4,
//     name: 'Kinder Bueno',
//     price: 1.99
// },
// {
//     id: 5,
//     name: 'Bon pilon',
//     price: 9.99
// },
// {
//     id: 6,
//     name: 'Lion',
//     price: 1.79
// },
// {
//     id: 7,
//     name: 'Schweppes',
//     price: 1.20
// },
// {
//     id: 8,
//     name: 'Prostituée russe',
//     price: 123.12
// },
// {
//     id: 9,
//     name: 'Skittles',
//     price: 1.08
// },
// {
//     id: 10,
//     name: 'Eau',
//     price: 0.45
// }
// ];

let shoppingList = ["Cafe (x1442)",
"Skittles de qualité",
"Ice Tea (x98)",
"Kinder Buenos",
"Des choses",
"D'autres choses"
];

/*                    v this is the clientId, to find more simply the order */
let preordersList = { 1: {clientId: 1, timestamp: '14h12000', commandList: [{id: 6, amount: 12}, {id: 5, amount: 4}]},
3: {clientId: 3, timestamp: '123h4 du matin', commandList: [{id: 1, amount: 1}]}};


/******************************************************************************/

// Creation of database connection
//Put correct data
var config = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'snake'
};

var database = new databaseWrapper.Database(mysql, config);

/******************************************************************************/


//Serve public folder
app.use(require('express').static(__dirname + '/public'));

//Get main page
app.get('/', (req, res) => {
    //TODO Dynamically fetch users (on admin login?)

    //This query only contains useful data for page generation
    let query = 'SELECT id, name, price FROM items WHERE on_sale = 1 ORDER BY id ASC;'
    database.query(query)
    .then(rows => {
        res.render(__dirname + '/public/index.ejs', {
            users: users,
            user: user,
            products: rows,
            shoppingList: shoppingList
        });
    });


});


/******************************************************************************/

//Socket.io events

io.sockets.on('connection', function(socket) {
    console.log('new connected');

    //testing preorder display
    socket.emit('preorders', preordersList);


    //New user connection
    socket.on('login', (user) => {
    let query = 'SELECT admin, id FROM users WHERE (email = ?) AND (password = ?);';
        database.query(query, [user.email, user.password])
        .then(rows => {
            if(rows.length){
                console.log("Admin value: "+rows[0].admin);

                if(rows.length > 0){
                    //User found
                    let isAdmin = rows[0].admin;
                    let id = rows[0].id;

                    //We need to fetch the items (and later users) list(s)
                    //For items, we currently select needed data only => Fetch graph data later?
                    let query = 'SELECT id, name, price, stock FROM items ORDER BY id ASC;';
                    database.query(query)
                    .then(rows => {
                        socket.emit('login', {ok: true, id: id, isAdmin: isAdmin, itemsList : rows});
                    });
                } else
                //User not found
                socket.emit('login', {ok: false});
            }
        });
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
                query = "INSERT INTO users (faname, finame, pseudo, email, password) VALUES(?, ?, ?, ?);"
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
                console.log(users[data.clientId].name + ' est servi par ' + data.admin.login);
                socket.broadcast.emit('ordering', {
                    clientId: data.clientId,
                    adminName: data.admin.login,
                    leave: data.leave
                });
            } else if(isAdmin) {
                // if (data.clientId){ //prevent sovketevents duplication
                console.log(data.admin.login + ' quitte la commande de ' + users[data.clientId].name);
                socket.broadcast.emit('ordering', {
                    clientId: data.clientId,
                    adminName: '',
                    leave: data.leave
                });
                // }
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

                console.log("Command from " + order.admin.login + " for " + users[order.clientId].name);
                socket.emit('commandReceived');


                //If command was a preorder, check it
                if ( typeof preordersList[order.clientId] != 'undefined' || (users[order.clientId].hasOrdered) ){
                    //WARNING Needs refactoring

                    socket.broadcast.emit('preorderDone', order.clientId);
                    socket.emit('preorderDone', order.clientId);

                    delete preordersList[order.clientId];
                    users[order.clientId].hasOrdered = false;

                    //In DB, edit the existing entry
                    let query = 'UPDATE orders SET pending = 0 WHERE customer_id = ? AND pending = 1';
                    database.query(query, [order.clientId])
                    .then((rows) => {
                        console.log('Command ended');
                        let query = 'UPDATE users SET balance = balance - ? WHERE id = ?';
                        return database.query(query, [order.price, order.clientId]);
                    })
                    //Update client's sold
                    .then(rows => {
                        console.log('Account debited');
                    });
                }

                //If it was a 'classic' order:
                else{
                    //Insert the order in DB
                    let query = 'INSERT INTO orders (customer_id, price, content) VALUES(?, ?, ?)';
                    database.query(query, [order.clientId, order.price, order.commandList.toString()])
                    .then((rows) => {
                        console.log('Command ended, added to DB');
                        let query = 'UPDATE users SET balance = balance - ? WHERE id = ?';
                        return database.query(query, [order.price, order.clientId]);
                    })
                    //Update client's sold
                    .then(rows => {
                        console.log('Account debited');
                    });
                }

                // TODO: debit the account
                //Calculate price by performing a query on items, and updating client's sold accordingly
                socket.emit('accountSold', {
                    clientId: order.clientId,
                    money: -666.0
                });
            }
        });
    });


    socket.on('preorder', (order)=>{
        //TODO: Add to DB, broadcast the order to all users
        console.log('A preorder! yay:)');



        let query = 'INSERT INTO orders (customer_id, price, content, pending) VALUES(?, ?, ?, 1);';
        database.query(query, [order.clientId, order.price, order.commandList])
        .then((rows) => {
            socket.broadcast.emit('preorder', {clientId: order.clientId, commandList: order.commandList, price: order.price, timestamp: new Date().toLocaleString()});
        });
    });
});


server.listen(8080);
