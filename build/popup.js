"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("./constants");
const timeline_1 = require("timeline");
class Popup {
    constructor(overlay) {
        this.overlay = overlay;
        this.syncing = false;
        this.handleClick = (ev) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.syncing)
                return;
            const target = ev.target;
            if (target.matches('[data-id] *')) {
                const li = target.closest('[data-id]');
                const feature = this.currentFeatures.find(f => f.getId() === li.dataset.id);
                if (feature != null)
                    this.show([feature]);
            }
            else if (target.matches('.sync')) {
                this.syncing = true;
                const response = yield fetch(`/api/events/${target.dataset.wikidataId}`, { method: 'POST' });
                const json = yield response.json();
                if (this.currentFeatures.length > 1) {
                    console.error('Sync can only occur when there is one current feature');
                    return;
                }
                this.currentFeatures[0].setProperties({
                    event: json
                });
                this.show(this.currentFeatures);
                this.syncing = false;
            }
        });
        this.featureListItem = (feature) => {
            const { event } = feature.getProperties();
            return `<li data-id="${feature.getId()}">
			<div>${event.label}</div>
			<div>${this.formatFrom(event)}</div>
			<div>${this.formatTo(event)}</div>
		</li>`;
        };
        this.el = document.createElement('div');
        this.el.classList.add(`${constants_1.CLASS_PREFIX}popup`);
        this.closeButton = document.createElement('a');
        this.closeButton.textContent = '✖';
        this.closeButton.addEventListener('click', () => {
            if (this.overlay != null)
                this.overlay.setPosition(undefined);
        });
        this.el.appendChild(this.closeButton);
        this.content = document.createElement('div');
        this.content.addEventListener('click', this.handleClick);
        this.el.appendChild(this.content);
    }
    hide() {
        this.currentFeatures = null;
        this.overlay.setPosition(undefined);
    }
    show(features) {
        this.currentFeatures = features;
        if (this.overlay == null)
            return console.error('[Popup.show] No overlay');
        if (features.length === 1) {
            this.content.innerHTML = this.singleFeatureTemplate(features[0]);
        }
        else {
            this.content.innerHTML = this.multipleFeaturesTemplate(features);
        }
        this.overlay.setPosition(features[0].getGeometry().getCoordinates());
    }
    multipleFeaturesTemplate(features) {
        return `<h3 style="font-size: 1.5em">Multiple events</h3>
			<ul>
				${features.map(this.featureListItem).join('')}
			</ul>
			`.replace(/\>(\\n|\s+)\</g, '><');
    }
    formatFrom(event) {
        const date = timeline_1.formatDate(event.date, event.date_granularity);
        return event.date_min != null ?
            `${timeline_1.formatDate(event.date_min, event.date_min_granularity)} ~ ${date}` :
            date;
    }
    formatTo(event) {
        return event.end_date_max != null ?
            `${timeline_1.formatDate(event.end_date, event.end_date_granularity)} ~ ${timeline_1.formatDate(event.end_date_max, event.end_date_max_granularity)}` :
            event.end_date != null ?
                timeline_1.formatDate(event.end_date, event.end_date_granularity) :
                '';
    }
    singleFeatureTemplate(feature) {
        const featureProps = feature.getProperties();
        const { event } = featureProps;
        const description = event.description != null ? `<div class="description">${event.description}</div>` : '';
        const from = this.formatFrom(event);
        const to = this.formatTo(event);
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
			`.replace(/\>(\\n|\s+)\</g, '><');
    }
}
exports.default = Popup;
