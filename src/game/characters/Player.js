import { Character, CHARACTER_STATE } from "./Character"
import { talkTo, nextLine } from "../utils/dialogs";
import { save } from "../save";

export class Player extends Character {
	constructor(game, startPosition) {
		super(game, startPosition, "michel", game.save.playerState)
		this.type = "player"
		this.lucidity = 16
		this.body.setSize(10, 10, 11, 20)
		this.body.moves = true;
		this.watchingPoint = this.worldPosition;
	}

	update() {
		super.update();

		// coordonnées du point ciblé
		this.watchingPoint = {
			x: this.worldPosition.x,
			y: this.worldPosition.y
		};

		switch (this.state) {
			case CHARACTER_STATE.LEFT:
			case CHARACTER_STATE.WALKING_LEFT:
				this.watchingPoint.x -= 16;
				break;
			case CHARACTER_STATE.RIGHT:
			case CHARACTER_STATE.WALKING_RIGHT:
				this.watchingPoint.x += 16
				break;
			case CHARACTER_STATE.UP:
			case CHARACTER_STATE.WALKING_UP:
				this.watchingPoint.y -= 16
				break;
			case CHARACTER_STATE.DOWN:
			case CHARACTER_STATE.WALKING_DOWN:
				this.watchingPoint.y += 16
				break;
		}
	}

	move(keys) {
		if (game.dialog) return; // can't move while talking
		super.move(keys);

		if (game.lamp) {
			game.lamp.x = this.x
			game.lamp.y = this.y
		}
	}

	doAction() {
		if (game.dialog) return nextLine();

		let { x, y } = this.watchingPoint;
		let pnjInFront = game.groups.pnj.children.find(obj => obj instanceof Phaser.Sprite && obj.getBounds().contains(x, y));

		if (pnjInFront) {
			// talk to someone

			switch (this.state) {
				case CHARACTER_STATE.LEFT:
				case CHARACTER_STATE.WALKING_LEFT:
					pnjInFront.state = CHARACTER_STATE.RIGHT;
					break;
				case CHARACTER_STATE.RIGHT:
				case CHARACTER_STATE.WALKING_RIGHT:
					pnjInFront.state = CHARACTER_STATE.LEFT;
					break;
				case CHARACTER_STATE.UP:
				case CHARACTER_STATE.WALKING_UP:
					pnjInFront.state = CHARACTER_STATE.DOWN;
					break;
				case CHARACTER_STATE.DOWN:
				case CHARACTER_STATE.WALKING_DOWN:
					pnjInFront.state = CHARACTER_STATE.UP;
					break;
			}

			return talkTo(pnjInFront.key);
		}

		let objectInFront = game.groups.objects.children.find(obj => obj instanceof Phaser.Sprite && obj.getBounds().contains(x, y));
		if (objectInFront) {
			switch (objectInFront.key) {
				case "runes":
					game.variants = objectInFront.properties.find(prop => prop.name === "variant").value.split(",");
					save();
					game.state.start("Decryptor");
					return;
			}
		}
	}
}
