
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

    game.load.audio("item", ["assets/sound/collect_item_02.wav", "assets/sound/item.mp3"]);
    game.load.audio("hallucination", ["assets/sound/hallucination.wav"]);
    game.load.audio("death", ["assets/sound/death.wav"]);

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
    game.load.audio("game_over", ['assets/sound/GameOver.mp3']);
    game.load.audio("game_win", ['assets/sound/GameWin.mp3']);

    range(1, 14).map(n => game.load.audio(`footstep_wood_${n}`, `assets/sound/Footsteps_Casual_LowWood_${('0' + n).slice(-2)}.ogg`));
    range(1, 14).map(n => game.load.audio(`footstep_earth_${n}`, `assets/sound/Footsteps_Casual_Earth_${('0' + n).slice(-2)}.ogg`));
    range(1, 10).map(n => game.load.audio(`footstep_mud_${n}`, `assets/sound/Footsteps_Casual_Mud_${('0' + n).slice(-2)}.ogg`));
    range(1, 2).map(n => game.load.audio(`hurt${n}`, `assets/sound/hurt${n}.wav`));
    range(1, 4).map(n => game.load.audio(`drink_potion_${n}`, `assets/sound/PotionUse${n}.mp3`));
    range(1, 3).map(n => game.load.audio(`madness${n}`, `assets/sound/Madness${n}.mp3`));

    // alchemy
    game.load.audio("element_found", "assets/decryptor/sound/collect_item_hurry_out_of_time_01.wav")

    game.load.audio("element_found_1", "assets/decryptor/sound/FA_Scale_6.wav")
    game.load.audio("element_found_2", "assets/decryptor/sound/FA_Scale_7.wav")
    game.load.audio("element_found_3", "assets/decryptor/sound/FA_Scale_8.wav")
    game.load.audio("element_found_4", "assets/decryptor/sound/FA_Scale_9.wav")
    game.load.audio("element_found_5", "assets/decryptor/sound/FA_Scale_10.wav")
    game.load.audio("element_found_6", "assets/decryptor/sound/FA_Scale_11.wav")
    game.load.audio("element_found_7", "assets/decryptor/sound/FA_Scale_12.wav")
    game.load.audio("element_found_8", "assets/decryptor/sound/FA_Scale_13.wav")
    game.load.audio("element_found_end", "assets/decryptor/sound/FA_Scale_End.wav")

    game.load.audio("element_error", "assets/decryptor/sound/voice_male_b_effort_quick_action_05.wav")
}

export function addSounds() {
    Object.assign(sounds, {
        HURT: game.add.audio("hurt"),
        ITEM: game.add.audio("item"),
        HALLUCINATION: game.add.audio("hallucination"),
        PICK: game.sound.add('pick'),
        DEATH: game.sound.add('death'),
        COOK_SUCCESS: game.sound.add('cook_success'),
        COOK_FAIL: game.sound.add('cook_fail'),
        OPEN_BOOK: game.sound.add('book_open'),
        CLOSE_BOOK: game.sound.add('book_close'),
        PAGE: game.sound.add('book_page'),
        MENU_POSITIVE: game.sound.add('menu_positive'),
        MENU_NEGATIVE: game.sound.add('menu_negative'),
        MENU_MOVE: game.sound.add('menu_move'),
        START_GAME: game.sound.add('start_game'),
        GAME_OVER: game.sound.add('game_over'),
        GAME_WIN: game.add.audio('game_win'),
        DRINK_POTION_FORCE: game.add.audio('drink_potion_4'),
        DRINK_POTION_PROTECTION: game.add.audio('drink_potion_2'),
        DRINK_POTION_LUCIDITE: game.add.audio('drink_potion_1'),
        DRINK_POTION_LIAO: game.add.audio('drink_potion_3'),
    })

    sounds.FOOTSTEPS_WOOD = range(1, 14).map(n => game.sound.add(`footstep_wood_${n}`))
    sounds.FOOTSTEPS_EARTH = range(1, 14).map(n => game.sound.add(`footstep_earth_${n}`))
    sounds.FOOTSTEPS_MUD = range(1, 10).map(n => game.sound.add(`footstep_mud_${n}`))
    sounds.HURT = range(1, 2).map(n => game.sound.add(`hurt${n}`))
    sounds.MAKE_POTION = range(1, 2).map(n => game.sound.add(`make_potion_${n}`))
    sounds.MADNESS = range(1, 3).map(n => game.sound.add(`madness${n}`));

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