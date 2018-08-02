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
    setRange({ visibleFrom, visibleTo }: {
        visibleFrom: any;
        visibleTo: any;
    }): void;
    updateSize(): void;
}
