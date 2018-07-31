import { CLASS_PREFIX } from "./constants";
import { Feature, Overlay, render } from "openlayers";
import Projection from 'ol/proj'

export interface PopupProps {
	handleEvent: (name: string, data: any) => void
}
export default class Popup {
	closeButton: HTMLElement
	content: HTMLElement
	el: HTMLElement
	event: any
	// overlay: Overlay

	constructor(private overlay: Overlay) {
		this.el = document.createElement('div')
		this.el.classList.add(`${CLASS_PREFIX}popup`)

		this.closeButton = document.createElement('a')
		this.closeButton.textContent = '✖'
		this.closeButton.addEventListener('click', () => {
			if (this.overlay != null) this.overlay.setPosition(undefined)
		})
		this.el.appendChild(this.closeButton)

		this.content = document.createElement('div')
		this.el.appendChild(this.content)
	}

	hide() {
		this.overlay.setPosition(undefined)
	}

	show(feature: Feature | render.Feature) {
		if (this.overlay == null) return console.error('[Popup.show] No overlay')
		const props = feature.getProperties()
		this.event = props.event
		this.content.innerHTML = this.contentTemplate(props)
		const coor = Projection.transform(props.coordinates.coordinates, 'EPSG:4326', 'EPSG:3857')
		this.overlay.setPosition(coor)
	}

	private contentTemplate(featureProps): string {
		return `<h3>${featureProps.event.label}</h3>
			<div class="description">${featureProps.event.description}</div>
			<div class="wikidata-id">${featureProps.event.wikidata_identifier}</div>
			<ul class="dates">
				<li>${featureProps.event.date_min}</li>
				<li>${featureProps.event.date}</li>
				<li>${featureProps.event.end_date}</li>
				<li>${featureProps.event.end_date_max}</li>
			</ul>`.replace(/\>(\\n|\s+)\</g, '><')
	}
}

// <div id="popup" class="ol-popup">
//       <a href="#" id="popup-closer" class="ol-popup-closer"></a>
//       <div id="popup-content"></div>
// 	</div>