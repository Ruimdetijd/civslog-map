import Feature from 'ol/Feature'
import OlMap from 'ol/WebGLMap'
import Point from 'ol/geom/Point'
// @ts-ignore
import { fromLonLat, transform } from 'ol/proj'
import Stamen from 'ol/source/Stamen'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Overlay from 'ol/Overlay'
import VectorSource from 'ol/source/Vector'
import View from 'ol/View'
import Popup from './popup'
import { battleIconStyle, birthIconStyle, deathIconStyle, aerialBattleIconStyle } from './icons'

const vectorSource = new VectorSource({});

const markers = new VectorLayer({
	source: vectorSource
});

const layers = [
	new TileLayer({
		source: new Stamen({
			layer: 'toner-background'
		})
	}),
	markers
]

const view = new View({
	center: fromLonLat([0, 50]),
	zoom: 4
})

export interface MapProps {
	handleEvent: (name: string, data: any) => void
	target: string,
}
export default class Map {
	events = []
	private map: OlMap
	popup: Popup
	visibleEvents = []

	constructor(props: MapProps) {
		const popupOverlay = new Overlay({
			autoPan: true,
			autoPanAnimation: { duration: 250, source: null }
		})

		this.popup = new Popup(popupOverlay)
		
		popupOverlay.setElement(this.popup.el)

		const overlays = [popupOverlay]

		this.map = new OlMap({
			target: props.target,
			layers,
			overlays,
			view,
		})

		this.updateFeatures()

		this.map.on('click', this.handleClick)
	}

	private handleClick = (e) => {
		var features = this.map.getFeaturesAtPixel(e.pixel);
		if (features) {
			features.forEach((feat, index) => {
				console.log(`[Feat props][${index + 1}]`, feat.getProperties())
			})
			if (features.length === 1) {
				this.popup.show(features[0])
			}
		}
	}

	private updateFeatures() {
		this.popup.hide()

		const features = this.visibleEvents
			.reduce((prev, curr) => {
				if (curr.locations == null) return prev
				curr.locations.forEach(l => {
					const coor = JSON.parse(l.f1)
					const iconFeature = new Feature({
						geometry: new Point(transform(coor.coordinates, 'EPSG:4326', 'EPSG:3857')),
						coordinates: coor,
						date: l.f2,
						end_date: l.f3,
						event: curr,
					});
					let icon
					if (curr.tags.indexOf('battle') > -1) {
						icon = battleIconStyle
						if (curr.tags.indexOf('aerial battle') > -1) icon = aerialBattleIconStyle
					}
					else if (
						curr.tags.indexOf('human') > -1 &&
						(
							curr.date === l.f2 ||
							curr.date_min === l.f2
						)
					) icon = birthIconStyle
					else if (curr.tags.indexOf('human') > -1 && curr.end_date === l.f2) icon = deathIconStyle
					iconFeature.setStyle(icon)
					prev.push(iconFeature)
				})
				return prev
			}, [])
		vectorSource.clear()
		vectorSource.addFeatures(features);
	}

	onSelect(event: { id: string }) {
		const feature = vectorSource.getFeatures().find(f => f.getProperties().event.id === event.id)
		console.log(feature)
		if (feature) this.popup.show(feature)
	}

	setVisibleEvents(visibleEvents) {
		this.visibleEvents = visibleEvents
		this.updateFeatures()
	}

	updateSize() {
		this.map.updateSize()
	}
}