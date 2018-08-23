export default class Popup {
    private overlay;
    closeButton: HTMLElement;
    content: HTMLElement;
    currentFeatures: any[];
    el: HTMLElement;
    syncing: boolean;
    constructor(overlay: any);
    hide(): void;
    show(features: any[]): void;
    private handleClick;
    private featureListItem;
    private multipleFeaturesTemplate;
    private formatFrom;
    private formatTo;
    private singleFeatureTemplate;
}
