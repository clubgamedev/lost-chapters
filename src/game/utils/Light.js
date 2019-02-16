import HueRotate from "./HueRotate"
import FogFilter from "./FogFilter";

export class Light {
    constructor(position, radius = 100, color = "rgba(255, 255, 255, 1.0)", flicker = 2) {
        this.position = position
        this.radius = radius
        this.color = color;
        this.flicker = flicker;
        game.lights.push(this);
    }
}

export function initLights(lightRadius, obscurity = 0.75) {
    let shadowTexture = game.add.bitmapData(game.width, game.height)
    shadowTexture.radius = 90
    let sprite = game.add.image(0, 0, shadowTexture)
    sprite.width = game.width + 10
    sprite.height = game.height + 10
    sprite.blendMode = Phaser.blendModes.MULTIPLY

    let filterSprite = game.add.image(0, 0, shadowTexture)
    filterSprite.width = game.width + 10
    filterSprite.height = game.height + 10
    filterSprite.blendMode = Phaser.blendModes.MULTIPLY

    game.light = { sprite, shadowTexture, obscurity, filterSprite }
    game.lights = [];

    game.cameraLight = new Light(game.camera, lightRadius, "white", 0);

    const frag = new HueRotate(game);
    //here you would have to pass  display size. the angle you provide determines the new color
    frag.init(game.width, game.height, sprite, Phaser.Math.degToRad(180));
    game.hueFilter = new Phaser.Filter(game, frag.uniforms, frag.fragmentSrc);

    game.fogFilter = new FogFilter(game);

    game.world.filters = [game.hueFilter]
    filterSprite.filters = [game.fogFilter]
}

export function updateLights() {

    game.cameraLight.position = game.player.position;
    game.light.sprite.reset(game.camera.x - 5, game.camera.y - 5)
    game.light.filterSprite.reset(game.camera.x - 5, game.camera.y - 5)

    let ctx = game.light.shadowTexture.context;

    ctx.fillStyle = `rgba(0, 0, 0, ${game.light.obscurity})`
    ctx.fillRect(
        -10,
        -10,
        game.width + 10,
        game.height + 10
    )

    game.lights.forEach(light => {
        let radius = light.radius + game.rnd.integerInRange(-light.flicker, light.flicker),
            posX = light.position.x - game.camera.x,
            posY = light.position.y - game.camera.y

        let gradient = ctx.createRadialGradient(
            posX,
            posY,
            light.radius * 0.5,
            posX,
            posY,
            radius
        )
        gradient.addColorStop(0, light.color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)")

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(
            posX,
            posY,
            radius,
            0,
            Math.PI * 2,
            false
        )
        ctx.fill()
    })


    game.light.shadowTexture.dirty = true
    game.hueFilter.update();
    game.fogFilter.update();
}