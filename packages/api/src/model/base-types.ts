import { InvalidInputError } from "@findmyflight/utils"

export type TravelCompanyId = string

export class HourInterval {
    start: number
    end: number

    constructor(start: number, end: number) {
        if (start > end)
            throw new InvalidInputError(`start <= ${end}`, start)

        if (start < 0)
            throw new InvalidInputError('start >= 0', start)

        if (end > 24)
            throw new InvalidInputError('end <= 24', end)

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
            throw new InvalidInputError(`start <= ${end}`, start)

        if (start < 0)
            throw new InvalidInputError(`start >= 0`, start)

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