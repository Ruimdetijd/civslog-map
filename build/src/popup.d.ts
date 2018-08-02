import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import render from 'ol/render';
export default class Popup {
    private overlay;
    closeButton: HTMLElement;
    content: HTMLElement;
    el: HTMLElement;
    event: any;
    constructor(overlay: Overlay);
    hide(): void;
    show(feature: Feature | render.Feature): void;
    private contentTemplate;
}
