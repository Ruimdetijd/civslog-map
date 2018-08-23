"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Style_1 = require("ol/style/Style");
const Icon_1 = require("ol/style/Icon");
const svg_1 = require("./svg");
const iconArgs = (iconString) => ({
    src: 'data:image/svg+xml;utf8,' + iconString,
});
exports.battleIconStyle = (color) => new Style_1.default({
    image: new Icon_1.default(iconArgs(svg_1.battleSvg(color)))
});
exports.aerialBattleIconStyle = new Style_1.default({
    image: new Icon_1.default(iconArgs(svg_1.aerialBattleSvg))
});
exports.birthIconStyle = new Style_1.default({
    image: new Icon_1.default(iconArgs(svg_1.birthSvg))
});
exports.deathIconStyle = new Style_1.default({
    image: new Icon_1.default(iconArgs(svg_1.deathSvg))
});
exports.defaultIcon = new Style_1.default({
    image: new Icon_1.default(iconArgs(svg_1.defaultSvg))
});
