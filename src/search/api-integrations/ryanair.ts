import { listAirports, listDestinationAirports } from "../../ryanair-api/apis/airports";
import { listAvailableFlights } from "../../ryanair-api/apis/fares";
import { createSession } from "../../ryanair-api/apis/miscellaneous";
import { Airport } from "../../ryanair-api/model/Airport";
import { Session } from "../../ryanair-api/model/base-types";
import { FlightSchedule } from "../../ryanair-api/model/Flight";
import { Locale } from "../model/base-types";
import { Flight } from "../model/Flight";
import { SearchOneWayParams } from "../model/SearchParams";
import { TravelCompanyIntegration } from "./TravelCompanyIntegration";

const MAX_QUERYABLE_DATES = 7

type PassengersCount = {
    adults: number;
    children: number;
    teenagers: number;
    infants: number;
}

export class RyanairIntegration implements TravelCompanyIntegration {
    readonly session: Session
    readonly airports: Airport[]
    readonly locale: Locale

    protected constructor(locale: Locale, session: Session, airports: Airport[]) {
        this.locale = locale
        this.session = session
        this.airports = airports
    }

    static async create(locale: Locale): Promise<RyanairIntegration> {
        const session = await createSession()
        const airports = await listAirports(locale.languageCode)

        return new RyanairIntegration(locale, session, airports)
    }

    public async getOneWayFlights(params: SearchOneWayParams): Promise<Flight[]> {
        const passengersCount = this.mapAgesToPassengers(params.passengersAge)
        const flights: Flight[] = []

        for (let origin of params.origins) {
            const destinationAirportCodes = (await listDestinationAirports(
                this.airports.filter(a => a.code === origin.code).at(0),
                this.locale.languageCode
            )).map(a => a.code)

            const availableDestinations = params.destinations
                .filter(d => destinationAirportCodes.includes(d.code))

            for (let destination of availableDestinations) {
                for (let dateGroup of this.getAdjacentDateGroups(params.departureDates)) {
                    const newFlights = await listAvailableFlights({
                        ...passengersCount,
                        roundTrip: false,
                        dateOut: dateGroup[0],
                        flexDaysBeforeOut: 0,
                        flexDaysOut: dateGroup[1] - 1,
                        origin: this.airports.filter(a => a.code === origin.code).at(0),
                        destination: this.airports.filter(a => a.code === destination.code).at(0),
                        includeConnectingFlights: true,
                        promoCode: ''
                    }, this.session)

                    flights.push(...Array.from(newFlights.values()).flatMap(fs => fs)
                        .map(f => ({
                            flightNumber: f.flightNumber,
                            origin,
                            destination,
                            departureDate: f.departureDate,
                            arrivalDate: f.arrivalDate,
                            price: 0
                        }))
                    )
                }
            }
        }

        return flights.flatMap(f => f)
    }

    /**
     * identify the groups of adjacent dates to minimize the number of API requests. Once the 
     * group size reaches `MAX_QUERYABLE_DATES`, then a new group is automatically created. This is a
     * limit of ryanair Api `listAvailableFlights`
     * @param dates the available dates
     * @returns an array of tuple where the first is the first date of the group and the second
     * element is the number of dates in the group
     */
    private getAdjacentDateGroups(dates: Date[]): [Date, number][] {
        if (dates.length === 0)
            return []
        const groups = []

        const dayInMillis = 60 * 60 * 24 * 1000

        let curDate = dates[0]
        let groupLastDate = curDate
        groups.push([groupLastDate, 1])
        let curDateIndex = 1

        while (curDateIndex < dates.length) {
            curDate = dates[curDateIndex]

            if (
                curDate.valueOf() - dayInMillis === groupLastDate.valueOf() &&
                groups[groups.length - 1][1] <= MAX_QUERYABLE_DATES
            ) {
                groups[groups.length - 1][1]++
            }
            else {
                groups.push([curDate, 1])
            }

            groupLastDate = curDate
            curDateIndex++
        }

        return groups
    }

    private mapAgesToPassengers(ages: number[]): PassengersCount {
        const adults = ages.filter(age => age >= 16).length
        const children = ages.filter(age => age >= 2 && age <= 11).length
        const teenagers = ages.filter(age => age >= 12 && age <= 15).length
        const infants = ages.filter(age => age < 2).length

        return {
            adults, children, teenagers, infants
        }
    }
}