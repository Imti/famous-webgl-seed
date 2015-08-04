'use strict';

var PointLight = require('famous/webgl-renderables/lights/PointLight');
var Engine = require('famous/core/FamousEngine');
var Color = require('famous/utilities/Color');
var Vec3 = require('famous/math/Vec3');

function Light(node) {
    this.id = node.addComponent(this);
    this.node = node;

    this.color = getRandomColor();
    this.tempo = Math.random() * 10;
    this.radius = 500;

    new PointLight(this.node).setColor(this.color);

    this.pos = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    this.r = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

    this.node
        .setSizeMode(1, 1, 1)
        .setAbsoluteSize(50, 50, 50)
        .setAlign(0, 0.5, 0.5)
        .setOrigin(0.5, 0.5, 0.5)
        .setMountPoint(0.5, 0.5, 0.5)
        .requestUpdate(this.id);

    this.randomizeColors();
}

Light.prototype.randomizeColors = function() {
    var self = this;

    Engine.getClock().setInterval(function() {
        self.color.changeTo(getRandomColor(), { duration: 2500 });
    }, 5000);
};

function getRandomColor () {
    return new Color([
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
    ]);
}

Light.prototype.onUpdate = function(time) {
    var p = this.pos;
    var dir = Vec3.cross(p, this.r, new Vec3());

    dir.normalize().scale(this.tempo);
    p.add(dir).normalize().scale(this.radius);

    this.node
        .setPosition(p.x, p.y, 1000)
        .requestUpdate(this.id);
};

module.exports = Light;
