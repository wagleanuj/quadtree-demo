import * as PIXI from 'pixi.js';

class Renderer {

    /**
     * Intialize the Renderer.
     *
     * @param {Number} width
     * @param {Number} height
     */
    constructor(width, height) {
        PIXI.utils.skipHello();

        this.pixi = PIXI.autoDetectRenderer(width, height, {
            antialias: true,
            transparent: true,
            resolution: window.devicePixelRatio,
            autoResize: true,
        });
        this.pixi.autoResize = true;
    }

    /**
     * Handle Window resizing.
     *
     * @param {Number} width
     * @param {Number} height
     */
    resize(width, height) {
        this.pixi.view.style.width = `${width}px`;
        this.pixi.view.style.height = `${height}px`;
        this.pixi.resize(width, height);
    }

    /**
     * Tells the Renderer to render the given Stage.
     *
     * @param {PIXI.Container} stage
     */
    render(stage) {
        this.pixi.render(stage);
    }

    /**
     * Generates a Texture from an Object.
     *
     * @param {*} obj
     *
     * @return {PIXI.Texture}
     */
    generateTexture(obj) {
        return this.pixi.generateTexture(obj);
    }

    /**
     * Returns the Pixi.js Canvas instance.
     *
     * @return {*}
     */
    get view() {
        return this.pixi.view;
    }

}

export default Renderer;
