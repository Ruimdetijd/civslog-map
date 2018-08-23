import { RawEv3nt, TimelineProps } from 'timeline';
export interface MapProps {
    handleEvent: (name: string, data: any) => void;
    target: string;
}
export default class Map {
    private map;
    private popup;
    private features;
    constructor(props: MapProps);
    private handleClick;
    private createImageStyle;
    private createFeature;
    private updateFeatures;
    onSelect(event: RawEv3nt): void;
    setVisibleEvents(visibleEvents: RawEv3nt[], _props: TimelineProps): void;
    updateSize(): void;
}
