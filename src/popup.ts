import { CLASS_PREFIX } from "./constants";
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'
// @ts-ignore
import { transform } from 'ol/proj'
import { formatDate } from 'timeline'

export default class Popup {
	closeButton: HTMLElement
	content: HTMLElement
	currentFeature: Feature
	el: HTMLElement
	syncing: boolean = false
	// event: any

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
		this.content.addEventListener('click', this.handleClick)
		this.el.appendChild(this.content)
	}

	hide() {
		this.currentFeature = null
		this.overlay.setPosition(undefined)
	}

	show(feature: Feature) {
		this.currentFeature = feature
		if (this.overlay == null) return console.error('[Popup.show] No overlay')
		const props = feature.getProperties()
		this.content.innerHTML = this.contentTemplate(props)
		const coor = transform(props.coordinates.coordinates, 'EPSG:4326', 'EPSG:3857')
		this.overlay.setPosition(coor)
	}

	private handleClick = async (ev) => {
		if (this.syncing) return

		if (ev.target.matches('.sync')) {
			this.syncing = true

			const response = await fetch(`/api/sync-event/${ev.target.dataset.wikidataId}`)
			const json = await response.json()

			this.currentFeature.setProperties({
				event: json
			})

			this.show(this.currentFeature)

			this.syncing = false
		}
	}

	private contentTemplate(featureProps): string {
		const { event } = featureProps

		const description = event.description != null ? `<div class="description">${event.description}</div>` : ''

		const date = formatDate(event.date, event.date_granularity)
		const from = event.date_min != null ?
			`${formatDate(event.date_min, event.date_min_granularity)} ~ ${date}` :
			date
		const to = event.end_date_max != null ?
			`${formatDate(event.end_date, event.end_date_granularity)} ~ ${formatDate(event.end_date_max, event.end_date_max_granularity)}` :
			event.end_date != null ?
				formatDate(event.end_date, event.end_date_granularity) :
				''

		return `<h3 style="font-size: 1.5em">${event.label}</h3>
			${description}
			<h4 style="margin-bottom: 0">${to === '' ? 'Date' : 'From'}</h4>
			${from}
			${to !== '' ? `<h4 style="margin-bottom: 0">To</h4>` : ''}
			${to}
			<div class="wikidata-id">
				<a href="https://www.wikidata.org/wiki/${event.wikidata_identifier}">
					Edit on Wikidata
				</a>
				&nbsp;&nbsp;
				<span style="text-decoration: underline; cursor: pointer;" class="sync" data-wikidata-id="${event.wikidata_identifier}">
					Sync with Wikidata
				</span>
			</div>
			`.replace(/\>(\\n|\s+)\</g, '><')
	}
}
