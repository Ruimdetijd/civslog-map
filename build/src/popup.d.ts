import { Feature, Coordinate, Overlay, render } from "openlayers";
export interface PopupProps {
    handleEvent: (name: string, data: any) => void;
}
export default class Popup {
    private props;
    closeButton: HTMLElement;
    content: HTMLElement;
    el: HTMLElement;
    event: any;
    overlay: Overlay;
    constructor(props: PopupProps);
    private handleContentClick;
    handleClick(feature: Feature | render.Feature, coordinate: Coordinate, overlay: Overlay): void;
    private contentTemplate(featureProps);
}
