export class Scie {
    sprite;

    create(x, y) {
        this.sprite = game.add.image(x, y, 'escape_scie', 0);
        this.sprite.animations.add('open', [1, 2, 3], 10);
        this.sprite.animations.add('move', [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10);
    }

    openScie() {
        this.sprite.animations.play('open');
    }

    activate() {
        let anim = this.sprite.animations.play('move');
        anim.enableUpdate = true;
        anim.onUpdate.add(anim => {
            if (anim.currentFrame.index === 10) {
                this.onEndAnim(); // defined in parent
            }
        });
    }
}