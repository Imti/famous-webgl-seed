'use strict';

var Mesh = require('famous/webgl-renderables/Mesh');
var DynamicGeometry = require('famous/webgl-geometries/DynamicGeometry');
var GeodesicSphere = require('famous/webgl-geometries/primitives/GeodesicSphere');
var Color = require('famous/utilities/Color');
var Transitionable = require('famous/transitions/Transitionable');
var Material = require('famous/webgl-materials/Material');

function GLThing (node) {
    this.id = node.addComponent(this);
    this.node = node;

    this.vertex = null;
    this.fragment = null

    this.amplitude = null;
    this.displacement = [];
    
    this.opacity = new Transitionable(0.4);

    this.drawTypes = [
        'POINTS',
        'LINES',
        'LINE_STRIP',
        'LINE_LOOP',
        'TRIANGLES',
        'TRIANGLE_STRIP',
        'TRIANGLE_FAN'
    ];

    this.geometry = new DynamicGeometry()
        .fromGeometry(new GeodesicSphere({ detail: 5 }))
        .setDrawType(this.drawTypes[4]);

    this.prepareDisplacementBuffer();
    this.setDisplacementBuffer();

    this.registerVertexShader();
    this.registerFragmentShader();

    this.instantiateVertex();
    this.instantiateFragment();

    this.mesh = new Mesh(this.node)
        .setGeometry(this.geometry)
        .setPositionOffset(this.vertex)
        .setBaseColor(this.fragment);

    this.node
        .setSizeMode(1, 1, 1)
        .setAbsoluteSize(300, 300, 300)
        .setAlign(0.5, 0.5, 0.5)
        .setMountPoint(0.5, 0.5, 0.5)
        .setOrigin(0.5, 0.5, 0.5)
        .setOpacity(this.opacity.get())
        .requestUpdate(this.id);

    this.oscillateOpacity();
}

GLThing.prototype.prepareDisplacementBuffer = function() {
    var vertexLength = this.geometry.getLength();

    for (var i = 0; i < vertexLength; i++) {
        this.displacement.push(Math.random() / 4);
    }
};

GLThing.prototype.setDisplacementBuffer = function() {
    this.geometry.setVertexBuffer('a_Displacement', this.displacement);
};

GLThing.prototype.registerVertexShader = function() {
    var vertexShader = 
        `vec3 vertexMain() {
            return a_normals * vec3(a_Displacement * 10.0 * u_Amplitude);
        }`;

    Material.registerExpression('glThingVertex', {
        output: 3,
        glsl: 'vertexMain();',
        defines: vertexShader
    });
};

GLThing.prototype.registerFragmentShader = function() {
    var fragmentShader = 
        `vec4 fragmentMain() {
            return vec4(v_normal + 2.0, 1.0);
        }`;

    Material.registerExpression('glThingFragment', {
        output: 4,
        glsl: 'fragmentMain();',
        defines: fragmentShader
    });
};

GLThing.prototype.instantiateVertex = function() {
    this.vertex = Material.glThingVertex(null, {
        attributes: {
            'a_Displacement': 1
        },
        uniforms: {
            'u_Amplitude': 1
        }
    });
};

GLThing.prototype.instantiateFragment = function() {
    this.fragment = Material.glThingFragment();
};

GLThing.prototype.oscillateOpacity = function() {
    var self = this;

    this.opacity.set(0.4, { duration: 1500, curve: 'easeInOut' }, function() {
        self.opacity.set(0.1, { duration: 1500, curve: 'easeInOut' }, function() {
            self.oscillateOpacity();
        });
    });
};

GLThing.prototype.onUpdate = function(time) {
    this.amplitude = (0.1 * Math.sin(time * 0.005 * 0.25) + 0.1);
    this.vertex.setUniform('u_Amplitude', this.amplitude);

    this.node
        .setRotation(time * 0.001, time * 0.001, 0)
        .setOpacity(this.opacity.get())
        .requestUpdate(this.id);
};

module.exports = GLThing;
