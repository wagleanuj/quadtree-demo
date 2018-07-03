import { Graphics, Container } from 'pixi.js';
import { rand } from 'helpers';
import State from 'states/state';
import Quadtree from '@oyed/quadtree';

class Generate extends State {

    /**
     * Initialize the State.
     */
    constructor() {
        super('generate');

        this.entities = [];
        this.tree = new Quadtree({
            width: 500,
            height: 500,
            max_depth: 5,
            max_objects: 3,
        });
        this.debug = new Graphics();
        this.addChild(this.debug);
    }

    /**
     * Called when the State is switched to.
     *
     * @param {Object} options
     */
    up(options) {
        super.up(options);

        const width = 10;
        const height = 10;

        for (let i = 0; i < 50; i++) {
            const entity = new Container();
            const g = new Graphics();
            g.beginFill(0xFF0000);
            g.drawRect(0, 0, width, height);
            g.endFill();
            entity.x = rand(0, 500 - width);
            entity.y = rand(0, 500 - height);
            entity.velocity = {
                x: rand(0, 1) === 0 ? (rand(0, 1) === 0 ? 1 : -1) : 0,
                y: rand(0, 1) === 0 ? (rand(0, 1) === 0 ? 1 : -1) : 0,
            };
            entity.g = g;
            entity.addChild(g);
            this.addChild(entity);
            this.entities[i] = entity;
        }
    }

    /**
     * Runs the update logic for the State.
     *
     * @param {Number} d
     */
    update(d) {
        const { entities } = this;
        const total = entities.length;

        this.tree.clear();

        for (let e = 0; e < total; e++) {
            const entity = entities[e];

            entity.x += entity.velocity.x;
            entity.y += entity.velocity.y;

            if (rand(0, 5) === 0) {
                const moveX = rand(0, 2);
                let newVX = 0;

                if (moveX === 1) {
                    newVX = 1;
                } else if (moveX === 2) {
                    newVX = -1;
                }

                entity.velocity.x = newVX;
            }

            if (rand(0, 5) === 0) {
                const moveY = rand(0, 2);
                let newVY = 0;

                if (moveY === 1) {
                    newVY = 1;
                } else if (moveY === 2) {
                    newVY = -1;
                }

                entity.velocity.y = newVY;
            }

            if (entity.x < 0) {
                entity.x = 0;
            }

            if (entity.y < 0) {
                entity.y = 0;
            }

            if (entity.x + entity.width > 500) {
                entity.x = 500 - entity.width;
            }

            if (entity.y + entity.height > 500) {
                entity.y = 500 - entity.height;
            }

            this.tree.insert({
                x: entity.x,
                y: entity.y,
                width: entity.width,
                height: entity.height,
                index: e,
            });
        }

        this.debug.clear();
        this.debug.lineStyle(1, 0x0000FF, 1);

        const renderNode = node => {
            if (node.parent) {
                for (let i = 0; i < 4; i++) {
                    renderNode(node.children[i]);
                }
            }

            const { options } = node;

            this.debug.moveTo(options.x, options.y);
            this.debug.lineTo(options.x, options.y + options.height);
            this.debug.lineTo(options.x + options.width, options.y + options.height);
            this.debug.lineTo(options.x + options.width, options.y);
            this.debug.lineTo(options.x, options.y);
            this.debug.endFill();
        };

        renderNode(this.tree);
    }

}

export default Generate;
