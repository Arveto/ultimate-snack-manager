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

let shoppingList = ["Cafe (x1442)",
"Skittles de qualité",
"Ice Tea (x98)",
"Kinder Buenos",
"Des choses",
"D'autres choses"
];


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
    let query = 'SELECT id, name, price FROM items WHERE onSale = 1 ORDER BY id ASC;'
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
                    let query = 'SELECT id, faName, fiName, pseudo, email, balance, adherent FROM users WHERE email != ?;';
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
                console.log(users[data.customerId].name + ' est servi par ' + data.admin.login);
                socket.broadcast.emit('ordering', {
                    customerId: data.customerId,
                    adminName: data.admin.login,
                    leave: data.leave
                });
            } else if(isAdmin) {
                // if (data.customerId){ //prevent sovketevents duplication
                console.log(data.admin.login + ' quitte la commande de ' + users[data.customerId].name);
                socket.broadcast.emit('ordering', {
                    customerId: data.customerId,
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

                console.log("Command from " + order.admin.login + " for " + users[order.customerId].name);
                socket.emit('commandReceived');


                //If command was a preorder, check it
                //WARNING Probably needs a dedicated event (eg. 'validatePreorder', sending order or user Id only)

                //If it was a 'classic' order:

                //Insert the order in DB
                let query = 'INSERT INTO orders (customerId, price, content) VALUES(?, ?, ?)';
                database.query(query, [order.customerId, order.price, order.commandList.toString()])
                .then((rows) => {
                    console.log('Command ended, added to DB');
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
});


server.listen(8080);
