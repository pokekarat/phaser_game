
var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('slope', 'assets/slope.png');
        this.load.image('spark', 'assets/particles/blue.png');
        this.load.spritesheet('dude','assets/dude.png',
            { frameWidth: 32, frameHeight: 48 });
    },

    create: function ()
    {
        const startButton = this.add.text(350, 300, 'Start Game', { fill: '#0f0' });
        startButton.setInteractive();

        startButton.on('pointerdown', () => { 
            this.scene.start('WorldScene');
            console.log("Start scene A");
        });
        // start the WorldScene
        
    }
});

