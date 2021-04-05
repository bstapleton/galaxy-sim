const convertToRoman = require('../utils/convertToRoman')

module.exports = {
    generateMoons: async (number, planetName) => {
        let moons = []
        // TODO: work out the moon type and apply it
        for (let i = 1; i <= number; i++) {
            moons.push({
                name: `${planetName} ${convertToRoman(i)}`,
                resource: null // TODO: one or null
            })
        }

        return moons
    }
}
