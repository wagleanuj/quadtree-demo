import EventEmitter from 'eventemitter3';

class Debug extends EventEmitter {

    /**
     * Initialize the Debug Instance.
     */
    constructor() {
        super();

        /**
         * Whether or not the Debug Utility is enabled or not.
         * When disabled, no Debug calculations (Such as FPS) will be ran.
         *
         * @type {Boolean}
         */
        this.enabled = true; // TODO

        /**
         * The FPS logging store.
         *
         * @type {Object}
         */
        this.fps = {
            cnt: 0, // Frames passed since we last logged the FPS.
            last: performance.now(), // Last time the FPS was logged.
        };
    }

    /**
     * Ran every update frame.
     */
    update() {
        if (!this.enabled) {
            return;
        }

        // FPS Calculations.
        const now = performance.now();
        this.fps.cnt++;

        if (now - this.fps.last >= 1000) {
            const fps = this.fps.cnt;
            this.fps.cnt = 0;
            this.fps.last = now;
            this.emit('fps', fps);
        }
    }

}

export default new Debug;
