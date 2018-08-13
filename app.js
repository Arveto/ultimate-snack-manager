const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const jsSHA = require("jssha");
const mysql = require('mysql');

const databaseWrapper = require('./db_wrapper.js');
const events = require('./events.js');

/******************************************************************************/


let user = "ESSAIM";

let shaObj = new jsSHA("SHA-512", "TEXT");
shaObj.update("toor");
let passwordHash = shaObj.getHash("HEX");

let shoppingList = ["Cafe (x1442)",
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
    database: 'snake'
};

var database = new databaseWrapper.Database(mysql, config);

/******************************************************************************/


//Serve public folder
app.use(require('express').static(__dirname + '/public'));

//Get main page
app.get('/', (req, res) => {
    //This query only contains useful data for page generation
    let query = 'SELECT id, name, price, stock FROM items WHERE onSale = 1 ORDER BY id ASC;'
    database.query(query)
    .then(rows => {
        res.render(__dirname + '/public/index.ejs', {
            user: user,
            products: rows,
            shoppingList: shoppingList
        });
    });


});


/******************************************************************************/

//Socket.io events

io.sockets.on('connection', function(socket) {
    events.socketIoEvents(socket, database);    //Create events listeners
});

server.listen(8080);
