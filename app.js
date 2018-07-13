
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const jsSHA = require("jssha");


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
                  {id: 3, name: 'Mountain Dew', price: 'Rupture de stock'},
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



app.use(require('express').static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render(__dirname + '/public/index.ejs', {users: users, user: user, products: products, shoppingList: shoppingList});
});



io.sockets.on('connection', function(socket) {
  console.log('new connected');

  socket.on('login', (user)=>{
        //For now, allow any password
    if ( (user.name=='ESSAIM' && user.password==passwordHash) ){
      socket.emit('login', true);
      console.log('ESSAIM IS LOGGED');
    } else {
      console.log('LOGIN FAILED');
      socket.emit('login', false);
    }
  })
});


server.listen(80);
