module Astroids {
    declare var astroids: any;

    export class Player extends Phaser.Sprite {

        static preload(game: Phaser.Game) {
            game.load.image('player', 'assets/player040.png');
        }

        private static UPDATE_ME_KEY: string = 'playerUpdateMe';

        private static ROTATION_SPEED: number = 200;
        private static SPEED: number = 300;

        constructor(game: Phaser.Game, x: number, y: number, private isLocal: boolean) {
            super(game, x, y, 'player');
            this.anchor.setTo(0.5, 0.5);
            game.add.existing(this);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.drag.set(300);

            if (!this.isLocal) {
                astroids.p2p.receiveText(Player.UPDATE_ME_KEY, this.onUpdateMe, this);
            }
        }

        update() {
            if (this.isLocal) {

                this.body.angularVelocity = 0;

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.body.angularVelocity = -Player.ROTATION_SPEED;
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.body.angularVelocity = Player.ROTATION_SPEED;
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    this.game.physics.arcade.velocityFromAngle(this.angle, Player.SPEED, this.body.velocity);
                }
                astroids.p2p.sendText(Player.UPDATE_ME_KEY, this.angle + ';' + this.x + ';' + this.y + ';');
            }
        }

        onUpdateMe(text: string) {
            console.log('player received ' + text);
            var messageArray = text.split(';');
            var messageRotation: number = +messageArray[0];
            var messageX: number = +messageArray[1];
            var messageY: number = +messageArray[2];

            this.angle = messageRotation;
            this.x = messageX;
            this.y = messageY;
        }
    }
}