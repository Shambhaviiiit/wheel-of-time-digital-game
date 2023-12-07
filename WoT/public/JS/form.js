class Form {
  constructor() {
    this.Heading = "𝐋𝐞𝐯𝐞𝐥" + (activeLevel + 1);
    this.startButton = createButton("Enter");
    // console.log(this.startButton)
    // this.score1="Player Score: "+(playerPoint)
    // this.score2="Enemy Score: "+(enemyPoint)
  }
  show(toShow = true) {
    return new Promise((resolve) => {
      if(toShow)
        background(0);
      setGradient(
        camera.x - width / 2,
        camera.y - height / 2,
        width,
        height,
        color("#141e30"),
        color("#243b55"),
        "Y"
      );
      drawSprites();
      push();
      textAlign(CENTER);
      textSize(gb);
      fill("#F3F9ff"); //Level:X color
      text(this.Heading, width / 2 + (camera.x - width / 2), camera.y - gb * 4);
      pop();
      this.startButton.style("width", gb * 4 + "px");
      this.startButton.style("height", gb * 1.5 + "px");
      this.startButton.style("font-size", gb / 2 + "px");
      this.startButton.style("color", "#05263F");
      //  this.startButton.style('display','inline-block')
      this.startButton.style("border", "0.16em solid rgba(255,255,255,0)");
      this.startButton.style("border-radius", "1em");
      this.startButton.style(
        "box-shadow",
        "inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17)"
      );
      this.startButton.style("align", "center");
      this.startButton.style("background", "#329d9c"); //button color
      var x = (windowWidth - width) / 2;
      this.startButton.position(width / 2 - gb * 2 + x, camera.y + gb * 2);
      this.startButton.mousePressed(() => {
        // console.log("game Start");
        fill(255); // Set text color to white
        textSize(20); 
        textAlign(CENTER, CENTER)
        text("Waiting for other players to join!", width / 2, height / 2); 
        if(gameStart) {
          game = new Game();
          this.hide();
          deadEnemiesCount = 0;
        }
        else
        {
          console.log("waiting")
          socket.on('game start', ()=>{
            this.startButton.html("𝕊𝕥𝕒𝕣𝕥")
            gameStart = true;
          })
        }
      });
      resolve();
    });
  }
  hide() {
    this.startButton.hide();
  }
}
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis == "Y") {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      var inter = map(i, y, y + h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis == "X") {
    // Left to right gradient
    for (let j = x; j <= x + w; j++) {
      var inter2 = map(j, x, x + w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y + h);
    }
  }
}
