/**
 * Takes an integer value and converts to ROman numerals.
 * Shamelessly stolen from https://stackoverflow.com/a/41358305
 *
 * @param num
 * @returns {string}
 */
const convertToRoman = (num) => {
    let roman = {
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };

    let str = '';

    for (let i of Object.keys(roman)) {
        let q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }

    return str;
}

module.exports = convertToRoman
