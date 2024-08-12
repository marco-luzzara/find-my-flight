import { ValidationError } from "../../ryanair-api/errors"

export class HourInterval {
    start: number
    end: number

    constructor(start: number, end: number) {
        if (start > end)
            throw new ValidationError('start', start, `start >= ${end}`)

        if (start < 0)
            throw new ValidationError('start', start, `start >= 0`)

        if (end > 23)
            throw new ValidationError('end', start, `end <= 23`)

        this.start = start
        this.end = end
    }

    public isIncluded(hour: number): boolean {
        return isIntegerIncluded(hour, this.start, this.end)
    }
}

export class DayInterval {
    start: number
    end: number

    constructor(start: number, end: number) {
        if (start > end)
            throw new ValidationError('start', start, `start >= ${end}`)

        if (start < 0)
            throw new ValidationError('start', start, `start >= 0`)

        this.start = start
        this.end = end
    }

    public isIncluded(day: number): boolean {
        return isIntegerIncluded(day, this.start, this.end)
    }
}

function isIntegerIncluded(elem: number, min: number, max: number): boolean {
    return elem >= min && elem <= max
}

export type Locale = {
    languageCode: string
    BCP47LangCode: string
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