export class IntegerInterval {
    start: number
    end: number

    constructor(start: number, end: number) {
        this.start = start
        this.end = end
    }

    public isIncluded(hour: number): boolean {
        return hour >= this.start && hour <= this.end
    }
}

export enum SortDirection {
    ASCENDING,
    DESCENDING
}

export enum SortBy {
    PRICE,
    START_DATE,
    END_DATE
}