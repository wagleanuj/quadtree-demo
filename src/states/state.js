import { Container } from 'pixi.js';
import { log, INFO } from 'log';

class State extends Container {

    /**
     * Initialize the State.
     *
     * @param {String} key
     */
    constructor(key) {
        super();

        /**
         * The Key identifier for this State.
         *
         * @type {String}
         */
        this.key = key;

        log(`State \`${key}\` has been initialized`, INFO);
    }

    /**
     * Called when the State is switched to.
     *
     * @param {Object} options
     */
    up(options) {
        log(`Switched to State \`${this.key}\``, INFO);
    }

    /**
     * Called when a State is being moved away from.
     *
     * @return {Array|null}
     */
    down() {
        log(`Leaving State \`${this.key}\``, INFO);
    }

    /**
     * Runs the update logic for the State.
     *
     * @param {Number} d
     */
    update(d) {
        //
    }

}

export default State;
