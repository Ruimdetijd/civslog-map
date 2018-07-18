import Feature from 'ol/feature'
import OlMap from 'ol/map'
import Point from 'ol/geom/point'
import Projection from 'ol/proj'
import Stamen from 'ol/source/stamen'
import TileLayer from 'ol/layer/tile'
import VectorLayer from 'ol/layer/vector'
import Overlay from 'ol/overlay'
import VectorSource from 'ol/source/vector'
import View from 'ol/view'
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
	center: Projection.fromLonLat([0, 50]),
	zoom: 4
})

export interface MapProps {
	handleEvent: (name: string, data: any) => void
	target: string,
	events: any[],
}
export default class Map {
	events = []
	private map: OlMap
	visibleEvents = []

	constructor(props: MapProps) {
		const popup = new Popup({
			handleEvent: (name, data) => {
				props.handleEvent(name, data)

				if (name === 'OPEN_IFRAMES') {
					const center = JSON.parse(data.event.locations[0].f1).coordinates
					const coor = new Point(Projection.transform(center, 'EPSG:4326', 'EPSG:3857'))
					view.animate({ center: coor.getCoordinates() })
				}
			}
		})
		
		const popupOverlay = new Overlay({
			element: popup.el,
			autoPan: true,
			autoPanAnimation: { duration: 250, source: null }
		})

		const overlays = [popupOverlay]

		this.map = new OlMap({
			target: props.target,
			layers,
			overlays,
			view,
		})

		this.events = props.events
		this.updateFeatures()

		this.map.on('click', function(e: any) {
			var features = this.map.getFeaturesAtPixel(e.pixel);
			if (features) {
				features.forEach(feat => {
					console.log('[Feat props]', feat.getProperties())
				})
				if (features.length === 1) {
					props.handleEvent('MAP_FEATURE_CLICK', features[0].getProperties())
					popup.handleClick(features[0], e.coordinate, popupOverlay)
				}
			}
		})
	}

	private updateFeatures() {
		const features = this.visibleEvents
			.reduce((prev, curr) => {
				if (curr.locations == null) return prev
				curr.locations.forEach(l => {
					const coor = JSON.parse(l.f1)
					const iconFeature = new Feature({
						geometry: new Point(Projection.transform(coor.coordinates, 'EPSG:4326', 'EPSG:3857')),
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

	setRange({ visibleFrom, visibleTo }) {
		this.visibleEvents = this.events.filter(e => {
			const eFrom = e.date_min != null ? e.date_min : e.date
			const eTo = e.end_date_max != null ?
				e.end_date_max :
				e.end_date != null ?
					e.end_date :
					eFrom
			return !(eFrom > visibleTo || eTo < visibleFrom)
		})
		this.updateFeatures()
	}

	updateSize() {
		this.map.updateSize()
	}
}