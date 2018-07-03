import * as PIXI from 'pixi.js';
import State from 'states/state';
import App from 'app';

class Boot extends State {

    /**
     * Initialize the State.
     */
    constructor() {
        super('boot');
    }

    /**
     * Called when the State is switched to.
     *
     * @param {Object} options
     */
    up(options) {
        super.up(options);

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        App.setState('generate');
    }

}

export default Boot;
