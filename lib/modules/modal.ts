import { WinObject } from "components/window/src/window";

abstract class Modal {
    protected _target: HTMLElement | null;
    protected _background: HTMLElement | null;
    constructor(target: HTMLElement, Action: (e: Event) => void = (e: Event) => e.stopPropagation()) {
        this._target = target;
        this._background = document.createElement("div");
        this.background!.classList.add("modal");
        this.background!.addEventListener("click", Action, false);
        this.target!.parentNode!.insertBefore(this.background!, this.target);
        this.background!.appendChild(this.target!);
    }
    public get target() { return this._target; }
    public get background() { return this._background; }
}
export class WindowModal extends Modal {
    constructor(window: WinObject) {
        super(window.target);
        this.background!.classList.add("modal-window");
    }
    public RemoveModal = () => {
        if (!this.background) return;
        this.background.remove();
        this._background = null;
    }
}