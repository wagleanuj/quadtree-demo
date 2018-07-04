import { Graphics, Text, Container } from 'pixi.js';
import { rand, rectIntersects } from 'helpers';
import State from 'states/state';
import Quadtree from '@oyed/quadtree';
import Debug from 'debug';

class Generate extends State {

    /**
     * Initialize the State.
     */
    constructor() {
        super('generate');

        this.bad = window.location.hash.substr(1) === 'bad';

        this.mapWidth = 800;
        this.mapHeight = 800;
        this.entityWidth = 10;
        this.entityHeight = 10;

        this.entities = [];

        this.tree = new Quadtree({
            width: this.mapWidth,
            height: this.mapHeight,
            max_depth: 5,
            max_objects: 3,
        });

        this.game = new Container();
        this.addChild(this.game);

        this.debug = new Graphics();
        this.addChild(this.debug);

        this.fps = new Text('-', {
            fill: 0x000000,
            fontWeight: 'bold',
            fontSize: 18,
        });
        this.fps.x = 10;
        this.fps.y = 10;
        this.addChild(this.fps);

        this.checks = new Text('-', {
            fill: 0x000000,
            fontWeight: 'bold',
            fontSize: 18,
        });
        this.checks.x = 10;
        this.checks.y = 30;
        this.addChild(this.checks);

        Debug.on('fps', fps => this.fps.text = `${fps} FPS`);
    }

    /**
     * Called when the State is switched to.
     *
     * @param {Object} options
     */
    up(options) {
        super.up(options);

        for (let i = 0; i < 500; i++) {
            const entity = new Container();
            entity.highlighted = new Graphics();
            entity.default = new Graphics();

            entity.default.beginFill(0xFF0000);
            entity.default.drawRect(0, 0, this.entityWidth, this.entityHeight);
            entity.default.endFill();

            entity.highlighted.beginFill(0x00FF00);
            entity.highlighted.drawRect(0, 0, this.entityWidth, this.entityHeight);
            entity.highlighted.endFill();
            entity.highlighted.visible = false;

            entity.x = rand(0, this.mapWidth - this.entityWidth);
            entity.y = rand(0, this.mapHeight - this.entityHeight);
            entity.velocity = {
                x: rand(0, 1) === 0 ? (rand(0, 1) === 0 ? 1 : -1) : 0,
                y: rand(0, 1) === 0 ? (rand(0, 1) === 0 ? 1 : -1) : 0,
            };

            entity.addChild(entity.default);
            entity.addChild(entity.highlighted);

            this.game.addChild(entity);
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

        if (!this.bad) {
            this.tree.clear();
        }

        for (let e = 0; e < total; e++) {
            const entity = entities[e];

            if (entity.highlighted.visible) {
                entity.highlighted.visible = false;
            }

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

            if (entity.x + entity.width > this.mapWidth) {
                entity.x = this.mapWidth - entity.width;
            }

            if (entity.y + entity.height > this.mapHeight) {
                entity.y = this.mapHeight - entity.height;
            }

            if (!this.bad) {
                this.tree.insert({
                    x: entity.x,
                    y: entity.y,
                    width: entity.width,
                    height: entity.height,
                    index: e,
                });
            }
        }

        let checks = 0;

        for (let e = 0; e < total; e++) {
            const entity = entities[e];

            if (this.bad) {
                for (let e2 = 0; e2 < total; e2++) {
                    if (e !== e2) {
                        checks++;

                        if (rectIntersects(entity, this.entities[e2])) {
                            entity.highlighted.visible = true;
                            this.entities[e2].highlighted.visible = true;
                        }
                    }
                }
            } else {
                const potential = this.tree.retrieve(entity);
                const totalPotential = potential.length;

                for (let p = 0; p < totalPotential; p++) {
                    const index = potential[p].index;

                    if (e !== index) {
                        checks++;

                        if (rectIntersects(entity, this.entities[index])) {
                            entity.highlighted.visible = true;
                            this.entities[index].highlighted.visible = true;
                        }
                    }
                }
            }
        }

        this.checks.text = `${checks} Collision Checks`;

        if (!this.bad) {
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

}

export default Generate;
