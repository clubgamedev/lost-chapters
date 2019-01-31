export function createParticlesEmitter(position, width, spriteKey) {
    let emitter = game.add.emitter(position.x, position.y);
    emitter.width = width;
    emitter.makeParticles(spriteKey);
    emitter.setRotation(0, 0);
    emitter.setAlpha(0, 1);
    emitter.setScale(0.5, 1, 0.5, 1);
    emitter.setXSpeed(0, 0);
    emitter.setYSpeed(50, 100);
    emitter.start(false, 300, 100, 0);
    return emitter;
}