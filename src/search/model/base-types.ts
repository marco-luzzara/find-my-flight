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

export type Locale = {
    languageCode: string
    LCID: string
}

export type ResultsSort = {
    by: SortBy,
    order: SortOrder
}

export enum SortOrder {
    ASCENDING,
    DESCENDING
}

export enum SortBy {
    PRICE,
    START_DATE,
    END_DATE
}