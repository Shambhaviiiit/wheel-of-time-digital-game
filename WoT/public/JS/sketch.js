var data = [];
var activeBlock = 10;
var game;
var gb = 75, database;
var level, parr, e1, example_img;
function preload() {
  win_sound = loadSound("Assets/Sounds/final.wav");
}
let cnv;
function setup() {
  // if (window.innerWidth > window.innerHeight) {
  //   cnv = createCanvas(window.innerHeight * (2 / 3), window.innerHeight);
  //   gb = map(width, 0, height, 1, 10) * (width / 100)
  //   gb = round(gb / 60) * 60
  // }
  // else {
  //   cnv = createCanvas(window.innerWidth, window.innerHeight);
  //   gb = map(width, 1000, 10000, 150, 1500)

  //   gb = map(gb, 100, 200, 2, 4) * 50
  //   gb = int((int(gb / 10) * 10) / 5) * 5
  // }
  cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.willReadFrequently = true;
  gb = map(width, 0, height, 1, 10) * (width / 100); //mapping the gb value based on the width of the canvas(p5.js library)
  gb = round(gb / 60) * 6;
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  form = new Form();
}
var click = { i: 0, j: 0 };
let formReady = false;
var gameStart = false;
function draw() {
  // if(gameStart) {
    
    if (!formReady) {
      form.show().then(() => {
        formReady = true;
        if (game) game.play();
      });
    } else {
      if (game) game.play();
    }
    socket.emit('game ready', true)
  // }
  // else
  // {
  //   socket.on('game start', ()=>{
  //     gameStart = true;
  //   })
  // }
  // console.log("game is ready karte")
  // form.show();
  // if (game) game.play();
}
function mouseClicked() {
  if (edit) {
    var i = gi(mouseX, mouseY);
    level.data[i.y][i.x] = activeBlock;
  }
  if (game != null) {
    frontEndPlayer.moveToPos();
  }
  // console.log("mouseCliked");
}
