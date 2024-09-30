export const dateToISODateString = (date: Date): string => {
    return date.toISOString().substring(0, 10);
};