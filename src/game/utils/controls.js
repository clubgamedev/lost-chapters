export const controls = {
    UP: {
        keyCode: Phaser.Keyboard.UP,
        buttonCode: Phaser.Gamepad.XBOX360_DPAD_UP,
        isPressed() {
            return (stick.getDirection() === "up")
                || (controls.UP.button && controls.UP.button.isDown)
                || controls.UP.key.isDown
        }
    },
    DOWN: {
        keyCode: Phaser.Keyboard.DOWN,
        buttonCode: Phaser.Gamepad.XBOX360_DPAD_DOWN,
        isPressed() {
            return (stick.getDirection() === "down")
                || (controls.DOWN.button && controls.DOWN.button.isDown)
                || controls.DOWN.key.isDown
        }
    },
    LEFT: {
        keyCode: Phaser.Keyboard.LEFT,
        buttonCode: Phaser.Gamepad.XBOX360_DPAD_LEFT,
        isPressed() {
            return (stick.getDirection() === "left")
                || (controls.LEFT.button && controls.LEFT.button.isDown)
                || controls.LEFT.key.isDown
        }
    },
    RIGHT: {
        keyCode: Phaser.Keyboard.RIGHT,
        buttonCode: Phaser.Gamepad.XBOX360_DPAD_RIGHT,
        isPressed() {
            return (stick.getDirection() === "right")
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
    },
    SECONDARY: {
        keyCode: Phaser.Keyboard.SHIFT,
        buttonCode: Phaser.Gamepad.XBOX360_B,
        isPressed() {
            return (controls.SECONDARY.button && controls.SECONDARY.button.isDown)
                || controls.SECONDARY.key.isDown
        }
    },
    SELECT: {
        keyCode: Phaser.Keyboard.TAB,
        buttonCode: Phaser.Gamepad.XBOX360_Y,
        isPressed() {
            return (controls.SELECT.button && controls.SELECT.button.isDown)
                || controls.SELECT.key.isDown
        }
    },
    ENTER: {
        keyCode: Phaser.Keyboard.ENTER
    }
}

export const stick = {
    getDirection(THRESHOLD = 0.5) {
        let axisX = stick.getAxisX(),
            axisY = stick.getAxisY();

        if (Math.abs(axisX) > Math.abs(axisY)) {
            if (axisX > THRESHOLD) return "right"
            if (axisX < -THRESHOLD) return "left"
            return null
        } else {
            if (axisY > THRESHOLD) return "down"
            if (axisY < -THRESHOLD) return "up"
            return null
        }
    },

    getAxisX() {
        return game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)
    },

    getAxisY() {
        return game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)
    },

    onDirection(callback) {
        let waitForStickReset = false;
        game.input.gamepad.onAxisCallback = function (e) {
            const axis = stick.getDirection(0.95)
            if (axis != null && !waitForStickReset) {
                waitForStickReset = true;
                callback(axis)
            } else if (stick.getDirection(0.05) === null) {
                waitForStickReset = false;
            }
        }
    },

    resetEvents() {
        game.input.gamepad.onAxisCallback = null;
    }
}

export function initControls() {
    game.controls = controls;
    game.input.gamepad.start();
    game.input.gamepad.onConnectCallback = initGamepadControls

    for (let control of Object.values(controls)) {
        game.input.keyboard.addKeyCapture([control.keyCode])
        control.key = game.input.keyboard.addKey(control.keyCode)
        if (control.buttonCode) {
            control.button = game.input.gamepad.pad1.getButton(control.buttonCode)
        }
        control.onPress = (callback, context = control, once = false) => {
            let add = once ? "addOnce" : "add"
            control.event = { callback, context, once }
            control.key.onDown[add](callback, context)
            if (control.button) control.button.onDown[add](callback, context)
        }
        control.resetEvents = () => {
            control.key.onDown.removeAll(control.event.context)
            if (control.button) control.button.onDown.removeAll(control.event.context)
            delete control.event;
        }
    }
}

export function initGamepadControls() {
    for (let control of Object.values(controls)) {
        control.button = game.input.gamepad.pad1.getButton(control.buttonCode)
        if (control.event && control.button) {
            let add = control.event.once ? "addOnce" : "add"
            control.button.onDown.removeAll(control.event.context)
            control.button.onDown[add](control.event.callback, control.event.context)
        }
    }
}

