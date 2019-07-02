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
    protected programName: string | null = null;
    private _favicon!: HTMLImageElement;
    constructor(winName: string, resizable = true) {
        super(winName, resizable, WindowType.Window, WindowController.Get().view);
        this._contentPage = this.target.getElementsByClassName("window-content")[0] as HTMLElement;
        let menubar = this.target.getElementsByClassName("window-menu")[0];
        let winDir;
        try {
            const nameIndex=winName.lastIndexOf("/");
            this.programName=winName.substring(nameIndex+1);
            winDir = require(`__src__/window/${winName}/${this.programName}.ts`).default;
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
            //only for system programs, can load ts files for communication...
            if(winName.substring(0,nameIndex)==="system"){
                try{
                    //"lazy loading"
                    //thanks to ts-loader, loader doesn't load duplicated module
                    require(`__src__/window/${winName}/${this.programName}.system.ts`).default(this);
                }
                catch{} //really meh
            }
        }
        catch(err){
            //this.Close();
            this.target.remove();
            console.error(err);
            new DialogObject("Error", "You are trying to load bad egg", [["Oops", WIN.Close]], null);
            return;
        }
    }
    public SetContent = (filename: string) => {
        const parser = new DOMParser();
        const contentPage: HTMLElement = this.target.getElementsByClassName("window-content")[0] as HTMLElement;
        let shadow = contentPage.shadowRoot;
        try {
            const parsed = parser.parseFromString(require(`__src__/window/${this.winName}/${filename}.html`), "text/html").body.children;
            const addElems=function(div:HTMLDivElement){
                for (let i = 0; i < parsed.length; i++) {
                    div.appendChild(parsed[i]);
                }
            }
            if(!shadow){
                shadow=contentPage.attachShadow({mode:"open"});
                const softStyle = require(`!!raw-loader!__src__/window/${this.winName}/${this.programName}.css`).default;
                const sty=document.createElement("style");
                sty.textContent=softStyle;
                shadow.appendChild(sty);
                const shadowContent=document.createElement("div");
                shadowContent.style.width="100%";
                shadowContent.style.height="100%";
                addElems(shadowContent);
                shadow.appendChild(shadowContent);
                try{
                    const scr=document.createElement("script");
                    const softScript = require(`!!raw-loader!__src__/window/${this.winName}/${this.programName}.js`).default;
                    scr.textContent=softScript;
                    contentPage.appendChild(scr);
                }
                catch{} //meh.
            }
            else{
                const shadowDiv=shadow.querySelector("div");
                if(!shadowDiv) return;
                shadowDiv.textContent="";
                addElems(shadowDiv);
            }
        }
        catch(err){
            if(!shadow){
                shadow=contentPage.attachShadow({mode:"open"});
            }
            const errMsg=document.createElement("p");
            console.error(err);
            errMsg.innerText="ooopps failed to load! press f12 and read console to check why";
            shadow.appendChild(errMsg);
        }
    }
    public OpenFile=(data:string | HTMLElement)=>{
        const content=this.contentPage.shadowRoot!.querySelector(".window-content-fill") as HTMLElement;
        if(content===null) return;
        else if(typeof data==="string"){
            content.innerHTML=data; //for line break..... :/
        }
        else{
            content.textContent="";
            content.appendChild(data);
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