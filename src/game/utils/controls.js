export const controls = {
    UP: {
        keyCode: Phaser.Keyboard.UP,
        buttonCode: Phaser.Gamepad.XBOX360_DPAD_UP,
        isPressed() {
            return (game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
                || (controls.UP.button && controls.UP.button.isDown)
                || controls.UP.key.isDown
        }
    },
    DOWN: {
        keyCode: Phaser.Keyboard.DOWN,
        buttonCode: Phaser.Gamepad.XBOX360_DPAD_DOWN,
        isPressed() {
            return (game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
                || (controls.DOWN.button && controls.DOWN.button.isDown)
                || controls.DOWN.key.isDown
        }
    },
    LEFT: {
        keyCode: Phaser.Keyboard.LEFT,
        buttonCode: Phaser.Gamepad.XBOX360_DPAD_LEFT,
        isPressed() {
            return (game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
                || (controls.LEFT.button && controls.LEFT.button.isDown)
                || controls.LEFT.key.isDown
        }
    },
    RIGHT: {
        keyCode: Phaser.Keyboard.RIGHT,
        buttonCode: Phaser.Gamepad.XBOX360_DPAD_RIGHT,
        isPressed() {
            return (game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
                || (controls.RIGHT.button && controls.RIGHT.button.isDown)
                || controls.RIGHT.key.isDown
        }
    },
    ACTION: {
        keyCode: Phaser.Keyboard.SPACEBAR,
        buttonCode: Phaser.Gamepad.XBOX360_A,
        isPressed() {
            return (controls.ACTION.button && controls.ACTION.button.isDown)
                || controls.ACTION.key.isDown
        }
    }
}

export function initControls() {
    game.controls = controls;
    game.input.gamepad.start();
    game.input.gamepad.onConnectCallback = initGamepadControls

    for (let control of Object.values(controls)) {
        game.input.keyboard.addKeyCapture([control.keyCode])
        control.key = game.input.keyboard.addKey(control.keyCode)
        control.button = game.input.gamepad.pad1.getButton(control.buttonCode)
        control.onDown = (callback, ctx) => {
            control.key.onDown.add(callback, ctx)
            if (control.button) control.button.onDown.add(callback, ctx)
        }
        control.onceDown = (callback, ctx) => {
            control.key.onDown.addOnce(callback, ctx)
            if (control.button) control.button.onDown.addOnce(callback, ctx)
        }
        control.stopListeningOnDown = (callback, ctx) => {
            control.key.onDown.remove(callback, ctx)
            if (control.button) control.button.onDown.remove(callback, ctx)
        }
    }

    controls.ACTION.key.onDown.add(() => game.player && game.player.doAction())
    console.log("Keyboard controls ready")
}

export function initGamepadControls() {
    for (let control of Object.values(controls)) {
        control.button = game.input.gamepad.pad1.getButton(control.buttonCode)
    }

    controls.ACTION.button.onDown.add(() => game.player && game.player.doAction())
    console.log("Gamepad controls ready")
}

