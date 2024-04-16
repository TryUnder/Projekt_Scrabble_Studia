export const getTileClass = (type) => {
    switch (type) {
        case 'TW':
            return 'triple-word-score-tile'
            break;
        case 'DW':
            return 'double-word-score-tile'
            break;
        case 'TL':
            return 'triple-letter-score-tile'
            break;
        case 'DL':
            return 'double-letter-score-tile'
            break;
        default:
            return 'normal-tile'
            break;
    }
}

export const getPolishTileClass = (word_conv) => {
    switch (word_conv) {
        case 'TW':
            return 'POTRÓJNA PREMIA SŁOWNA'
        case 'DW':
            return 'PODWÓJNA PREMIA SŁOWNA'
        case 'TL':
            return 'POTRÓJNA PREMIA LITEROWA'
        case 'DL':
            return 'PODWÓJNA PREMIA LITEROWA'
    }
}