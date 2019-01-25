var FlyingStar = new Phaser.Class({

    Extends: Phaser.Physics.Arcade.Sprite,

    initialize:

    function FlyingStar (scene, x, y, width, height, speed)
    {
        Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'star');

        //  This is the path the sprite will follow
        this.path = new Phaser.Curves.Ellipse(x, y, width, height);
        this.pathIndex = 0;
        this.pathSpeed = speed;
        this.pathVector = new Phaser.Math.Vector2();
        console.log("path vector2 "+this.pathVector.x+" "+this.pathVector.y);

        this.path.getPoint(0, this.pathVector);

        this.setPosition(this.pathVector.x, this.pathVector.y);
    },

    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);

        this.path.getPoint(this.pathIndex, this.pathVector);

        this.setPosition(this.pathVector.x, this.pathVector.y);

        this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
    }

});