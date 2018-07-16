
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

let users = [ {id: 0, name: "Soursou", money: 24.03, hasOrdered: false},  //All users
    {id: 1, name: "Calcado", money: -238.00, hasOrdered: true},
    {id: 2, name: "Pian", money: 999.99, hasOrdered: false},
    {id: 3, name: "Sadre", money: 654.58, hasOrdered: false} ];

let user = "ESSAIM"; //login to TERRUSS account

let shaObj = new jsSHA("SHA-512", "TEXT");
shaObj.update("toor");
let passwordHash = shaObj.getHash("HEX");

let products = [  {id: 0, name: 'Coca-cola', price: 1.49},
    {id: 1, name: 'Fanta', price: 1.37},
    {id: 2, name: 'Cafe', price: 0.49},
    {id: 3, name: 'Mountain Dew', price: 1111},
    {id: 4, name: 'Kinder Bueno', price: 1.99},
    {id: 5, name: 'Bon pilon', price: 9.99},
    {id: 6, name: 'Lion', price: 1.79},
    {id: 7, name: 'Schweppes', price: 1.20},
    {id: 8, name: 'Prostituée russe', price: 123.12},
    {id: 9, name: 'Skittles', price: 1.08},
    {id: 10, name: 'Eau', price: 0.45}
];

let shoppingList = [  "Cafe (x1442)",
    "Skittles de qualité",
    "Ice Tea (x98)",
    "Kinder Buenos",
    "Des choses",
    "D'autres choses"];

/******************************************************************************/

    // Creation of database connection
//Put correct data
var config = {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'snake'
};

var database = new databaseWrapper.Database(mysql, config);

/******************************************************************************/


    //Serve public folder
app.use(require('express').static(__dirname + '/public'));

    //Get main page
app.get('/', (req, res) => {
    res.render(__dirname + '/public/index.ejs', {users: users, user: user, products: products, shoppingList: shoppingList});
});


/******************************************************************************/

    //Socket.io events

io.sockets.on('connection', function(socket) {
    console.log('new connected');


    //New user connection
    socket.on('login', (user)=>{
        if ( (user.name=='ESSAIM' && user.password==passwordHash) ){
            socket.emit('login', true);
            console.log('ESSAIM IS LOGGED');
        } else {
            console.log('LOGIN FAILED');
            socket.emit('login', false);
        }
    });


    //Receiving an account creation request
    socket.on('signup', (data) =>{

        //TODO Maybe add more contraints for account creation?

        let query = 'SELECT email FROM users WHERE email = ?;';
        let createUser = database.query(query, data.email)
        .then(rows =>{
            //If the mail doesn't exist yet in DB
            if(rows.length){
                socket.emit("signupFailure");
            }
            else{
                query = "INSERT INTO users (faname, finame, pseudo, email) VALUES(?, ?, ?, ?);"
                database.query(query, [data.faName, data.fiName, data.pseudo, data.email])
                .then(rows => {
                    console.log("User added!");
                    socket.emit("signupSuccess");
                });
            }
        });
    });


    //An admin is placing an order -> trigger an UI event
    //WARNING Uncomplete
    socket.on('ordering', (data)=>{
        console.log(data);
        if (data.admin.login && data.admin.hash == passwordHash) {
            if (!data.leave){
                console.log(users[data.clientId].name + ' est servi par '+ data.admin.login);
                socket.broadcast.emit('ordering', {clientId: data.clientId, adminName: data.admin.login, leave: data.leave});
            } else {
                console.log(data.admin.login +' quitte la commande de ' + users[data.clientId].name);
                socket.broadcast.emit('ordering', {clientId: data.clientId, adminName: '', leave: data.leave});
            }
        }
    })

    socket.on('command', (command)=>{
    //WARNING Uncomplete
        if ( (command.admin.login == 'ESSAIM' && command.admin.hash == passwordHash ) ){
            console.log("COMMAND FROM "+command.admin.login+" FOR "+users[command.clientId].name+" : ");
            socket.emit('commandRecived');
            console.log(command.commandList);

            // TODO: debit the account
            socket.emit('accountSold', {clientId: command.clientId, money: -666.0});
        }
    })
});


server.listen(80);
