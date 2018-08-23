"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Feature_1 = require("ol/Feature");
const WebGLMap_1 = require("ol/WebGLMap");
const Point_1 = require("ol/geom/Point");
const proj_1 = require("ol/proj");
const Stamen_1 = require("ol/source/Stamen");
const Tile_1 = require("ol/layer/Tile");
const Vector_1 = require("ol/layer/Vector");
const Overlay_1 = require("ol/Overlay");
const Vector_2 = require("ol/source/Vector");
const View_1 = require("ol/View");
const popup_1 = require("./popup");
const Style_1 = require("ol/style/Style");
const Circle_1 = require("ol/style/Circle");
const Fill_1 = require("ol/style/Fill");
const Stroke_1 = require("ol/style/Stroke");
const vectorSource = new Vector_2.default({});
const markers = new Vector_1.default({
    source: vectorSource
});
const layers = [
    new Tile_1.default({
        source: new Stamen_1.default({
            layer: 'toner-background'
        })
    }),
    markers
];
const view = new View_1.default({
    center: proj_1.fromLonLat([0, 50]),
    zoom: 4
});
class Map {
    constructor(props) {
        this.features = {};
        this.handleClick = (e) => {
            var features = this.map.getFeaturesAtPixel(e.pixel);
            if (features != null)
                this.popup.show(features);
        };
        const popupOverlay = new Overlay_1.default({
            autoPan: true,
            autoPanAnimation: { duration: 250, source: null }
        });
        this.popup = new popup_1.default(popupOverlay);
        popupOverlay.setElement(this.popup.el);
        const overlays = [popupOverlay];
        this.map = new WebGLMap_1.default({
            target: props.target,
            layers,
            overlays,
            view,
        });
        this.map.on('click', this.handleClick);
    }
    createImageStyle(color) {
        return new Circle_1.default({
            radius: 6,
            stroke: new Stroke_1.default({
                color: 'black',
            }),
            fill: new Fill_1.default({ color })
        });
    }
    createFeature(event, location, id) {
        const coor = JSON.parse(location.f1);
        const marker = new Feature_1.default({
            geometry: new Point_1.default(proj_1.transform(coor.coordinates, 'EPSG:4326', 'EPSG:3857')),
            coordinates: coor,
            date: location.f2,
            end_date: location.f3,
            event,
        });
        marker.setId(id);
        marker.setStyle(new Style_1.default({
            image: this.createImageStyle(event.color)
        }));
        return marker;
    }
    updateFeatures(visibleEvents) {
        this.popup.hide();
        const features = visibleEvents
            .reduce((prev, event) => {
            if (event.locations == null)
                return prev;
            const ftrs = event.locations
                .map((location, index) => {
                const key = `${event.id}-${index}`;
                if (!this.features.hasOwnProperty(key)) {
                    this.features[key] = this.createFeature(event, location, key);
                }
                else {
                    this.features[key].getStyle().setImage(this.createImageStyle(event.color));
                }
                return this.features[key];
            });
            return prev.concat(...ftrs);
        }, []);
        vectorSource.clear();
        vectorSource.addFeatures(features);
    }
    onSelect(event) {
        const feature = vectorSource.getFeatures().find((f) => f.getProperties().event.id === event.id);
        if (feature)
            this.popup.show([feature]);
    }
    setVisibleEvents(visibleEvents, _props) {
        this.updateFeatures(visibleEvents);
    }
    updateSize() {
        this.map.updateSize();
    }
}
exports.default = Map;
