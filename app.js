
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const jsSHA = require("jssha");


  /*
   *  Testing variables
   *  TODO: fill them with weird SQL stuff...
   */

let users = [ {name: "Soursou", money: 24, hasOrdered: false},  //All users
              {name: "Calcado", money: -238, hasOrdered: true},
              {name: "Pian", money: 1000, hasOrdered: false},
              {name: "Sadre", money: 654, hasOrdered: false} ];

let user = "Alberto"; //login to TERRUSS account

let shaObj = new jsSHA("SHA-512", "TEXT");
shaObj.update("toor");
let passwordHash = shaObj.getHash("HEX");

let products = [  {name: 'Coca-cola', price: 321.5},
                  {name: 'cookie', price: 0.1},
                  {name: 'vaseline', price: 18.99},
                  {name: 'jeune thailandais', price: 'OUT OF ORDER'},
                  {name: 'sushi', price: 18.99},
                  {name: 'Senzu rouge', price: 1832.99},
                  {name: 'Senzu bleu', price: 0.99999},
                  {name: 'Senzu jaune', price: 32.123},
                  {name: 'Senzu vert', price: 123.123},
                  {name: 'Senzu #2f2f2f', price: 666},
                  {name: 'Senzu cyan', price: 42424242},
                  {name: 'Senzu plantulaire', price: 1111},
                  {name: 'Senzu nature', price: 'nature'},
                  {name: 'Senzu gentil', price: '01 47 20 00001'}  ];

let shoppingList = [  "Bla blabla blablabla blablabnal",
                      "Bla blabla blablabla blablabnal",
                      "Bla blabla blablabla blablabnal",
                      "Bla blabla blablabla blablabnal",
                      "Bla blabla blablabla blablabnal" ];



app.use(require('express').static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render(__dirname + '/public/index.ejs', {users: users, user: user, products: products, shoppingList: shoppingList});
});


io.sockets.on('connection', function(socket) {
  console.log('new connected');

  socket.on('login', (user)=>{
    if (user.name=='terruss' && user.password==passwordHash){
      console.log('TERRUSS IS LOGGED');
      socket.emit('login', true);
    } else {
      console.log('LONGIN FAILED');
      socket.emit('login', false);
    }
  })
});


server.listen(4242);
