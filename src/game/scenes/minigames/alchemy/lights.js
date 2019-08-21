import HueRotate from "../../../utils/HueRotate"
import FogFilter from "../../../utils/FogFilter";

export class Light {
    constructor(position, radius = 100, color = "rgba(255, 255, 255, 1.0)", flicker = 2) {
        this.position = position
        this.radius = radius
        this.color = color;
        this.flicker = flicker;
    }
}

export class AlchemyLights {
    constructor(group) {
        this.group = group;

        let shadowTexture = game.add.bitmapData(game.width, game.height)
        shadowTexture.radius = 90
        let sprite = game.add.image(0, 0, shadowTexture)
        sprite.width = game.width + 10
        sprite.height = game.height + 10
        sprite.blendMode = Phaser.blendModes.MULTIPLY
        this.group.add(sprite)

        let filterSprite = game.add.image(0, 0, shadowTexture)
        filterSprite.width = game.width + 10
        filterSprite.height = game.height + 10
        filterSprite.blendMode = Phaser.blendModes.MULTIPLY
        this.group.add(filterSprite)

        this.light = { sprite, shadowTexture, obscurity: 0.75, filterSprite }
        this.lights = [];

        this.cameraLight = new Light({ x: 0, y: 0 }, 250, "white", 0);
        this.lights.push(this.cameraLight);

        this.moonLight = new Light({ x: game.width / 2, y: 220 }, 1000, "white", 1)
        this.lights.push(this.moonLight);

        const hue = 0, fog = 0;

        if (hue) {
            const frag = new HueRotate(game);
            // the angle you provide determines the new color
            frag.init(game.width, game.height, sprite, Phaser.Math.degToRad(180));
            this.hueFilter = new Phaser.Filter(game, frag.uniforms, frag.fragmentSrc);
            game.world.filters = [this.hueFilter]
        }

        if (fog) {
            this.fogFilter = new FogFilter(game);
            filterSprite.filters = [this.fogFilter]
        }
    }

    update(player, moon, timeProgress) {

        this.cameraLight.position = player.position;
        this.moonLight.position.y = 220 + moon.y;
        this.moonLight.radius = 1000 - 950 * timeProgress;

        let saturation = Math.max(100, 10 + 150 * timeProgress),
            lightness = (100 - 50 * timeProgress),
            playerLightness = Math.min(100, 1.25 * lightness),
            alpha = Math.min(1, 2 - 2 * timeProgress),
            playerAlpha = Math.min(1, alpha + 0.5);

        this.cameraLight.color = `hsla(10, ${saturation.toFixed(2)}%, ${playerLightness.toFixed(2)}%, ${playerAlpha.toFixed(2)})`
        this.moonLight.color = `hsla(10, ${saturation.toFixed(2)}%, ${lightness.toFixed(2)}%, ${alpha.toFixed(2)})`

        let ctx = this.light.shadowTexture.context;
        ctx.clearRect(-10, -10, game.width + 20, game.height + 20);

        ctx.fillStyle = `rgba(0, 0, 0, ${this.light.obscurity})`
        ctx.fillRect(
            -10,
            -10,
            game.width + 20,
            game.height + 20
        )

        this.lights.forEach(light => {
            let radius = light.radius + game.rnd.integerInRange(-light.flicker, light.flicker),
                posX = light.position.x,
                posY = light.position.y

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


        this.light.shadowTexture.dirty = true
        this.hueFilter && this.hueFilter.update();
        this.fogFilter && this.fogFilter.update();
    }

    clear() {
        this.light.sprite.destroy();
        this.light.filterSprite.destroy();

        game.world.filters = null
        this.hueFilter && this.hueFilter.destroy();
        delete this.hueFilter;

        this.fogFilter && this.fogFilter.destroy();
        delete this.fogFilter;
    }
}