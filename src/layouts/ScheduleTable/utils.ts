const isToday = (date: any) => {
    const today = new Date();
    const comparedDate = new Date(date);

    if (
        today.getFullYear() === comparedDate.getFullYear() &&
        today.getMonth() === comparedDate.getMonth() &&
        today.getDate() === comparedDate.getDate()
    ) {
        return true;
    }

    return false;
}

const convertPeriodToTimestamp: any = (period: number) => {
    switch (period) {
        case 1:
            return [7 * 3600, 7 * 3600 + 45 * 60]
            break;
        case 2:
            return [7 * 3600 + 45 * 60, 8 * 3600 + 30 * 60]
            break;
        case 3:
            return [8 * 3600 + 30 * 60, 9 * 3600 + 15 * 60]
            break;
        case 4:
            return [9 * 3600 + 15 * 60, 10 * 3600]
            break;
        case 5:
            return [10 * 3600, 10 * 3600 + 45 * 60]
            break;
        case 6:
            return [10 * 3600 + 45 * 60, 11 * 3600 + 30 * 60]
            break;
        case 7:
            return [12 * 3600 + 30 * 60, 13 * 3600 + 15 * 60]
            break;
        case 8:
            return [13 * 3600 + 15 * 60, 14 * 3600]
            break;
        case 9:
            return [14 * 3600, 14 * 3600 + 45 * 60]
            break;
        case 10:
            return [14 * 3600 + 45 * 60, 15 * 3600 + 30 * 60]
            break;
        case 11:
            return [15 * 3600 + 30 * 60, 16 * 3600 + 15 * 60]
            break;
        case 12:
            return [16 * 3600 + 15 * 60, 17 * 3600]
            break;
        default:
            return [7 * 3600, 7 * 3600 + 45 * 60]
            break;
    }
}

const convertPeriodToHourAndMin: any = (period: number) => {
    switch (period) {
        case 1:
            return [[7, 0], [7, 45]]
            break;
        case 2:
            return [[7, 45], [8, 30]]
            break;
        case 3:
            return [[8, 30], [9, 15]]
            break;
        case 4:
            return [[9, 15], [10, 0]]
            break;
        case 5:
            return [[10, 0], [10, 45]]
            break;
        case 6:
            return [[10, 45], [11, 30]]
            break;
        case 7:
            return [[12, 30], [13, 15]]
            break;
        case 8:
            return [[13, 15], [14, 0]]
            break;
        case 9:
            return [[14, 0], [14, 45]]
            break;
        case 10:
            return [[14, 45], [15, 30]]
            break;
        case 11:
            return [[15, 30], [16, 15]]
            break;
        case 12:
            return [[16, 0], [15, 17]]
            break;
        default:
            return [[7, 0], [7, 45]]
            break;
    }
}

export const sessionData = [
    {
        text: 'Sáng',
        id: 1,
        color: '#E5EAF2',
    }, {
        text: 'Chiều',
        id: 2,
        color: '#E5EAF2',
    }, {
        text: 'Tối',
        id: 3,
        color: '#E5EAF2',
    },
];

export { isToday, convertPeriodToTimestamp, convertPeriodToHourAndMin };