import { ticker } from 'pixi.js';
import { log, INFO, ERROR } from 'log';
import States from 'bags/states';
import Renderer from 'renderer';
import Debug from 'debug';

class App {

    /**
     * Initialize the entire Application.
     */
    constructor() {
        /**
         * The Container of the Game Instance.
         *
         * @type {DOMElement}
         */
        this.container = document.getElementById('app');

        /**
         * Instances of every State in the Game.
         *
         * @type {Object}
         */
        this.states = {};

        /**
         * The Key of the State currently active, if any.
         *
         * @type {String|null}
         */
        this.activeState = null;

        /**
         * The Renderer Instance for the Game World.
         *
         * @type {Renderer}
         */
        this.renderer = new Renderer(
            this.container.clientWidth,
            this.container.clientHeight
        );

        /**
         * The current Game World Instance for this Game.
         *
         * @type {World|null}
         */
        this.world = null;

        /**
         * An efficient Game Loop Ticker provided by Pixi.js.
         *
         * @type {Ticker}
         */
        this.ticker = new ticker.Ticker();

        log('Initializing...', INFO);

        // Register and add any services.
        this.registerStates();
        this.addCanvas();

        // Bind the Window resize event.
        this.container.addEventListener('resize', () => this.resize());

        // Start the Boot State to handle the Game Initialization.
        setTimeout(() => this.setState('boot'), 1);

        // Initialize the Game Ticker.
        this.ticker.autoStart = false;
        this.ticker.stop();
        this.ticker.add(this.update.bind(this));

        // And finally start the Update loop.
        this.loop();
    }

    /**
     * The Game Ticker Loop.
     */
    loop() {
        this.ticker.update();
        requestAnimationFrame(this.loop.bind(this));
    }

    /**
     * The update loop for the Game.
     *
     * @param {Number} d
     */
    update(d) {
        // Run Debug.
        Debug.update();

        // Render the active State, if any.
        const state = this.activeState;

        if (state !== null) {
            this.states[state].update(d);
            this.renderer.render(this.states[state]);
        }
    }

    /**
     * Registers the Game States.
     */
    registerStates() {
        States.forEach(State => {
            const s = new State();
            this.states[s.key] = s;
        });
    }

    /**
     * Adds the Game Canvas to the page.
     */
    addCanvas() {
        this.container.appendChild(this.renderer.view);
    }

    /**
     * Focussed on the Game Canvas.
     */
    focus() {
        this.renderer.view.focus();
    }

    /**
     * Handle Window resizing.
     */
    resize() {
        this.renderer.resize(
            this.container.clientWidth,
            this.container.clientHeight
        );
    }

    /**
     * Sets the active State of the Game.
     *
     * @param {String} key
     * @param {Object} [options]
     */
    setState(key, options = {}) {
        if (Object.keys(this.states).indexOf(key) === -1) {
            log(`Tried setting State to \`${key}\`, which does not exist in State registry`, ERROR);
            return;
        }

        this.activeState = key;
        this.states[key].up(options);
    }

    /**
     * Sets the Cursor for the Canvas.
     *
     * @param {String|null} val
     */
    set cursor(val) {
        if (val === null) {
            val = 'default';
        }

        document.body.style.cursor = val;
    }

}

export default new App;
