
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const jsSHA = require("jssha");


  /*
   *  Testing variables
   *  TODO: fill them with weird SQL stuff...
   */

let users = [ {name: "Soursou", money: 24.03, hasOrdered: false},  //All users
              {name: "Calcado", money: -238.00, hasOrdered: true},
              {name: "Pian", money: 999.99, hasOrdered: false},
              {name: "Sadre", money: 654.58, hasOrdered: false} ];

let user = "ESSAIM"; //login to TERRUSS account

let shaObj = new jsSHA("SHA-512", "TEXT");
shaObj.update("toor");
let passwordHash = shaObj.getHash("HEX");

let products = [  {name: 'Coca-cola', price: 1.49},
                  {name: 'Fanta', price: 1.37},
                  {name: 'Cafe', price: 0.49},
                  {name: 'Mountain Dew', price: 'Rupture de stock'},
                  {name: 'Kinder Bueno', price: 1.99},
                  {name: 'Bon pilon', price: 9.99},
                  {name: 'Lion', price: 1.79},
                  {name: 'Schweppes', price: 1.20},
                  {name: 'Prostituée russe', price: 123.12},
                  {name: 'Skittles', price: 1.08},
                  {name: 'Eau', price: 0.45}
];

let shoppingList = [  "Cafe (x1442)",
                      "Skittles de qualité",
                      "Ice Tea (x98)",
                      "Kinder Buenos",
                      "Des choses",
                      "D'autres choses"];



app.use(require('express').static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render(__dirname + '/public/index.ejs', {users: users, user: user, products: products, shoppingList: shoppingList});
});


io.sockets.on('connection', function(socket) {
  console.log('new connected');

  socket.on('login', (user)=>{
        //For now, allow any password
    if ( (user.name=='terruss' && user.password==passwordHash) || 1){
      console.log('TERRUSS IS LOGGED');
      socket.emit('login', true);
    } else {
      console.log('LONGIN FAILED');
      socket.emit('login', false);
    }
  })
});


server.listen(4242);
