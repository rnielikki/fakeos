import { WindowController, WinObject, DialogObject, WindowObject } from "components/window/src/window";
import * as barmenu from "components/window/src/menu_windowbar";
import { RightMenu } from "modules/rightclick";
import { MenuDirection } from "modules/menu";

export class WindowStatus {
    private windowList: WindowBar[] = new Array();
    private activeBar: WindowBar | null = null;
    windows: HTMLElement;
    private static _this: WindowStatus;
    private constructor(windows: HTMLElement) {
        this.windows = windows;
        document.body.addEventListener("winopen", this.AddToBar);
        document.body.addEventListener("winclose", this.RemoveFromBar);
        document.body.addEventListener("winfocus", this.FocusBar);
        document.body.addEventListener("winfocusout", this.FocusOutBar);
    }
    static Get(): WindowStatus | null {
        if (!WindowStatus._this) return null;
        else return WindowStatus._this;
    }
    static Set(elem: HTMLElement) {
        if (!WindowStatus._this) WindowStatus._this = new WindowStatus(elem);
    }
    AddToBar = (e: Event) => {
        const obj = (e as CustomEvent).detail;
        if (obj instanceof DialogObject) return;
        const bar = new WindowBar(obj);
        this.windowList.push(bar);
        this.windows.appendChild(bar.statusObject);
    }
    RemoveFromBar = (e: Event) => {
        const removeTarget = (e as CustomEvent).detail;
        if (removeTarget instanceof DialogObject) return;
        const index = this.windowList.findIndex(obj => obj.windowObject === removeTarget);
        if (index !== -1) {
            this.windowList[index].statusObject.remove();
            this.windowList.splice(index, 1);
        }
        if (this.windowList.length === 0) { this.activeBar = null; }
    }
    FocusBar = (e: Event) => {
        const current: WinObject = (e as CustomEvent).detail;
        if (current instanceof DialogObject) {
            if (current.parent === null) return;
            this.activeBar = this.windowList.filter(obj => obj.windowObject === current.parent)[0];
            if (this.activeBar)
                this.activeBar.Select();
        }
        else if (!current.minimized) {
            this.activeBar = this.windowList.filter(obj => obj.windowObject === current)[0];
            if (this.activeBar)
                this.activeBar.Select();
        }
    }
    FocusOutBar = (e: Event) => {
        if (this.activeBar) {
            this.activeBar.UnSelect();
        }
    }
}


class WindowBar {
    statusObject: HTMLElement;
    windowObject: WinObject;
    constructor(win: WinObject) {
        this.windowObject = win;
        this.statusObject = this.MakeBar();
        document.body.addEventListener("wintitle", this.ChangeBar);
        new RightMenu(this.statusObject, barmenu.default, MenuDirection.up);
    }
    private MakeBar(): HTMLElement {
        let bar: HTMLElement = document.createElement("div");
        const asWindow = this.windowObject as WindowObject;
        //with text
        //bar.innerText = this.windowObject.title;
        //without text
        bar.title = this.windowObject.title;

        bar.prepend(asWindow.favicon.cloneNode());
        bar.addEventListener("mousedown", this.ChangeToThis);
        bar.addEventListener("click", this.MinToggle);
        return bar;
    }
    private ChangeBar(): void {
        this.statusObject.innerText = this.windowObject.windowBar.getElementsByTagName("span")[0].innerHTML;
    }
    private ChangeToThis = () => WindowController.Get().ChangeWindow(this.windowObject);
    private MinToggle = (e: Event) => {
        if (WindowController.Get().LastActive !== this.windowObject) {
            WindowController.Get().ChangeWindow(this.windowObject);
        }
        else {
            if (this.windowObject.minimized) {
                this.windowObject.UnMinimize();
            }
            else {
                this.windowObject.Minimize();
            }
        }
    }
    public Select = () => this.statusObject.classList.add("selected");
    public UnSelect = () => this.statusObject.classList.remove("selected");
}