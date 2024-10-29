import { differenceInMinutes, format } from "date-fns";

export default class DateUtils {
    /**
     * returns the difference between 2 date in the format hh:mm
     * @param d1 
     * @param d2 
     * @returns 
     */
    public static getDurationFromDates(d1: Date, d2: Date): string {
        const totalMinutes = differenceInMinutes(d2, d1);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    public static formatFlightDateTime(d: Date): string {
        return format(d, 'yyyy/MM/dd - hh:mm')
    }

    public static formatDateAsISO(d: Date): string {
        return format(d, 'yyyy-MM-dd')
    }
}