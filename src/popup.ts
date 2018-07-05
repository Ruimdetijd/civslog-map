import { CLASS_PREFIX } from "./constants";
import { Feature, Coordinate, Overlay, render } from "openlayers";

export interface PopupProps {
	handleEvent: (name: string, data: any) => void
}
export default class Popup {
	closeButton: HTMLElement
	content: HTMLElement
	el: HTMLElement
	event: any
	overlay: Overlay

	constructor(private props: PopupProps) {
		this.el = document.createElement('div')
		this.el.classList.add(`${CLASS_PREFIX}popup`)

		this.closeButton = document.createElement('a')
		this.closeButton.textContent = '✖'
		this.closeButton.addEventListener('click', () => {
			if (this.overlay != null) this.overlay.setPosition(undefined)
		})
		this.el.appendChild(this.closeButton)

		this.content = document.createElement('div')
		this.content.addEventListener('click', this.handleContentClick)
		this.el.appendChild(this.content)
	}

	private handleContentClick = async (ev) => {
		if (ev.target.matches('.reload')) {
			const response = await fetch(`/api/sync-event/${this.event.wikidata_identifier}`)
			const event = await response.json()
			console.log(event)
		} else if (ev.target.matches('.wikidata-internal img')) {
			this.props.handleEvent('OPEN_IFRAME', `https://wikidata.org/wiki/${this.event.wikidata_identifier}`)
		} else if (ev.target.matches('.wikipedia-internal img')) {
			this.props.handleEvent('OPEN_IFRAME', `https://en.wikipedia.org/wiki/${this.event.label}`)
		} else if (ev.target.matches('.wikidata-wikipedia-internal img')) {
			this.props.handleEvent('OPEN_IFRAMES', {
				event: this.event,
				leftSrc: `https://wikidata.org/wiki/${this.event.wikidata_identifier}`,
				rightSrc: `https://en.wikipedia.org/wiki/${this.event.label}`,
			})
		}
		
	}

	handleClick(feature: Feature | render.Feature, coordinate: Coordinate, overlay: Overlay) {
		if (this.overlay == null) this.overlay = overlay
		const props = feature.getProperties()
		this.event = props.event
		this.content.innerHTML = this.contentTemplate(props)
		overlay.setPosition(coordinate)
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
			</ul>
			<div class="links">
				<div class="reload" title="Sync event with Wikidata">⟳</div>
				<div class="wikidata-wikipedia-internal">
					<img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Wikidata-logo.svg" />
					<img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Wikipedia-logo-v2-en.png" />
				</div>
				<div class="wikidata-internal">
					<img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Wikidata-logo.svg" />
				</div>
				<div class="wikipedia-internal">
					<img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Wikipedia-logo-v2-en.png" />
				</div>
				<a href="https://wikidata.org/wiki/${featureProps.event.wikidata_identifier}" title="Wikidata">
					<img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Wikidata-logo.svg" />
				</a>
				<a href="https://en.wikipedia.org/wiki/${featureProps.event.label}" title="Wikipedia">
					<img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Wikipedia-logo-v2-en.png" />
				</a>
			</div>`.replace(/\>(\\n|\s+)\</g, '><')
	}
}

// <div id="popup" class="ol-popup">
//       <a href="#" id="popup-closer" class="ol-popup-closer"></a>
//       <div id="popup-content"></div>
// 	</div>