'use strict';

var Plane = require('famous/webgl-geometries/primitives/Plane');
var Mesh = require('famous/webgl-renderables/Mesh');
var Color = require('famous/utilities/Color');

function Background (node) {
    this.id = node.addComponent(this);
    this.node = node;

    this.mesh = new Mesh(this.node)
        .setGeometry(new Plane())
        .setBaseColor(new Color('#111'));

    this.node
        .setAlign(0.5, 0.5, 0.5)
        .setMountPoint(0.5, 0.5, 0.5)
        .setPosition(0, 0, -1000)
        .setOpacity(0.75);
}

module.exports = Background;
