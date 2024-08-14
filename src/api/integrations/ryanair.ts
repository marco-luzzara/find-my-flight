import { listAirports, listDestinationAirports } from "../../external-apis/ryanair-api/apis/airports";
import { listAvailableOneWayFlights } from "../../external-apis/ryanair-api/apis/fares";
import { createSession } from "../../external-apis/ryanair-api/apis/miscellaneous";
import { Airport } from "../../external-apis/ryanair-api/model/Airport";
import { PassengerType, PriceDetails, Session } from "../../external-apis/ryanair-api/model/base-types";
import { FlightSchedule } from "../../external-apis/ryanair-api/model/Flight";
import { Locale } from "../model/base-types";
import { Flight, getFlightDuration } from "../model/Flight";
import { SearchOneWayParams } from "../model/SearchParams";
import { TravelCompany } from "../model/TravelCompany";
import { TravelCompanyIntegration } from "./TravelCompanyIntegration";

const MAX_QUERYABLE_DATES = 7

type PassengersCount = { [key in PassengerType]?: number }

export class RyanairIntegration implements TravelCompanyIntegration {
    readonly session: Session
    readonly airports: Airport[]
    readonly locale: Locale

    protected constructor(locale: Locale, session: Session, airports: Airport[]) {
        this.locale = locale
        this.session = session
        this.airports = airports
    }

    static async create(locale: Locale = { languageCode: 'en', BCP47LangCode: 'en-US' }): Promise<RyanairIntegration> {
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
                    const newFlights = await listAvailableOneWayFlights({
                        adults: passengersCount[PassengerType.ADULT],
                        teenagers: passengersCount[PassengerType.TEENAGER],
                        children: passengersCount[PassengerType.CHILD],
                        infants: passengersCount[PassengerType.INFANT],
                        roundTrip: false,
                        dateOut: dateGroup[0],
                        flexDaysBeforeOut: 0,
                        flexDaysOut: dateGroup[1] - 1,
                        origin: this.airports.filter(a => a.code === origin.code).at(0),
                        destination: this.airports.filter(a => a.code === destination.code).at(0),
                        includeConnectingFlights: true,
                        promoCode: ''
                    }, this.session)

                    flights.push(...this.filterFlights(Array.from(newFlights.values()).flatMap(fs => fs)
                        .map(f => ({
                            flightNumber: f.flightNumber,
                            origin,
                            destination,
                            departureDate: f.departureDate,
                            arrivalDate: f.arrivalDate,
                            price: this.computeTotalPrice(passengersCount, f.priceDetails),
                            travelCompany: TravelCompany.Ryanair
                        })), params)
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


    /**
     * filter out flights whose departure date is not included in the accepted one and those ones
     * that have a duration too high
     * @param flights 
     * @param params 
     * @returns the acceptable flights
     */
    private filterFlights(flights: Flight[], params: SearchOneWayParams): Flight[] {
        return flights.filter(flight =>
            getFlightDuration(flight) < (params.maxFlightDuration ?? Number.MAX_SAFE_INTEGER) &&
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