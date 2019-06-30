import { Position, docWidth, docHeight } from "./position";
abstract class Movable {
    protected mouseX: number = 0;
    protected mouseY: number = 0;
    protected PositionData: Position | null = null;
    protected _target: HTMLElement;
    constructor(template: DocumentFragment, appendTarget: HTMLElement=document.body) {
        if (this instanceof Copyable) {
            this._target = this.NewChild(template, appendTarget);
        }
        else this._target = template.firstElementChild as HTMLElement || document.createElement("div");
    }
    protected Register = (e: MouseEvent) => {
        if (this.PositionData !== null || !this._target) return;
        this.mouseX = e.clientX - parseInt(this._target.style.left || "0");
        this.mouseY = e.clientY - parseInt(this._target.style.top || "0");
        document.addEventListener("mousemove", this.Drag, false);
        document.addEventListener("mouseup", this.Unregister, { "once": true, "capture": false });
    }
    protected Drag = (e: MouseEvent) => {
        if (e.clientX > 0 && e.clientX < docWidth) {
            this._target!.style.left = (e.clientX - this.mouseX).toString() + "px";
        }
        if (e.clientY > 0 && e.clientY < docHeight) {
            this._target!.style.top = (e.clientY - this.mouseY).toString() + "px";
        }
    }
    public SetPosition(left: number, top: number): void {
        this.target.style.left = left + "px"
        this.target.style.top = top + "px"
    }
    private Unregister = () => document.removeEventListener("mousemove", this.Drag, false);
    public get target(): HTMLElement { return this._target; }
}
export abstract class Copyable extends Movable {
    constructor(template: DocumentFragment, appendTarget: HTMLElement=document.body) {
        super(template, appendTarget);
    }
    NewChild(view: DocumentFragment, appendTarget: HTMLElement=document.body): HTMLElement {
        const copied = view.cloneNode(true);
        const returnValue = copied.firstChild;
        if(returnValue===null) console.error("Copyable class has empty DocumentFragment");
        appendTarget.appendChild(copied);
        return returnValue as HTMLElement;
    }
}