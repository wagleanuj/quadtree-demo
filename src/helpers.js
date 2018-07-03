/**
 * Generates a random number in the given range (Inclusive).
 *
 * @param {Number} min
 * @param {Number} max
 *
 * @return {Number}
 */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates a random Hex. Returned as a Decimal.
 *
 * @return {Number}
 */
const randHex = () => Math.floor(Math.random() * 16777215);

/**
 * Returns whether the given Child is inside of the given Container.
 *
 * @param {Object} container
 * @param {Object} child
 *
 * @return {Boolean}
 */
const rectInside = (container, child) => {
    return child.x >= container.x &&
        child.x + child.width <= container.x + container.width &&
        child.y >= container.y &&
        child.y + child.height <= container.y + container.height;
};

/**
 * Returns whether the two given boxes intersect using a Rectangle
 * Intersection algorithm.
 *
 * @param {Object} box1
 * @param {Object} box2
 *
 * @return {Boolean}
 */
const rectIntersects = (box1, box2) => {
    return box1.x <= box2.x + box2.width &&
        box2.x <= box1.x + box1.width &&
        box1.y <= box2.y + box2.height &&
        box2.y <= box1.y + box1.height;
};

/**
 * Clamps the given value between 0 and 1.
 *
 * @param {Number} val
 *
 * @return {Number}
 */
const clamp = val => val < 0 ? 0 : (val > 1 ? 1 : val);

/**
 * Generic Linear Interpolation between `a` and `b`.
 *
 * @param {Number} a
 * @param {Number} b
 * @param {Number} t
 *
 * @return {Number}
 */
const lerp = (a, b, t) => (b - a) * clamp(t) + a;

/**
 * Finds the Object Key for the given Value.
 *
 * @param {Object} obj
 * @param {*} val
 * @param {*} [def]
 *
 * @return {String}
 */
const getKeyByVal = (obj, val, def = null) => {
    const keys = Object.keys(obj);
    const total = keys.length;
    let key = def;

    for (let k = 0; k < total; k++) {
        if (obj[keys[k]] === val) {
            key = keys[k];
            break;
        }
    }

    return key;
};

/**
 * Returns whether the given box + circle are colliding.
 *
 * @param {Object} circle
 * @param {Object} box
 *
 * @return {Boolean}
 */
const inRadius = (circle, box) => {
    const distX = Math.abs(circle.x - box.x - box.width / 2);
    const distY = Math.abs(circle.y - box.y - box.height / 2);

    if (
        distX > (box.width / 2 + circle.r) ||
        distY > (box.height / 2 + circle.r)
    ) {
        return false;
    }

    if (
        distX <= (box.width / 2) ||
        distY <= (box.height / 2)
    ) {
        return true;
    }

    const dx = distX - box.width / 2;
    const dy = distY - box.height / 2;

    return dx * dx + dy * dy <= (circle.r * circle.r);
};

module.exports = {
    rand,
    randHex,
    rectInside,
    rectIntersects,
    clamp,
    lerp,
    getKeyByVal,
    inRadius,
};
