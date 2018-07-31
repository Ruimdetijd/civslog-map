import { Feature, Overlay, render } from "openlayers";
export interface PopupProps {
    handleEvent: (name: string, data: any) => void;
}
export default class Popup {
    private overlay;
    closeButton: HTMLElement;
    content: HTMLElement;
    el: HTMLElement;
    event: any;
    constructor(overlay: Overlay);
    hide(): void;
    show(feature: Feature | render.Feature): void;
    private contentTemplate(featureProps);
}
