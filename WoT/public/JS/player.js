class Player {
  constructor(object) {
    this.playerNumber = object.playerNumber;
    this.playerId = object.playerId;
    var i = object.i;
    var j = object.j;
    this.arr = object.arr;
    this.sprite = createSprite((i + 1) * gb, (j + 1) * gb, gb * 0.5, gb * 0.5);
    this.sprite.shapeColor = "green";
    this.sprite.setCollider("rectangle", 0, 0, gb / 6, gb / 4);
    // console.log("pura object:");
    // console.log(object);
    // console.log(frontEndPlayer)
    this.loadImages(this.playerNumber);
    this.sprite.addImage("idle", this.imageIdle);
    this.sprite.addImage("move", this.imageMoving);
    this.sprite.mass = 2;
    this.sprite.scale = 0.3;
    if (window.innerWidth < window.innerHeight) this.sprite.scale = 1.75;
    this.target = {
      x: this.sprite.x,
      y: this.sprite.y,
      r: this.sprite.rotation,
    };
    this.arr = object.arr;
    this.idx = 0;
    this.health = 10;
    this.i = int((1 / gb) * this.sprite.y - 1);
    this.j = int((1 / gb) * this.sprite.x - 1);
    // console.log(this.i,this.j)
    this.pth = [];
    this.lockedTarget;
    this.lastFound = { time: 0, i: this.i, j: this.j };
  }

  loadImages(playerNumber) {
    // Modify this method to load images based on player number
    switch (playerNumber) {
      case 0:
        this.imageIdle = loadImage("/Assets/Images/player/rand.png");
        this.imageMoving = loadImage("/Assets/Images/player/rand.png");
        break;
      case 1:
        this.imageIdle = loadImage("/Assets/Images/player/egwene.png");
        this.imageMoving = loadImage("/Assets/Images/player/egwene.png");
        break;
      case 2:
        this.imageIdle = loadImage("/Assets/Images/player/perrin.png");
        this.imageMoving = loadImage("/Assets/Images/player/perrin.png");
        break;
      case 3:
        this.imageIdle = loadImage("/Assets/Images/player/matt.png");
        this.imageMoving = loadImage("/Assets/Images/player/matt.png");
        break;

      default:
        this.imageIdle = loadImage("/Assets/Images/player/rand.png");
        this.imageMoving = loadImage("/Assets/Images/player/rand.png");
    }
  }

  display() {
    this.i = int((1 / gb) * this.sprite.y - 1);
    this.j = int((1 / gb) * this.sprite.x - 1);
    this.sprite.tint = rgb(
      255,
      map(this.health, 0, 10, 0, 255, true),
      map(this.health, 0, 10, 0, 255, true)
    );
    this.move();
    this.sprite.x = int(this.sprite.x);
    this.sprite.y = int(this.sprite.y);
    this.drawPath();
    if (this.lockedTarget != null) {
      var lt = this.lockedTarget;
      if (this.pth.length > 1) {
        if (
          this.pth[this.pth.length - 1][0] != lt.i &&
          this.pth[this.pth.length - 1][1] != lt.j
        ) {
          // console.log("add")
          this.pth = level.path(
            this.arr,
            { i: this.i, j: this.j },
            { i: lt.i, j: lt.j }
          );
          click.i = lt.i;
          click.j = lt.j;
        }
      }
    }
  }

  move() {
    var pth = this.pth,
      idx = this.idx;
    if (pth) {
      if (idx < pth.length) {
        this.moveTo(pth[0][0], pth[0][1]);
      } else {
        this.idx;
      }
    }

    var t = this.target;
    var s = this.sprite;
    var speed = int(gb / 4);
    s.setVelocity(0, 0);
    if (t.x > s.x) {
      s.velocity.x = speed;
    } else if (t.x < s.x) {
      s.velocity.x = -speed;
    } else if (t.y > s.y) {
      s.velocity.y = speed;
    } else if (t.y < s.y) {
      s.velocity.y = -speed;
    }
    if (t.x == s.x && t.y == s.y && idx < pth.length) {
      this.pth.shift();
    }
    s.changeImage("move");

    if (s.velocity.x === 0 && s.velocity.y === 0) {
      s.changeImage("idle");
    }

    var h = s.velocity.heading();
    if (s.velocity.x === 0 && s.velocity.y === 0) {
      h -= 90;
      s.changeImage("idle");
    }
    if (s.rotation - h > 180) h = 360 + h;
    if (s.rotation > h) {
      s.rotation -= 10;
    } else if (s.rotation < h) {
      s.rotation += 10;
    }
    if (s.rotation === 360) s.rotation = 0;
  }

  cone(x, y, a) {
    push();
    translate(x, y);
    rotate(a);
    fill(255, 100);
    noStroke();
    arc(0, 0, gb * 4, gb * 3, -45, 45, PIE);
    pop();
  }

  moveTo(i, j) {
    this.target.x = (i + 1) * gb;
    this.target.y = (j + 1) * gb;
  }
  die(i, j) {
    // console.log("player dead");
    for (let i = 0; i < parr.length; i++) {
      console.log(parr[i])
      parr[i].state = "roam"
      parr[i].found = false
      parr[i].lockedTarget = null
      parr[i].shouldGoBackToRoam = true
      parr[i].pth = level.path(
        parr[i].arr,
        { i: parr[i].i, j: parr[i].j},
        { i: parr[i].i, j: parr[i].j}
      )
      let cond=2
      socket.emit('changeImages',({'x':i,'y':j,'cond':cond}))
      // parr[i].found = true
    }
    socket.emit("i died", socket.id)
    this.sprite.destroy();
    // this.die_sound.play();
    // deadEnemiesCount++;
    // frontEndPlayers[socket.id].found();

    // create wall at i,j
  }

  drawPath() {
    push();
    stroke(255, 223, 0);
    scale(gb);
    strokeWeight(0.1);
    noFill();
    if (this.pth.length > 1) {
      beginShape();
      curveVertex(this.pth[0][0], this.pth[0][1]);

      for (let i = 0; i < this.pth.length; i++) {
        const e = this.pth[i];
        curveVertex(e[0] + 1, e[1] + 1);
      }
      curveVertex(
        this.pth[this.pth.length - 1][0],
        this.pth[this.pth.length - 1][1]
      );
      endShape();
      if (this.pth.length < 2) return;
      var a = {
        x: this.pth[this.pth.length - 1][0],
        y: this.pth[this.pth.length - 1][1],
      };
      var b = {
        x: this.pth[this.pth.length - 2][0],
        y: this.pth[this.pth.length - 2][1],
      };
      if (this.lockedTarget != null) {
        b.x = this.lockedTarget.i;
        b.y = this.lockedTarget.j;
      }
      pop();
    }
  }

  moveToPos(x = camera.mouseX, y = camera.mouseY) {
    x = camera.x - width / 2 + mouseX;
    y = camera.y - height / 2 + mouseY;
    x += gb / 2;
    y += gb / 2;
    var i = int((1 / gb) * y - 1);
    var j = int((1 / gb) * x - 1);
    if (i > this.arr.length) return;
    if (j > this.arr[0].length) return;
    this.pth = level.path(this.arr, { i: this.i, j: this.j }, { i: i, j: j });
    this.idx = 0;
    fill(255);
    click.i = i;
    click.j = j;
    this.lockedTarget = null;
    for (let p = 0; p < parr.length; p++) {
      if (parr[p].i == i && parr[p].j == j) {
        this.setTarget(parr[p]);
        // console.log("target Locked");
      }
    }
    console.log("yaha")
    console.log(level.spawnPoints)
    for (let p = 0; p < level.spawnPoints.length; p++) {
      console.log("yaha2")
      // console.log("["+i+","+j+"]")
      if (level.spawnPoints[p][0] == i && level.spawnPoints[p][1] == j) {
        console.log("yaha3")
        if (playerPoint >= 4) {
          console.log("yaha4")
          playerPoint -= 4
          console.log("[" + x + "," + y + "]")
          socket.emit('closePortal', { 'x': i, 'y': j })
        }
      }
    }
  }

  setTarget(sprite) {
    this.lockedTarget = sprite;
    var i = sprite.i;
    var j = sprite.j;
    if (i > this.arr.length) return;
    if (j > this.arr[0].length) return;
    this.pth = level.path(this.arr, { i: this.i, j: this.j }, { i: i, j: j });
    this.idx = 0;
    fill(255);
    click.i = i;
    click.j = j;
  }

  found() {
    this.lastFound.time = frameCount;
    this.lastFound.i = this.i;
    this.lastFound.j = this.j;
  }
}
function drawArrow(base, vec, myColor = rgb(255, 223, 0)) {
  push();
  stroke(myColor);
  strokeWeight(gb);
  fill(myColor);
  scale(1 / gb)
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 1;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0)
  pop();
}
