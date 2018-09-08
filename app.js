const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const jsSHA = require("jssha");
const mysql = require('mysql');
const nodeMailer = require('nodemailer');
const fs = require('fs'); //Required to read html files to send mails

const databaseWrapper = require('./db_wrapper.js');
const events = require('./events.js');
const mailSender = require('./mailsender.js');

/******************************************************************************/


let user = "ESSAIM";

let shaObj = new jsSHA("SHA-512", "TEXT");
shaObj.update("toor");
let passwordHash = shaObj.getHash("HEX");

global.shoppingList = ["Cafe (x1442)",
"Skittles de qualité",
"Ice Tea (x98)",
"Kinder Buenos",
"Des tables de blackjack",
"Et des putes"
];


/******************************************************************************/

// Creation of database connection
//Put correct data
var config = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'snacktest'
};

var database = new databaseWrapper.Database(mysql, config);

/******************************************************************************/

// Mailer init

var mail = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arveto.softwares@gmail.com',
    pass: '***PASSWORD***'
  }
});

/******************************************************************************/

//Serve public folder
app.use(require('express').static(__dirname + '/public'));

//Get main page
app.get('/', (req, res) => {

    let shoppingList;

    //Those queries only contain useful data for page generation
    let query = 'SELECT * FROM shoppingList;'
    database.query(query)
    .then(rows => {
        shoppingList = rows;

        let query = 'SELECT id, name, price, stock, onSale FROM items WHERE deleted = 0 ORDER BY id ASC;'
        return database.query(query)
    })
    .then(rows => {
        res.render(__dirname + '/public/index.ejs', {
            //user: user,
            products: rows,
            shoppingList: shoppingList
        });
    });


});


/******************************************************************************/

//Socket.io events

io.sockets.on('connection', function(socket) {
    events.socketIoEvents(socket, database, mail, mailSender);    //Create events listeners
});

server.listen(8080);
