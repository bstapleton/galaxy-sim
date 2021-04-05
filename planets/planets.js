const planetCompositions = require('./planetCompositions')
const moons = require('../moons/moons')

const maximumNumberOfMoons = 60

/**
 * Fudge a normalised distribution of satellites. Fewer planets should have
 * lots of moons, basically, but it should still be possible.
 *
 * @returns {number}
 */
const randomiseNumberOfMoons = () => {
    // Get a random percentage
    let moonProbability = Math.floor(Math.random() * 100)

    // TODO: factor in the planet type to determine probability of number of moons

    if (moonProbability < 3) {
        // 3% chance of between 50 and 60 moons
        return Math.floor(Math.random() * (maximumNumberOfMoons - 50) + 50)
    } else if (moonProbability < 10) {
        // 10 - 3 = 7% chance of between 30 and 49 moons
        return Math.floor(Math.random() * (49 - 30) + 30)
    } else if (moonProbability < 35) {
        // 35 - 10 = 25% chance of between 8 and 29 moons
        return Math.floor(Math.random() * (29 - 8) + 8)
    } else if (moonProbability < 80) {
        // 80 - 35 = 45% chance of between 1 and 7 moons
        return Math.floor(Math.random() * (7 - 1) + 1)
    }

    // 100 - 20 = 20% chance of no moons at all
    return 0
}

const generateResources = (composition) => {
    let resources = []
    if (composition === 'Iron planet') {
        // Iron planets have a minimum density of 50% common metals, but nothing else
        resources.push({
            name: 'Common metals',
            density: (Math.random() * (100 - 50) + 50).toFixed(2)
        })

        return resources
    } else if (['Carbon planet', 'Helium planet'].includes(composition)) {
        // Carbon planets have a minimum density of 70% carbon, and trace levels of other elements
        resources.push({
            name: 'Common gasses',
            density: 50
        })
    } else if (['Ice giant', 'Ice planet', 'Ocean planet'].includes(composition)) {
        // Ice and ocean have 100% water, but nothing else
        resources.push({
            name: 'Water',
            density: 100
        })

        return resources
    }
}

module.exports = {
    generatePlanets: async (number, systemName) => {
        let planets = []
        for (let i = 1; i <= number; i++) {
            // Standard naming for planetary bodies using lowercase English
            // alphabet symbols.
            let planetName = `${systemName} ${String.fromCharCode(97+i)}`

            // Randomise the number of moons we want, then generate the array
            let moonArray = await moons.generateMoons(randomiseNumberOfMoons(), planetName)

            // Generate the planet
            let planet = {
                composition: planetCompositions[Math.floor(Math.random() * planetCompositions.length)],
                name: planetName,
                moons: moonArray.map(m => m.name),
                resources: null // TODO: an array of 0-3 resources on the planet
            }

            planets.push(planet)
        }

        console.log(planets)
        return planets
    }
}
