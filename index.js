const sectorNames = require("./sectorNames");
const neo4j = require('neo4j-driver')
const auth = require('./auth')

const driver = neo4j.driver(auth.host, neo4j.auth.basic(auth.user, auth.password))
const session = driver.session()

const numberOfSectors = 256
const maximumSystemsPerSector = 16

/**
 * Pluck n random elements from an array and return whatever is left
 *
 * @param arr
 * @param num
 * @returns {[]}
 */
const pluckRandom = (arr, num = 1) => {
    const res = [];
    for(let i = 0; i < num; ){
        const random = Math.floor(Math.random() * arr.length);
        if(res.indexOf(arr[random]) !== -1){
            continue;
        }
        res.push(arr[random]);
        i++
    }
    return res;
}

module.exports = {
    init: async () => {
        const sectors = pluckRandom(sectorNames, numberOfSectors);
        let creationQuery = '';
        let sectorX = 1;
        let sectorY = 1;
        try {
            sectors.forEach((sector) => {
                // TODO: tidy up the generators, split into methods to make it cleaner
                let systemArray = []

                for (let i = 0; i < Math.floor(Math.random() * maximumSystemsPerSector); i++) {
                    systemArray.push(`${sector.slice(0, 3).toUpperCase()}-${i}`)
                }

                creationQuery += ` CREATE (${sector}:Sector {name: "${sector}", x_pos: ${sectorX}, y_pos: ${sectorY}}) `;
                systemArray.forEach((system) => {
                    creationQuery += ` CREATE (${system.replace('-', '')}:System {name: "${system}"})-[:RESIDES_IN]->(${sector})`
                })

                sectorX++
                if (sectorX > 4) {
                    sectorX = 1
                    sectorY++
                }
            });

            const createSystem = await session.run(
                creationQuery
            )
        } catch(e) {
            console.error(e)
        } finally {
            console.log('closing')
            await session.close()
        }

        // on application exit:
        await driver.close()
    }
}
