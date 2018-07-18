export interface MapProps {
    handleEvent: (name: string, data: any) => void;
    target: string;
    events: any[];
}
export default class Map {
    events: any[];
    private map;
    visibleEvents: any[];
    constructor(props: MapProps);
    private updateFeatures();
    setRange({visibleFrom, visibleTo}: {
        visibleFrom: any;
        visibleTo: any;
    }): void;
    updateSize(): void;
}
