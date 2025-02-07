import {
    Airport as RyanairAirport, airportsApi, faresApi, miscellaneousApi,
    PassengerType,
    PriceDetails,
    Session
} from "@findmyflight/external-api-ryanair"

import { Locale, TravelCompanyId } from "../../model/base-types.js";
import { Flight, getFlightDuration } from "../../model/Flight.js";
import { SearchOneWayParams } from "../../model/SearchParams.js";
import { TravelCompanyIntegration } from "../TravelCompanyIntegration.js";
import { Airport } from "../../model/Airport.js";
import { LogUtils } from '@findmyflight/utils'

const MAX_QUERYABLE_DATES = 7

const logger = LogUtils.getLogger({
    integration: 'Ryanair'
})

type PassengersCount = { [key in PassengerType]?: number }

export default class RyanairIntegration implements TravelCompanyIntegration {
    id: TravelCompanyId = 'ryanair'
    label: string = 'Ryanair'

    session: Session
    airports: RyanairAirport[]
    locale: Locale

    async initialize(): Promise<RyanairIntegration> {
        this.locale = { languageCode: 'en', BCP47LangCode: 'en-US' }
        this.session = await miscellaneousApi.createSession()
        this.airports = await airportsApi.listAirports(this.locale.languageCode)

        return this
    }

    public async searchOneWayFlights(params: SearchOneWayParams): Promise<Flight[]> {
        const passengersCount = this.mapAgesToPassengers(params.passengersAge)
        const flights: Flight[] = []

        for (let originCode of params.originCodes) {
            const origin = this.airports.filter(a => a.code === originCode).at(0)
            const destinationAirportCodes = (await airportsApi.listDestinationAirports(
                originCode,
                this.locale.languageCode
            )).map(a => a.code)

            const availableDestinationCodes = params.destinationCodes
                .filter(dCode => destinationAirportCodes.includes(dCode))

            for (let destinationCode of availableDestinationCodes) {
                const destination = this.airports.filter(a => a.code === destinationCode).at(0)

                for (let dateGroup of this.getAdjacentDateGroups(params.departureDates)) {
                    const newFlights = await faresApi.listAvailableOneWayFlights({
                        adults: passengersCount[PassengerType.ADULT],
                        teenagers: passengersCount[PassengerType.TEENAGER],
                        children: passengersCount[PassengerType.CHILD],
                        infants: passengersCount[PassengerType.INFANT],
                        roundTrip: false,
                        dateOut: dateGroup[0],
                        flexDaysBeforeOut: 0,
                        flexDaysOut: dateGroup[1] - 1,
                        originCode: originCode,
                        destinationCode: destinationCode,
                        includeConnectingFlights: true,
                        promoCode: ''
                    }, this.session)

                    flights.push(...this.filterFlights(Array.from(newFlights.values()).flatMap(fs => fs)
                        .map(f => ({
                            flightNumber: f.flightNumber,
                            origin: {
                                code: origin.code,
                                name: origin.name
                            },
                            destination: {
                                code: destination.code,
                                name: destination.name
                            },
                            departureDate: f.departureDate,
                            arrivalDate: f.arrivalDate,
                            price: this.computeTotalPrice(passengersCount, f.priceDetails),
                            travelCompany: this.id
                        })), params)
                    )
                }
            }
        }

        return flights.flatMap(f => f)
    }

    public async listAirports(): Promise<Airport[]> {
        return Promise.resolve(this.airports.map(a => RyanairTypeMapping.toAirport(a)))
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


    /**
     * filter out flights whose departure date is not included in the accepted one and those ones
     * that have a duration too high
     * @param flights 
     * @param params 
     * @returns the acceptable flights
     */
    private filterFlights(flights: Flight[], params: SearchOneWayParams): Flight[] {
        return flights.filter(flight =>
            getFlightDuration(flight) <= ((params.maxFlightHours ?? (Number.MAX_SAFE_INTEGER / 60)) * 60) &&
            params.departureTimeInterval.isIncluded(flight.departureDate.getHours())
        )
    }


    /**
     * count the number of each passenger type starting from the age of each passenger
     * @param ages 
     * @returns 
     */
    private mapAgesToPassengers(ages: number[]): PassengersCount {
        const adults = ages.filter(age => age >= 16).length
        const children = ages.filter(age => age >= 2 && age <= 11).length
        const teenagers = ages.filter(age => age >= 12 && age <= 15).length
        const infants = ages.filter(age => age < 2).length

        return {
            [PassengerType.ADULT]: adults,
            [PassengerType.TEENAGER]: teenagers,
            [PassengerType.CHILD]: children,
            [PassengerType.INFANT]: infants
        }
    }


    /**
     * compute the total price of the flight: it includes the price of each passenger
     * @param passengersCount the count of each passenger type
     * @param priceDetails the price of the flight ticket for each passenger type (or 0 if not present)
     * @returns the total price
     */
    private computeTotalPrice(passengersCount: PassengersCount, priceDetails: PriceDetails): number {
        let totalPrice = 0

        for (let passengerType in passengersCount) {
            totalPrice += (priceDetails[passengerType] ?? 0) * (passengersCount[passengerType] ?? 0)
        }

        return totalPrice
    }
}

export class RyanairTypeMapping {
    public static toAirport(airport: RyanairAirport): Airport {
        return {
            code: airport.code,
            name: airport.name
        }
    }
}