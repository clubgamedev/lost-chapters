import { Tuile } from './Tuile';

export class Labyrinthe {

    callbackCheck;
    tuiles = [];
    // Les chiffres correspondent a l'angle requis pour résoudre l'enigme
    tuilesInitiales = [
        [
            {s: 'A', a: [-180]}, {s: 'D', a: [90, -90]}, {s: 'D', a: [90, -90]},
            {s: 'D', a: [90, -90]}, {s: 'A', a: [-90]}, {s: 'D', a: null},
            {s: 'A', a: [90]}, {s: 'D', a: [90, -90]}, {s: 'D', a: [90, -90]},
            {s: 'A', a: [-90]}, {s: 'A', a: null}
        ],
        [
            {s: 'A', a: [90]}, {s: 'A', a: [-90]}, {s: 'A', a: null},
            {s: 'A', a: [-180]}, {s: 'A', a: [0]}, null,
            {s: 'A', a: null}, null, {s: 'A', a: null},
            {s: 'D', a: [0, -180]}, null
        ],
        [
            {s: 'A', a: null}, {s: 'D', a: [0, -180]}, {s: 'D', a: null},
            {s: 'D', a: [0, -180]}, {s: 'A', a: [-180]}, {s: 'D', a: [90, -90]},
            {s: 'D', a: [90, -90]}, {s: 'D', a: [90, -90]}, {s: 'A', a: [-90]},
            {s: 'A', a: [90]}, {s: 'A', a: [-90]}
        ],
        [
            {s: 'A', a: [-180]}, {s: 'A', a: [0]}, null,
            {s: 'A', a: [90]}, {s: 'A', a: [0]}, {s: 'D', a: null},
            null, {s: 'A', a: null}, {s: 'D', a: [0, -180]},
            {s: 'A', a: null}, {s: 'D' , a: [0, -180]}
        ],
        [
            {s: 'D', a: [0, -180]}, {s: 'D', a: null}, {s: 'A', a: [-180]},
            {s: 'D', a: [90, -90]}, {s: 'D', a: [90, -90]}, {s: 'D', a: [90, -90]},
            {s: 'A', a: [-90]}, {s: 'A', a: null}, {s: 'D', a: [0, -180]},
            {s: 'D', a: null}, {s: 'D' , a: [0, -180]}
        ],
        [
            {s: 'A', a: [90]}, {s: 'D', a: [90, -90]}, {s: 'A', a: [0]},
            null, {s: 'A', a: null}, {s: 'D', a: null},
            {s: 'D', a: [0]}, null, {s: 'A', a: [90]},
            {s: 'D', a: [90, -90]}, {s: 'A' , a: [0]}
        ]
    ];

    constructor(callbackCheck) {
        this.callbackCheck = callbackCheck;
    } 

    create(x, y) {
        this.tuilesInitiales.forEach(line => {
            let xTmp = x;
            line.forEach(tuile => {
                if (tuile) this.tuiles.push(new Tuile(tuile, xTmp, y, () => this.check()));
                xTmp+=3;
            });
            xTmp = x;
            y+=3;
        });
    }

    update() {
        this.tuiles.forEach(tuile => tuile.update());
    }

    check() {
        let isValid = this.tuiles.every(tuile => tuile.isAngleSolutionOk());
        if (isValid) this.callbackCheck();
    }
}