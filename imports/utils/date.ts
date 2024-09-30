export const dateToISODateString = (date: Date): string => {
    return date.toISOString().substring(0, 10);
};

export const dateToTimestampStrippedTime = (date: Date): number => {
    return date.getTime() - (date.getTime() % 86400000)
};

export const getDateToday = (): Date => {
    return new Date(Date.now());
}

export const getDateTodayStrippedTime = (): Date => {
    return new Date(dateToTimestampStrippedTime(getDateToday()));
};