/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export function pickRandomIn(array) {
    return array[Math.floor(Math.random() * array.length)]
}

export function range(start, end) {
    function* iter(start, end) {
        let i = start;
        while (i <= end) yield i++;
    }
    return [...iter(start, end)]
}

export function removeInArray(array, elem) {
    array.splice(array.indexOf(elem), 1)
}