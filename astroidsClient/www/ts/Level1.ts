module Astroids {
    declare var astroids: any;

    export class Level1 extends Phaser.State {

        localPlayer: Player;

        private static CREATE_PLAYER_KEY: string = 'createPlayer';

        preload() {
            this.load.image('bg', 'assets/bg.png');
            Player.preload(this.game);
        }

        create() {
            astroids.p2p.receiveText(Level1.CREATE_PLAYER_KEY, this.onNewPlayer, this);

            var bg = this.add.sprite(0, 0, 'bg');

            var randX = this.game.rnd.realInRange(0, this.world.width * 0.3);
            var randY = this.game.rnd.realInRange(0, this.world.height * 0.3);
            this.localPlayer = new Player(this.game, randX, randY, true);
            astroids.p2p.sendText(Level1.CREATE_PLAYER_KEY, randX + ';' + randY + ';');
        }

        onNewPlayer(text: string) {
            console.log('level 1 received ' + text);
            var messageArray = text.split(';');
            var messageX: number = +messageArray[0];
            var messageY: number = +messageArray[1];
            new Player(this.game, messageX, messageY, false);

            astroids.p2p.sendText(Level1.CREATE_PLAYER_KEY,
                this.localPlayer.x + ';' + this.localPlayer.y + ';');
        }
    }
} 