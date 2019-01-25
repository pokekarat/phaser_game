var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    create: function ()
    {
        //Create background
        this.add.image(400, 300, 'sky');
        this.score = 0;

        //Create ground
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        
        //Create player
        this.player = this.physics.add.sprite(300, 450, 'dude');
        //this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        //this.player.body.setGravityY(100);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10, //10 frames per sec
            repeat: -1 //to loop
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player,this.platforms);

        //Add star
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        //this.newStar = new FlyingStar(this, 150, 100, 100, 100, 0.005);

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.stars.add(new FlyingStar(this, 150, 100, 100, 100, 0.005), true);

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //Add bomb
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        //Add movable ground
        var block = this.physics.add.image(400,300, 'ground')
                    .setScale(0.5)
                    .setImmovable(true)
                    .setVelocity(50,-50);
        block.body.setAllowGravity(false);

        this.tweens.timeline({
            targets: block.body.velocity,
            loop: -1,
            tweens: [
              { x:    0, y:    -100,  duration: 3000, ease: 'Stepped' },
              { x:    0, y:     100,  duration: 3000, ease: 'Stepped' }
            ]
          });
        
        this.physics.add.collider(block, this.player);
    },

    hitBomb: function(player, bomb){

        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver = true;
    },

    collectStar: function(player, star)
    {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

       /* if(this.score == 20){
            console.log("score "+this.score);
            this.scene.start('WorldScene2',{x:this.score});
        } */
    
        if (this.stars.countActive(true) === 0)
        {
            console.log("score "+this.score);
            this.scene.start('WorldScene2',{x:this.score});

            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
    
            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    },

    update: function (time, delta)
    {
        if (this.gameOver)
        {
            return;
        }

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
            //console.log("player x", this.player.body.x);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-320);
            //console.log("Player x", this.player.body.y);
        }
    }
});