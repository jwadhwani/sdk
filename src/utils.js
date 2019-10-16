// @flow
import lineString from 'turf-linestring'
import point from 'turf-point'
import bbox from '@turf/bbox'
import destination from '@turf/destination'
import PromiseThrottle from 'promise-throttle'
import type { Feature } from '../flow-types/Feature'
import type { Location } from '../flow-types/Location'
import type { Coordinates } from '../flow-types/Coordinates'
import { MAX_CALLS_PER_SECOND, MAX_CALLS_PER_MINUTE, MAX_CALLS_PER_HOUR } from './constants/rateLimits'

export function convertFeatureToLocation(feature: Feature): Location {
    const { properties, geometry } = feature

    return {
        name: properties.name,
        place: properties.id,
        coordinates: {
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0],
        },
    }
}

export function convertPositionToBbox(coordinates: Coordinates, distance: number) {
    const { latitude, longitude } = coordinates
    const distanceToKilometer = distance / 1000

    const position = point([longitude, latitude])

    const east = destination(position, distanceToKilometer, 0)
    const north = destination(position, distanceToKilometer, 90)
    const west = destination(position, distanceToKilometer, 180)
    const south = destination(position, distanceToKilometer, -90)

    const line = lineString([
        east.geometry.coordinates,
        north.geometry.coordinates,
        west.geometry.coordinates,
        south.geometry.coordinates,
    ])

    const [minLng, minLat, maxLng, maxLat] = bbox(line)

    return {
        minLng, minLat, maxLng, maxLat,
    }
}

export const throttler = (func: Function, args: Array<any>): Promise<any> => {
    const argCount = args.length

    let requestsPerSecond
    if (argCount <= MAX_CALLS_PER_MINUTE) {
        requestsPerSecond = MAX_CALLS_PER_SECOND
    } else if (argCount <= MAX_CALLS_PER_HOUR) {
        requestsPerSecond = Math.floor(MAX_CALLS_PER_MINUTE / 60)
    } else {
        requestsPerSecond = Math.floor(MAX_CALLS_PER_HOUR / 3600)
    }

    const promiseThrottle = new PromiseThrottle({ requestsPerSecond })
    return Promise.all(args.map(a => promiseThrottle.add(func.bind(this, a))))
}

export function isValidDate(d: any): boolean {
    return Object.prototype.toString.call(d) === '[object Date]' && !Number.isNaN(d.getTime())
}

export function uniqBy<T>(arr: Array<T>, predicate: (T) => any): Array<T> {
    return [...arr.reduce((map, item) => {
        const key = predicate(item)

        if (!map.has(key)) {
            map.set(key, item)
        }

        return map
    }, new Map()).values()]
}

export function forceOrder<T>(
    list: Array<T>,
    sequence: Array<any>,
    predicate?: (T) => any = item => item,
): Array<T | void> {
    let queue = [...list]
    const result = []

    sequence.forEach((sequenceIdentifier) => {
        const item = queue.find(t => predicate(t) === sequenceIdentifier)
        if (item) {
            result.push(item)
            queue = queue.filter(q => q !== item)
        } else {
            result.push(undefined)
        }
    })
    return result
}
