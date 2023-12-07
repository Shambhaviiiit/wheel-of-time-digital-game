resetGame(state) {
    // Reset game logic here
    // console.log("reset game logic")
    game = null
    // form = null
    // form = new Form()
    // console.log("form")
    // console.log(form)
    if (state == 0) {
        console.log(state)
        // form.startButton.size(butto/nWidth, buttonHeight);
        // form.show(false)
        // background(0, 0, 0);
        // textSize(46);
        form.startButton.style("font-size", gb + "px");
        form.startButton.style("width", gb * 14 + "px");
        form.startButton.style("height", gb * 10 + "px");
        form.startButton.mousePressed(() => { })
        var x = (windowWidth - width) / 2;
        form.startButton.position(width / 2 - gb * 7, camera.y - gb * 5);
        // socket.on('updateEnemyPointsInAll', (id, points) => {
        //     if (id != socket.id) {
        //         if (enemyPoint < points)
        //             enemyPoint = points;
        //     }
        // })
        form.startButton.html("You Died<br>Enemy Points: " + enemyPoint + "<br>Player Points: " + playerPoint)
        form.startButton.show()
        // form.startButton = null
        // fill(255);
        // // form.Heading = " You lose\n" + form.Heading + "\nWait for the others to finish"
        // text("Player Score: " + playerPoint, camera.x - 0.44 * width, camera.y - 0.37 * height);
        // text("Enemy Score: " + enemyPoint, camera.x + 0.45 * width, camera.y - 0.37 * height);
        // gameStart = false
        this.resourceSprites = []
    }