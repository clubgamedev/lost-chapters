
import { range } from "./utils/array"

export const sounds = {}

export function loadAudio() {
    game.load.audio("music_forest", ["assets/sound/ForestV1.mp3"]);
    game.load.audio("music_school", ["assets/sound/Song_Mistery.ogg"]);
    game.load.audio("music_sanctuary", ["assets/sound/Song_VisitingHerForest.ogg"]);
    game.load.audio("music_cave", ["assets/sound/Song_PainfulMemories_Loop.ogg"]);
    game.load.audio("music_autel", ["assets/sound/Music_6_EvilBattle_Loop.ogg"]);
    game.load.audio("music_battle", ["assets/sound/BRPG_Take_Courage_FULL_Loop.ogg"]);
    game.load.audio("music_boss", ["assets/sound/BRPG_Hell_Spawn_FULL_Loop.ogg"]);

    game.load.audio("hurt", ["assets/sound/hurt.ogg", "assets/sound/hurt.mp3"]);
    game.load.audio("item", ["assets/sound/collect_item_02.wav", "assets/sound/item.mp3"]);
    game.load.audio("hallucination", ["assets/sound/hallucination.wav"]);

    game.load.audio('pick', ['assets/alchemy/sounds/pick.wav']);
    game.load.audio('cook_fail', ['assets/alchemy/sounds/cook_fail.wav']);
    game.load.audio('cook_success', ['assets/alchemy/sounds/cook_success.wav']);
    game.load.audio('book_open', ['assets/sound/Book Open.mp3']);
    game.load.audio('book_close', ['assets/alchemy/sounds/book_close.mp3']);
    game.load.audio("book_page", ["assets/sound/Book Page 1.mp3"]);
    game.load.audio("menu_positive", ['assets/sound/MenuPositive.wav']);
    game.load.audio("menu_negative", ['assets/sound/MenuNegative.wav']);
    game.load.audio("menu_move", ['assets/sound/MenuMove.wav']);
    game.load.audio("start_game", ['assets/sound/GameStart.ogg']);

    range(1, 14).map(n => game.load.audio(`footstep_wood_${n}`, `assets/sound/Footsteps_Casual_LowWood_${('0' + n).slice(-2)}.ogg`));
    range(1, 14).map(n => game.load.audio(`footstep_earth_${n}`, `assets/sound/Footsteps_Casual_Earth_${('0' + n).slice(-2)}.ogg`));
    range(1, 10).map(n => game.load.audio(`footstep_mud_${n}`, `assets/sound/Footsteps_Casual_Mud_${('0' + n).slice(-2)}.ogg`));
}

export function addSounds() {
    Object.assign(sounds, {
        HURT: game.add.audio("hurt"),
        ITEM: game.add.audio("item"),
        HALLUCINATION: game.add.audio("hallucination"),
        PICK: game.sound.add('pick'),
        COOK_SUCCESS: game.sound.add('cook_success'),
        COOK_FAIL: game.sound.add('cook_fail'),
        OPEN_BOOK: game.sound.add('book_open'),
        CLOSE_BOOK: game.sound.add('book_close'),
        PAGE: game.sound.add('book_page'),
        MENU_POSITIVE: game.sound.add('menu_positive'),
        MENU_NEGATIVE: game.sound.add('menu_negative'),
        MENU_MOVE: game.sound.add('menu_move'),
        START_GAME: game.sound.add('start_game')
    })

    sounds.FOOTSTEPS_WOOD = range(1, 14).map(n => game.sound.add(`footstep_wood_${n}`))
    sounds.FOOTSTEPS_EARTH = range(1, 14).map(n => game.sound.add(`footstep_earth_${n}`))
    sounds.FOOTSTEPS_MUD = range(1, 10).map(n => game.sound.add(`footstep_mud_${n}`))

}

export function startMusic(name) {
    if (game.music && game.music.isPlaying) {
        game.music.stop();
    }
    game.music = game.add.audio(name);
    game.music.loop = true;
    game.music.volume = 0.4;
    //game.music.onPlay.add(() => addEffects());
    game.onExit = () => game.music.stop();
    game.music.play();
}

export function addEffects() {
    const context = game.music.context;
    const source = game.music._sound;
    source.disconnect(0);

    const tuna = new Tuna(context);
    const effect = new tuna.Bitcrusher({
        bits: 16,          //1 to 16
        normfreq: 0.8,    //0 to 1
        bufferSize: 1024  //256 to 16384
    });

    source.connect(effect);
    effect.connect(game.music.externalNode || game.music.gainNode);
}