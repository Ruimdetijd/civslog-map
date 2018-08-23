import Popup from './popup';
import { RawEv3nt } from 'timeline';
export interface MapProps {
    handleEvent: (name: string, data: any) => void;
    target: string;
}
export default class Map {
    events: any[];
    private map;
    popup: Popup;
    visibleEvents: any[];
    constructor(props: MapProps);
    private handleClick;
    private updateFeatures;
    onSelect(event: RawEv3nt): void;
    setVisibleEvents(visibleEvents: any): void;
    updateSize(): void;
}
