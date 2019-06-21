import { WindowModal } from "modules/modal";
import { WindowObject } from "./window.object";
import { WindowType, WinObject } from "./window.skeleton";
import { WindowController } from "./window";

export class DialogObject extends WinObject {
    private _modal: WindowModal | null = null;
    private _parent: WindowObject | null = null;
    constructor(winName: string, message: string, buttons: [string, () => void][], parent: WindowObject | null = WindowObject.Now()) {
        super(winName, false, WindowType.Dialog, WindowController.Get().dialogView);
        this.target.classList.add("window-dialog");
        if (parent) {
            parent.target.appendChild(this.target);
            parent.modal = this;
            this._parent = parent;
            this._modal = new WindowModal(this);
            if(this._modal.background){
                this._modal.background.addEventListener("mousedown", this.Select, true);
            }
        }
        else {
            
        }
        this.SetTitle(winName);
        this.SetMessage(message);
        this.SetButtons(buttons);
        //window
        this.EndInit();
        //After attaching, let's set the position.
        const rect=this.target.getBoundingClientRect();
        if(this._modal && this._modal.background){
            this.SetPosition((this._modal.background.clientWidth - rect.width) / 2, (this._modal.background.clientHeight - rect.height) / 2);
        }
        else{
            this.SetPosition((document.body.clientWidth - rect.width) / 2, (document.body.clientHeight - rect.height) / 2);
        }
    }
    SetMessage(msg: string): void {
        (this.target.getElementsByClassName("window-dialog-message")[0] as HTMLElement).innerText = msg;
    }
    SetButtons(buttons: [string, () => void][]): void {
        const buttonsDiv = this.target.getElementsByClassName("window-dialog-buttons")[0];
        for (let i = 0; i < buttons.length; i++) {
            const div = document.createElement("div");
            div.classList.add("button");
            div.innerText = buttons[i][0];
            div.addEventListener("click", buttons[i][1]);
            buttonsDiv.appendChild(div);
        }
    }
    /* do nothing */
    Minimize = (): void => { }
    UnMinimize = (): void => { }
    public get parent(): WindowObject | null { return this._parent; }
    public get modal(): WindowModal | null { return this._modal; }
}