import { Position } from "modules/position";
const maxWidth: number = 300;
const maxHeight: number = 300;
export enum direction {
    north, east, south, west, ne, nw, se, sw
}
export class Resizer {
    private pos: Position | null = null;
    private resizeType: Function;
    private _self: HTMLElement;
    private target: HTMLElement;
    mouseX: number = 0;
    mouseY: number = 0;
    constructor(self: HTMLElement, target: HTMLElement, type: direction) {
        this._self = self;
        this.target = target;
        switch (type) {
            case direction.east:
                this.resizeType = this.ResizeE;
                break;
            case direction.west:
                this.resizeType = this.ResizeW;
                break;
            case direction.south:
                this.resizeType = this.ResizeS;
                break;
            case direction.north:
                this.resizeType = this.ResizeN;
                break;
            case direction.ne:
                this.resizeType = function (e: MouseEvent) { this.ResizeN(e); this.ResizeE(e); };
                break;
            case direction.nw:
                this.resizeType = function (e: MouseEvent) { this.ResizeN(e); this.ResizeW(e); };
                break;
            case direction.se:
                this.resizeType = function (e: MouseEvent) { this.ResizeS(e); this.ResizeE(e); };
                break;
            case direction.sw:
                this.resizeType = function (e: MouseEvent) { this.ResizeS(e); this.ResizeW(e); };
                break;
            default: //should be assigned... weird.
                this.resizeType = this.Unresize;
                break;
        }
        this.Init();
    }
    Init() {
        this._self.addEventListener("mousedown", this.ResizeRegister, false);
    }
    private ResizeRegister = (e: Event) => {
        let me: MouseEvent = e as MouseEvent;
        this.pos = new Position(this.target.clientWidth, this.target.clientHeight, this.target.offsetTop, this.target.offsetLeft);
        this.mouseX = me.clientX;
        this.mouseY = me.clientY;
        document.addEventListener("mousemove", this.Resize, false);
        document.addEventListener("mouseup", this.Unresize, { "once": true, "capture": false });
    }
    private Resize = (e: MouseEvent) => {
        if (this.pos === null) return;
        e.preventDefault();
        this.resizeType(e);
        e.stopPropagation();
    }
    private ResizeN = (e: MouseEvent) => {
        let size: number = (this.pos!.height + (this.mouseY - e.clientY));
        if (size >= maxHeight && e.clientY >= 0) {
            this.target.style.height = size + "px";
            this.target.style.top = e.clientY + "px";
        }
    };
    private ResizeW = (e: MouseEvent) => {
        let size: number = (this.pos!.width + (this.mouseX - e.clientX));
        if (size >= maxWidth) {
            this.target.style.width = size + "px";
            this.target.style.left = e.clientX + "px";
        }
    };
    private ResizeE = (e: MouseEvent) => {
        if (e.clientX >= 0) {
            this.target.style.width = (this.pos!.width + (e.clientX - this.mouseX)) + "px";
        }
    };
    private ResizeS = (e: MouseEvent) => {
        this.target.style.height = (this.pos!.height + (e.clientY - this.mouseY)) + "px";
    };
    private Unresize = () => {
        document.removeEventListener("mousemove", this.Resize, false);
        this.pos = null;
    }
    public get self(){ return this._self; }
}
