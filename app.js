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

let products = [{
    id: 0,
    name: 'Coca-cola',
    price: 1.49
},
{
    id: 1,
    name: 'Fanta',
    price: 1.37
},
{
    id: 2,
    name: 'Cafe',
    price: 0.49
},
{
    id: 3,
    name: 'Mountain Dew',
    price: 1111
},
{
    id: 4,
    name: 'Kinder Bueno',
    price: 1.99
},
{
    id: 5,
    name: 'Bon pilon',
    price: 9.99
},
{
    id: 6,
    name: 'Lion',
    price: 1.79
},
{
    id: 7,
    name: 'Schweppes',
    price: 1.20
},
{
    id: 8,
    name: 'Prostituée russe',
    price: 123.12
},
{
    id: 9,
    name: 'Skittles',
    price: 1.08
},
{
    id: 10,
    name: 'Eau',
    price: 0.45
}
];

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
    res.render(__dirname + '/public/index.ejs', {
        users: users,
        user: user,
        products: products,
        shoppingList: shoppingList
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
        let createUser = database.query(query, [user.email, user.password])
        .then(rows => {
            if(rows.length)
                socket.emit('login', {ok: true, id: rows[0].id, isAdmin: rows[0].admin});
            else
                socket.emit('login', {ok: false});
        });
    });


    //Receiving an account creation request
    socket.on('signup', (data) => {

        //TODO Maybe add more contraints for account creation?

        let query = 'SELECT email FROM users WHERE email = ?;';
        let createUser = database.query(query, data.email)
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


    //TODO: An admin wants to access list of users
    //Send it on login, or make an event here?


    //An admin is placing an order -> trigger an UI event
    //WARNING Uncomplete: how is the list of items sent (now or on login)?
    socket.on('ordering', (data) => {

        let query = 'SELECT admin, id FROM users WHERE (email = ?) AND (password = ?);';
        let createUser = database.query(query, [data.admin.login, data.admin.hash])
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
        let createUser = database.query(query, [order.admin.login, order.admin.hash])
        .then(rows => {

            console.log("Command from " + order.admin.login + " for " + users[order.clientId].name);
            socket.emit('commandRecived');

            let price = 0.0;    //TODO Calculate this shit

            //Build content array (array of IDs, will be stringed before being stored in DB)
            //WARNING: Assumes commandList is an array, needs to be changed in the front
            let orderContent = [];

            for(let i=0; i<order.commandList.length; i++){
                for(let j=0; j<order.commandList[i].amount; j++){
                    orderContent.append(commandList[i].id);
                }
            }

            //If command was a preorder, check it
            if ( typeof preordersList[order.clientId] != 'undefined' || (users[order.clientId].hasOrdered) ){
                socket.broadcast.emit('preorderDone', order.clientId);
                socket.emit('preorderDone', order.clientId);

                delete preordersList[order.clientId];
                users[order.clientId].hasOrdered = false;

                //In DB, edit the existing entry
                let query = 'UPDATE orders SET pending = 0 WHERE customer_id = ? AND pending = 1';
                database.query(query, [order.clientId])
                .then((rows) => {
                    console.log('Command ended');
                });
            }

            //If it was a 'classic' order:
            else{
                let query = 'INSERT INTO orders (customer_id, price, content) VALUES(?, ?, ?)';
                database.query(query, [order.clientId, price, orderContent.toString()])
                .then((rows) => {
                    console.log('Command ended, added to DB');
                });
            }

            // TODO: debit the account
            //Calculate price by performing a query on items, and updating client's sold accordingly
            socket.emit('accountSold', {
                clientId: order.clientId,
                money: -666.0
            });
        });
    });


    socket.on('preorder', (order)=>{
        preordersList[order.clientId] = order;
        console.log(order);
        socket.broadcast.emit('preorders', [order]);
    })
});


server.listen(8080);
