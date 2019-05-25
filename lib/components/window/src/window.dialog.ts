import { WindowModal } from "modules/modal";
import { WindowObject } from "./window.object";
import { WindowType, WinObject } from "./window.skeleton";
import { WindowController } from "./window";

export class DialogObject extends WinObject {
    private _modal: WindowModal | null = null;
    private _parent: WindowObject | null = null;
    constructor(winName: string, message: string, buttons: [string, () => void][], parent: WindowObject | null = WindowObject.Now(), size: [number, number] = [350, 150]) {
        super(winName, false, WindowType.Dialog, WindowController.Get().dialogView);
        this.target.classList.add("window-dialog");
        if (parent) {
            parent.target.appendChild(this.target);
            parent.modal = this;
            this._parent = parent;
            this._modal = new WindowModal(this);
            if(this._modal.background){
                this._modal.background.addEventListener("focus", this.Select, true);
                this._modal.background.addEventListener("focusout", this.UnSelect, true);
                this.SetPosition((this._modal.background.clientWidth - size[0]) / 2, (this._modal.background.clientHeight - size[1]) / 2);
            }
        }
        else {
            this.SetPosition((document.body.clientWidth - size[0]) / 2, (document.body.clientHeight - size[1]) / 2);
        }
        const width = 350;
        const height = 150;
        this.SetTitle(winName);
        this.SetMessage(message);
        this.SetButtons(buttons);
        this.SetSize(size[0], size[1]);
        //window
        this.EndInit();
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
    public Close = (): void => {
        this.WinCon.RemoveWindow(this);
        if(this._modal) this._modal.RemoveModal();
        if (this._parent) {
            this._parent.modal = null;
            WindowController.Get().ChangeWindow(this._parent);
        }
    }
    /* do nothing */
    Minimize = (): void => { }
    UnMinimize = (): void => { }
    public get parent(): WindowObject | null { return this._parent; }
    public get modal(): WindowModal | null { return this._modal; }
}