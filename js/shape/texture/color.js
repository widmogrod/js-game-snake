define([
    'shape/texture/interface',
    'shape/color'
], function(
    TextureInterface,
    Color
) {
    'use strict';

    function ColorTexture(color) {
        this.color = color;
    }

    ColorTexture.prototype = Object.create(TextureInterface.prototype);
    ColorTexture.prototype.map = function (tu, tv) {
        return this.color;
    }

    return ColorTexture;
})
