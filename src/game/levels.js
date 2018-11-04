
import { Mole } from "./characters/Mole"
import { Treant } from "./characters/Treant"

export const forestLevel = {
    name: "La forêt",
    tilemap: "map",
    tileset: "tileset",
    startPosition: { x: 47, y: 31 },
    exitPosition: { x: 46, y: 27 }
}

export const caveLevel = {
    name: "Le Terrier",
    tilemap: "map_cave",
    tileset: "tileset_cave",
    startPosition: { x: 10, y: 8 },
    exitPosition: { x: 50, y: 24 }
}


export class Level {

    constructor({ name, tilemap, tileset, startPosition, exitPosition }) {
        this.name = name;
        this.startPosition = startPosition;
        this.createTileMap(tilemap, tileset);
        this.createGroups();
        this.createExit(exitPosition);
        this.createEnemies();
    }

    createTileMap(tilemap, tileset) {
        //tilemap
        this.tilemap = game.add.tilemap(tilemap);
        this.tilemap.addTilesetImage("collisions");
        this.tilemap.addTilesetImage(tileset);
        this.tilemap.addTilesetImage("objects");

        this.layer_collisions = this.tilemap.createLayer("Collisions Layer");
        this.layer = this.tilemap.createLayer("Tile Layer");
        this.layer2 = this.tilemap.createLayer("Tile Layer 2");

        // collisions
        this.tilemap.setCollision(1, true, this.layer_collisions);

        this.layer.resizeWorld();
        this.layer2.resizeWorld();
        this.layer_collisions.resizeWorld();

        // this.layer_collisions.visible = true;
        // this.layer_collisions.debug = true;
        // this.layer.visible = false;
    }

    createGroups() {
        game.groups = {};
        game.groups.enemies = game.add.group();
        game.groups.enemies.enableBody = true;

        game.groups.loot = game.add.group();
        game.groups.loot.enableBody = true;

        game.groups.objects = game.add.group();
        game.groups.objects.enableBody = true;

        game.groups.projectiles = game.add.group();
        game.groups.projectiles.enableBody = true;
    }

    createEnemies() {
        findObjectsByType("mole", this.tilemap, "Object Layer").forEach(enemy => {
            let verticalMove = enemy.properties.some(prop => prop.name === "vertical" && prop.value === true)
            game.groups.enemies.add(new Mole(enemy.x / 16, enemy.y / 16, verticalMove));
        });

        findObjectsByType("treant", this.tilemap, "Object Layer").forEach(enemy => {
            game.groups.enemies.add(new Treant(enemy.x / 16, enemy.y / 16));
        })
    }

    createExit({ x, y }) {
        this.exit = game.add.sprite(x * 16, y * 16, "exit");
        this.exit.alpha = 0;
        game.physics.arcade.enable(this.exit);
    }

}
// find objects in a Tiled layer that containt a property called "type" equal to a certain value
function findObjectsByType(type, map, layer) {
    return map.objects[layer].filter(element => {
        //console.log(element);
        if (element.type === type) {
            //Phaser uses top left, Tiled bottom left so we have to adjust the y position
            //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
            //so they might not be placed in the exact pixel position as in Tiled
            //console.log("Found " + element.type);
            element.y -= map.tileHeight;
            return element;
        }
    });
}