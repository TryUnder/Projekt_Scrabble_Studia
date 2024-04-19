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

export const initializeLetterMap = () => {
    const myLetterMap = new Map(Object.entries({
        'Blank': { count: 2, points: 0 },

        'A': { count: 9, points: 1 },
        'E': { count: 7, points: 1 },
        'I': { count: 8, points: 1 },
        'N': { count: 5, points: 1 },
        'O': { count: 6, points: 1 },
        'R': { count: 4, points: 1 },
        'S': { count: 4, points: 1 },
        'W': { count: 4, points: 1 },
        'Z': { count: 5, points: 1 },

        'C': { count: 3, points: 2 },
        'D': { count: 3, points: 2 },
        'K': { count: 3, points: 2 },
        'L': { count: 3, points: 2 },
        'M': { count: 3, points: 2 },
        'P': { count: 3, points: 2 },
        'T': { count: 3, points: 2 },
        'Y': { count: 4, points: 2 },

        'B': { count: 2, points: 3 },
        'G': { count: 2, points: 3 },
        'H': { count: 2, points: 3 },
        'J': { count: 2, points: 3 },
        'Ł': { count: 2, points: 3 },
        'U': { count: 2, points: 3 },

        'Ą': { count: 1, points: 5 },
        'Ę': { count: 1, points: 5 },
        'F': { count: 1, points: 5 },
        'Ó': { count: 1, points: 5 },
        'Ś': { count: 1, points: 5 },
        'Ż': { count: 1, points: 5 },

        'Ć': { count: 1, points: 6 },
        'Ń': { count: 1, points: 7 },
        'Ź': { count: 1, points: 9 },
    }));

    return myLetterMap;
}

export const initializeBoardData = () => {
    const boardLayout = [
        ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW'],
        ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', ''],
        ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
        ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL'],
        ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', ''],
        ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
        ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', ''],
        ['TW', '', '', 'DL', '', '', '', 'DW', '', '', '', 'DL', '', '', 'TW'],
        ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', ''],
        ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
        ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', ''],
        ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL'],
        ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
        ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', ''],
        ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW']
    ];

    return boardLayout.map((row, y) => {
        return row.map((tile, x) => {
            let classType = 'normal-tile';
            classType = getTileClass(tile)

            return { x, y, tile, classType, letter: { value: '', points: 0 }, player: null };
        });
    });
}