const sectorNames = require("./sectorNames");
const neo4j = require('neo4j-driver')
const auth = require('./auth')
const { v4: uuidv4 } = require('uuid');

const driver = neo4j.driver(auth.host, neo4j.auth.basic(auth.user, auth.password))
const session = driver.session()

const numberOfSectors = 12
const maximumSystemsPerSector = 16
const maximumInterSystemLinks = 4;

// TODO: method to generate the sector array
// TODO: method to create the sectors
// TODO: method to generate the systems array for each sector
// TODO: method to create the systems in a sector in the DB
// TODO: method to generate the links array for systems in a sector
// TODO: method to attach the link relations between the systems in a sector in the DB

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

                creationQuery += ` CREATE (${sector}:Sector {id: "${uuidv4()}", name: "${sector}", x_pos: ${sectorX}, y_pos: ${sectorY}}) `;
                systemArray.forEach((system) => {
                    creationQuery += ` CREATE (${system.replace('-', '')}:System {id: "${uuidv4()}", name: "${system}"})-[:RESIDES_IN]->(${sector})`
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
    },

    internalSystemLinks: async() => {
        try {
            // TODO: globalise the sector array so it can be thrown around between various functions
            let selectQuery = `MATCH (:Sector {name: "Ugni"})-[r]-() RETURN r`
            const createSystem = await session.run(
                selectQuery
                // TODO: select all systems in a sector, assign to an array to iterate over below
            ).then((res) => {
                console.log(res.records)
                // const linkArray = systemArray.slice(0)
                //
                // // Maximum internal links from a system is predefined unless the total systems is less, then use
                // // that (-1 for the current one because it can't link to itself).
                // for (let l = index; l < Math.floor(Math.random() * (maximumInterSystemLinks < linkArray.length ? maximumInterSystemLinks : (linkArray.length - 1))); l++) {
                //     // Splice out the current system because it can't link to itself.
                //     linkArray.splice(index, 1)
                //
                //     // Assign the link from the array.
                //     const link = linkArray[Math.floor(Math.random() * linkArray.length)]
                //
                //     console.log(` CREATE ("${system}")-[:CONNECTED_TO]->("${link}")`)
                // }
                // // creationQuery += ` CREATE ("${system}")-[:CONNECTED_TO]->()`
            })
        } catch(e) {
            console.error(e)
        } finally {
            console.log('closing')
            await session.close()
        }
    }
}
