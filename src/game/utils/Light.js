export class Light {
    constructor(position, radius = 100, color = "rgba(255, 255, 255, 1.0)") {
        this.position = position
        this.radius = radius
        this.color = color;
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

    game.light = { sprite, shadowTexture, obscurity }
    game.lights = [];

    game.cameraLight = new Light(game.camera, lightRadius, "white");
}

export function updateLights() {

    game.cameraLight.position = game.player.position;
    game.light.sprite.reset(game.camera.x - 5, game.camera.y - 5)

    let ctx = game.light.shadowTexture.context;

    ctx.fillStyle = `rgba(0, 0, 0, ${game.light.obscurity})`
    ctx.fillRect(
        -10,
        -10,
        game.width + 10,
        game.height + 10
    )

    game.lights.forEach(light => {
        let radius = light.radius + game.rnd.integerInRange(-2, 2),
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

}