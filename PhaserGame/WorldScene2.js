var WorldScene2 = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:

    

    function WorldScene2 ()
    {
       
        Phaser.Scene.call(this, { key: 'WorldScene2' });
        
    },

    init: function (data)
    {
        console.log('init', data);
        this.score = data.x;
    },

    create: function ()
    {
        //Create background
        this.add.image(400, 300, 'sky');
        //this.add.image(400,488, 'slope');
        
        //Create ground
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        
        this.platforms.create(552, 47, 'ground').setScale(0.5,1).refreshBody();
        this.slope = this.physics.add.sprite(400, 480, 'slope');
        this.slope.body.setAllowGravity(false);

        //Create player
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

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
            repeat: 5,
            setXY: { x: 12, y: 0, stepX: 150 }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.scoreText = this.add.text(16, 16, 'score: '+this.score, { fontSize: '32px', fill: '#000' });

        //Add bomb
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.physics.add.overlap(this.player, this.slope);
        this.physics.add.collider(this.player, this.big);
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
            
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
    
            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            console.log("Create bombs.");
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

        if(this.checkOverlap(this.player, this.slope)){
            console.log("hit");
            var dX = this.player.x + this.player.width / 2 - this.slope.x;
            this.player.y = this.slope.y - this.player.height / 2 - dX;
            this.player.body.gravity.y = 0;
            
        }else{
            console.log("not hit");
            this.player.body.gravity.y = 300;
        }
    },

    checkOverlap: function(spriteA, spriteB) {
        
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);

    }
});