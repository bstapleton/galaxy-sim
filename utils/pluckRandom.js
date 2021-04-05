/**
 * Pluck n random elements from an array and return whatever is left
 *
 * @param arr
 * @param num
 * @returns {[]}
 */
const pluckRandom = (arr, num = 1) => {
    const res = []
    for(let i = 0; i < num; ) {
        const random = Math.floor(Math.random() * arr.length)
        if(res.indexOf(arr[random]) !== -1) {
            continue
        }
        res.push(arr[random])
        i++
    }
    return res;
}

module.exports = pluckRandom
