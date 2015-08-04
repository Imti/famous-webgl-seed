'use strict';

var FamousEngine = require('famous/core/FamousEngine');

var GLThing = require('./glThing');
var Light = require('./light');
var Background = require('./background');

FamousEngine.init();

var scene = FamousEngine.createScene('#famous-container');

new GLThing(scene.addChild());
new Background(scene.addChild());

for (var i = 0; i < 4; i++) new Light(scene.addChild());
