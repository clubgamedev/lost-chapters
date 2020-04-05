import { Tuile } from './Tuile';

export class Labyrinthe {

    tuiles = [];
    // a = angle ; d = droite
    typeTuiles = [
        'aaadaa',
        'aadaad',
        'daadda',
        'addaaa'
    ]

    create(x, y) {
        this.tuiles = this.typeTuiles
            .map((line, y) => line.split('').map((shape, x) => {
                return new Tuile({ shape, x, y, onTurn: () => this.checkSolution() })
            }))
    }

    update() {
        this.tuiles.forEach(line => line.forEach(tuile => tuile.update()));
    }

    checkSolution() {
        const tuileDepart = { x: 3, y: -1, type: 'd0', signalFrom: "top" }; // début du labyrinthe
        const nbLignes = this.tuiles.length;
        const nbColonnes = this.tuiles[0].length;
        let count = 0;
        let tuile = tuileDepart;
        this.tuiles.forEach(line => line.forEach(tuile => { tuile.connected = false }))

        do {
            tuile = this.nextTuile(tuile);
            if (tuile && tuile !== "end") {
                tuile.connected = true;
            }
            count++;
        } while (tuile !== null && tuile !== "end" && count < nbLignes * nbColonnes)

        if (tuile === "end") this.onResolve(); // defined in parent
    }

    nextTuile({ x, y, type, signalFrom }) {
        let next = null;
        let nbLignes = this.tuiles.length;
        let nbColonnes = this.tuiles[0].length;
        let tuileFin = { x: 3, y: nbLignes }
        // a0 ┘ ; a1 └ ; a2 ┌ ; a3 ┐ ; d0 │ ; d1 ─
        switch (signalFrom) {
            case 'top':
                switch (type) {
                    case 'a0': next = { y, x: x - 1, from: "right" }; break;
                    case 'a1': next = { y, x: x + 1, from: "left" }; break;
                    case 'a2': next = null; break;
                    case 'a3': next = null; break;
                    case 'd0': next = { y: y + 1, x, from: "top" }; break;
                    case 'd1': next = null; break;
                }
                break;
            case 'bottom':
                switch (type) {
                    case 'a0': next = null; break;
                    case 'a1': next = null; break;
                    case 'a2': next = { y, x: x + 1, from: "left" }; break;
                    case 'a3': next = { y, x: x - 1, from: "right" }; break;
                    case 'd0': next = { y: y - 1, x, from: "bottom" }; break;
                    case 'd1': next = null; break;
                }
                break;
            case 'left':
                switch (type) {
                    case 'a0': next = { y: y - 1, x, from: "bottom" }; break;
                    case 'a1': next = null; break;
                    case 'a2': next = null; break;
                    case 'a3': next = { y: y + 1, x, from: "top" }; break;
                    case 'd0': next = null; break;
                    case 'd1': next = { y, x: x + 1, from: "left" }; break;
                }
                break;
            case 'right':
                switch (type) {
                    case 'a0': next = null; break;
                    case 'a1': next = { y: y - 1, x, from: "bottom" }; break;
                    case 'a2': next = { y: y + 1, x, from: "top" }; break;
                    case 'a3': next = null; break;
                    case 'd0': next = null; break;
                    case 'd1': next = { y, x: x - 1, from: "right" }; break;
                }
                break;
        }
        if (next === null) return null;
        if (next.x === tuileFin.x && next.y === tuileFin.y) return "end"
        if (next.x < 0 || next.x >= nbColonnes || next.y < 0 || next.y >= nbLignes) return null;

        let nextTuile = this.tuiles[next.y][next.x];
        nextTuile.signalFrom = next.from

        let isNextTuileConnected = false;
        switch (nextTuile.signalFrom) {
            case 'top': isNextTuileConnected = ['a0', 'a1', 'd0'].includes(nextTuile.type); break;
            case 'bottom': isNextTuileConnected = ['a2', 'a3', 'd0'].includes(nextTuile.type); break;
            case 'left': isNextTuileConnected = ['a0', 'a3', 'd1'].includes(nextTuile.type); break;
            case 'right': isNextTuileConnected = ['a1', 'a2', 'd1'].includes(nextTuile.type); break;
        }

        if (!isNextTuileConnected) return null;
        else return nextTuile;
    }
}