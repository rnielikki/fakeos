/// NOTE: DON'T USE DOCWIDTH / DOCHEIGHT OUTSIDE OF WINDOW MAX/MIN POSITION AREA!
/// THIS IS NOT *REAL* WIDTH / HEIGHT!
export let docWidth: number = window.innerWidth - 100, docHeight: number = window.innerHeight - 20;

export class Position {
    private _width: number;
    private _height: number;
    private _top: number;
    private _left: number;
    constructor(w: number, h: number, t: number, l: number) {
        this._width = w;
        this._height = h;
        this._top = t;
        this._left = l;
    }
    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
    get top(): number {
        return this._top;
    }
    get left(): number {
        return this._left;
    }
    public SetStyle(Obj: HTMLElement): void {
        Obj.style.width = this.width + "px";
        Obj.style.height = this.height + "px";
        Obj.style.left = ((this.left > docWidth) ? docWidth : this.left) + "px";
        Obj.style.top = ((this.top > docHeight) ? docHeight : this.top) + "px";
    }
}