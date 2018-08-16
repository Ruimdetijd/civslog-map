import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
export default class Popup {
    private overlay;
    closeButton: HTMLElement;
    content: HTMLElement;
    currentFeature: Feature;
    el: HTMLElement;
    syncing: boolean;
    constructor(overlay: Overlay);
    hide(): void;
    show(feature: Feature): void;
    private handleClick;
    private contentTemplate;
}
