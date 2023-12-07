class Enemy {
  constructor(i, j, arr) {
    this.sprite = createSprite((i + 1) * gb, (j + 1) * gb, gb * 0.5, gb * 0.5);
    this.sprite.shapeColor = rgb(200, 100, 0);
    this.target = {
      x: this.sprite.x,
      y: this.sprite.y,
      r: this.sprite.rotation,
    };
    this.shouldGoBackToRoam = false
    this.arr = arr;
    this.sprite.mass = 1;
    this.sprite.setCollider("rectangle", 0, 0, gb / 6, gb / 4);
    this.sprite.scale = 0.3;
    if (window.innerWidth < window.innerHeight) this.sprite.scale = 1.75;
    this.image_idle = loadImage("../Assets/Images/enemey/robot1_stand.png");
    this.image_moving = loadImage("../Assets/Images/enemey/robot1_hold.png");
    this.image_fire = loadImage("../Assets/Images/enemey/robot1_machine.png");
    this.image_question = loadImage("../Assets/Images/question.png");
    this.sprite.addImage("idle", this.image_idle);
    this.sprite.addImage("move", this.image_moving);
    this.sprite.addImage("fire", this.image_fire);
    this.isFiring = false;
    this.idx = 0;
    this.speed = int(gb * 0.05);
    this.i = int((1 / gb) * this.sprite.y - 1);
    this.j = int((1 / gb) * this.sprite.x - 1);
    this.pth = [];
    this.bulletGroup = new Array(0);
    this.time = { lastRoam: frameCount, wait: int(random(70, 120)) };
    this.state = "roam";
    this.pth = level.path(
      this.arr,
      { i: this.i, j: this.j },
      {
        i: int(random(0, this.arr.length - 6)),
        j: int(random(0, this.arr[0].length - 1)),
      }
    );
    while (this.pth.length < 1)
      this.pth = level.path(
        this.arr,
        { i: this.i, j: this.j },
        {
          i: int(random(0, this.arr.length - 3)),
          j: int(random(0, this.arr[0].length - 1)),
        }
      );
    this.lockedTarget = null;
    this.shoot_sound = loadSound("../Assets/Sounds/shoot.wav");
    this.die_sound = loadSound("../Assets/Sounds/kill.wav");
  }
  display() {
    var found;
    this.isFiring = false;
    drawSprites();
    if (this.state != "dead") {
      this.speed = int(gb * 0.05);
      found = false;
      if (
        frameCount - frontEndPlayer.lastFound.time < frameRate() * 5 &&
        frameCount > 200
      ) {
      // console.log("yo")
      if(this.shouldGoBackToRoam == true)
        this.state = "roam"
      else
      {
        this.lockedTarget = frontEndPlayer;
        found = true;
      }
		// this.speed = int(gb * 0.1);
      } else {
        this.lockedTarget = null;
        found = false;
		// this.speed = int(gb * 0.05);
      }
      if (found) {
        if (this.lockedTarget != null && this.shouldGoBackToRoam != true) {

          var lt;
          if(this.lockedTarget.lastFound)
            lt = this.lockedTarget.lastFound;
          else
          {
            lt = this.lockedTarget.sprite.position
            console.log(this.lockedTarget.sprite)
          }
          if (this.pth.length > 1) {
            if (
              this.pth[this.pth.length - 1][0] != lt.i &&
              this.pth[this.pth.length - 1][1] != lt.j
            ) {
            //   console.log("add enemies");
              this.pth = level.path(
                this.arr,
                { i: this.i, j: this.j },
                { i: lt.i, j: lt.j }
              );
              //click.i=lt.i;click.j=lt.j
            }
          }
        }
      } else if (this.state == "roam") {
        // console.log("roaming")
        if(this.lockedTarget != null)
          this.lockedTarget = null
        if (this.pth.length < 1) {
          if (frameCount >= this.time.lastRoam + this.time.wait) {
            // console.log("pathCalculated")
            this.pth = level.path(
              this.arr,
              { i: this.i, j: this.j },
              {
                i: int(random(0, this.arr[0].length - 1)),
                j: int(random(0, this.arr[0].length - 1)),
              }
            );
          }
          if (this.target.r <= 360) this.target.r += 5;
          else if (this.target.r >= 360) this.target.r = 0;
        } else this.time.lastRoam = frameCount;
      }
      this.i = int((1 / gb) * this.sprite.y - 1);
      this.j = int((1 / gb) * this.sprite.x - 1);
      this.move();
      if (found) {
        var ref = this.sprite;
        // console.log("found");
        image(
          this.image_question,
          ref.x + gb / 4,
          ref.y - gb / 4,
          gb / 3,
          gb / 3
        );
      }
      if (this.isFiring) this.sprite.changeImage("fire");
      this.sprite.bounceOff(frontEndPlayer.sprite, () => {
        this.die();
        var ref = frontEndPlayer;
        frontEndPlayer.sprite.x = (ref.j + 1) * gb;
        frontEndPlayer.sprite.y = (ref.i + 1) * gb;
      });
      let AllDie = false;
      for (let i = 0; i < this.bulletGroup.length; i++) {
        const element = this.bulletGroup[i];
        if(AllDie)
        {
          console.log("all die", i)
          element.destroy();
          // console.log(this.bulletGroup[i])
          break;
        }
        // console.log(i)
        element.collide(frontEndPlayer.sprite, () => {
          // console.log(frontEndPlayer.health)
          frontEndPlayer.health--;
          element.destroy();
          if(frontEndPlayer.health < 0)
          {
            console.log("enemy dying")
            this.bulletGroup = [];
            this.die(true);
            frontEndPlayer.die();
            AllDie = true;
          }
        });
        element.collide(level.wallsGroup, () => {
          element.destroy();
        });
      }
    }
  }
  die(byKillingPlayer = false) {
    // console.log("dead");
    this.sprite.destroy();
    this.state = "dead";
    // this.i = 100;
    this.die_sound.play();
    deadEnemiesCount++;
    if(!byKillingPlayer)
      frontEndPlayers[socket.id].found();
	let vari=1
	// socket.emit('enemyDead',vari)
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
    var speed = this.speed;
    //console.log(gi(s.x,s.y),gi(t.x,t.y))
    //var gs=gi(s.x,s.y),gt=gi(t.x,t.y)
    this.cone(s.x, s.y, s.rotation);
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
    var h = s.velocity.heading();
    if (s.velocity.x == 0 && s.velocity.y == 0) {
      h = this.target.r;
      s.changeImage("idle");
    }
    var rspeed = 5;
    if (s.rotation - h > 180) h = 360 + h;
    if (s.rotation > h) {
      s.rotation -= rspeed;
    } else if (s.rotation < h) {
      s.rotation += rspeed;
    }
    if (s.rotation == 360) s.rotation = 0;
    this.sprite = s;
  }
  cone(x, y, a) {
    var da = 44;
    var result = isInsideSector(
      { x: frontEndPlayer.sprite.x, y: frontEndPlayer.sprite.y },
      { x: x, y: y },
      a + da,
      a - da,
      gb * 1.75
    );
    push();
    fill(250, 125);
    if (result == true) {
      fill(255, 100, 100, 200);
      this.fire();
      frontEndPlayers[socket.id].found();
      this.target.r = angleBetwn(
        this.sprite.x,
        this.sprite.y,
        frontEndPlayer.sprite.x,
        frontEndPlayer.sprite.y
      );
    }
    noStroke();
    arc(x, y, gb * 3.75, gb * 3.75, a - da, a + da, PIE);
    pop();
  }
  moveTo(i, j) {
    this.target.x = (i + 1) * gb;
    this.target.y = (j + 1) * gb;
  }
  moveToPos(x = camera.mouseX, y = camera.mouseY) {
    x += gb / 2;
    y += gb / 2;
    var i = int((1 / gb) * y - 1);
    if (frontEndPlayer.i == i && frontEndPlayer.j == i) {
      return;
    }
    var j = int((1 / gb) * x - 1);
    if (i > this.arr.length) return;
    if (j > this.arr[0].length) return;
    this.pth = level.path(this.arr, { i: this.i, j: this.j }, { i: i, j: j });
    this.idx = 0;
    //    console.log(i,j)
    fill(255);
    click.i = i;
    click.j = j;
  }
  fire() {
    this.sprite.changeImage("fire");
    if (frameCount % 1 == 0) {
      var bullet = createSprite(this.sprite.x, this.sprite.y, gb / 5, gb / 15);
      this.isFiring = true;
      bullet.lifetime = int(frameRate() * 2);
      bullet.depth = this.sprite.depth - 1;
      bullet.shapeColor = "yellow";
      var a = angleBetwn(
        bullet.x,
        bullet.y,
        frontEndPlayer.sprite.x,
        frontEndPlayer.sprite.y
      );
      bullet.setSpeedAndDirection(gb / 4, a);
      bullet.restitution = 0;
      bullet.mass = 1;
      bullet.rotation = bullet.velocity.heading();
      if (this.bulletGroup.length > 20) this.bulletGroup.shift();
      this.bulletGroup.push(bullet);
      if (frameCount % 3 == 0) this.shoot_sound.play(0, 1.2, 0.3, 0, 0.5);
    }
  }
  checkResourceCollision()
  {
	for(let i =game.resources.length-1;i>=0;i--)
	{
		let resource = game.resources[i]
		if(this.sprite.overlap(resource))
		{
			//enemy picked up the resource
			game.resources.splice(i,1)
		}
	}
  }
}
function isInsideSector(p, c, sa, ea, r) {
  var relative = cartesian2Polar(p.x - c.x, p.y - c.y);
  if (
    relative.distance <= r &&
    ((relative.angle >= sa && relative.angle <= ea) ||
      (relative.angle <= sa && relative.angle >= ea))
  )
    return true;
  return false;
}
function cartesian2Polar(x, y) {
  push();
  //angleMode(RADIANS)
  di = sqrt(x * x + y * y);
  rad = atan2(y, x); //This takes y first
  polarCoor = { distance: di, angle: rad };
  pop();
  return polarCoor;
}
function angleBetwn(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = atan2(dy, dx); // range (-PI, PI]
  return theta;
}
