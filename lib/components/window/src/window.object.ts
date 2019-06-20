import { WindowController } from "./window"
import { WindowType, WinObject } from "./window.skeleton";
import { DialogObject } from "./window.dialog";
import { WIN } from "./window.alias";
import * as barmenu from "./menu_windowbar";

import { WindowMenu } from "modules/menu";
import { RightMenu } from "modules/rightclick";

export class WindowObject extends WinObject {
    protected _contentPage: HTMLElement;
    protected _modal: WinObject | null = null;
    protected _modalev: Event | null = null;
    private _favicon!: HTMLImageElement;
    constructor(winName: string, resizable = true) {
        super(winName, resizable, WindowType.Window, WindowController.Get().view);
        this._contentPage = this.target.getElementsByClassName("window-content")[0] as HTMLElement;
        let menubar = this.target.getElementsByClassName("window-menu")[0];
        let winDir;
        try {
            winDir = require(`__src__/window/${winName}/${winName}.ts`).default;
            if (winDir.menu && menubar !== null) {
                menubar.appendChild(WindowMenu(winDir.menu));
            }
            this.SetTitle(winDir.title || "Noname");
            this.SetContent("index");
            let favicon;
            try {
                favicon = require(`__src__/window/${winName}/favicon.png`);
            }
            catch{
                favicon = require(`__src__/resource/default_icon.png`);
            } //meh
            const img = document.createElement("img");
            img.src = favicon;
            this._favicon = img;
            this._favicon.classList.add("favicon");
            this.windowBar.insertBefore(img, this.windowBar.firstChild);

            const pos = this.WinCon.next.next().value;
            this.SetPosition(pos, pos);
            new RightMenu(this.windowBar, barmenu.default);
            this.EndInit();
        }
        catch{
            this.Close();
            new DialogObject("Error", "You are trying to load bad egg", [["Oops", WIN.Close]], null);
            return;
        }
    }
    public SetContent = (filename: string) => {
        //safer way than innerHTML
        const parser = new DOMParser();
        const contentPage: HTMLElement = this.target.getElementsByClassName("window-content")[0] as HTMLElement;
        const shadow = contentPage.shadowRoot || contentPage.attachShadow({mode:"open"});
        try {
            const parsedAll = parser.parseFromString(require(`__src__/window/${this.winName}/${filename}.html`), "text/html");
            const parsedHead = parsedAll.head.querySelector("style");
            const parsed = parsedAll.body.children;
            while(shadow.firstChild){
                shadow.removeChild(shadow.firstChild);
            }
            contentPage.appendChild(shadow);
            if(parsedHead)
                shadow.appendChild(parsedHead);
            for (let i = 0; i < parsed.length; i++) {
                shadow.appendChild(parsed[i]);
            }
        }
        catch(err){
            const errMsg=document.createElement("p");
            errMsg.innerText="ooopps failed to load!";
            shadow.appendChild(errMsg);
        }
    }
    /* Note: recommend to use ONLY in window template scripts */
    public static Now(): WindowObject { return WindowController.Get().ActiveWindow as WindowObject; }
    public get contentPage(): HTMLElement { return this._contentPage; }
    public get modal(): WinObject | null { return this._modal; }
    public set modal(value: WinObject | null) { this._modal = value; }
    public get modalev(): Event | null { return this._modalev; }
    public set modalev(value: Event | null) { this._modalev = value; }
    public get favicon(): HTMLImageElement { return this._favicon; }
}