import Popup from './popup';
export interface MapProps {
    handleEvent: (name: string, data: any) => void;
    target: string;
    events: any[];
}
export default class Map {
    events: any[];
    private map;
    popup: Popup;
    visibleEvents: any[];
    constructor(props: MapProps);
    private handleClick;
    private updateFeatures;
    onSelect(event: {
        id: string;
    }): void;
    setVisibleEvents(visibleEvents: any): void;
    updateSize(): void;
}
