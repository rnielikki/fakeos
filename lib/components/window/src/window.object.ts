import { WindowController } from "./window"
import { WindowType, WinObject } from "./window.skeleton";
import { DialogObject } from "./window.dialog";
import { WIN } from "./window.alias";
import { Resizer, direction } from "./resizer";
import { Position } from "modules/position"
import * as barmenu from "./menu_windowbar";

import { WindowMenu, Menu } from "modules/menu";
import { RightMenu } from "modules/rightclick";

export type WindowData = {
    title: string;
    resizable: boolean;
    menu?: Menu[];
    fileOpen?: ((data:string, page:ShadowRoot)=>void) | null;
}

export class WindowObject extends WinObject {
    protected _contentPage: HTMLElement;
    protected _modal: WinObject | null = null;
    protected _modalev: Event | null = null;
    protected programName: string | null = null;
    private _favicon!: HTMLImageElement;
    protected resizers: Array<Resizer> = new Array(8);
    protected _maximized: boolean = false;
    private _openAction: ((data:string, page:ShadowRoot)=>void) | null = null;
    constructor(winName: string) {
        super(winName, WindowType.Window, WindowController.Get().view);
        this._contentPage = this.target.getElementsByClassName("window-content")[0] as HTMLElement;
        let menubar = this.target.getElementsByClassName("window-menu")[0];
        let winDir;
        try {
            const nameIndex=winName.lastIndexOf("/");
            this.programName=winName.substring(nameIndex+1);
            winDir = require(`__src__/window/${winName}/${this.programName}.ts`).default as WindowData;
            if(winDir === null){
                throw("WindowData requires title and resizable keys. Check your (programname).ts file.");
            }
            if (winDir.menu && menubar !== null) {
                menubar.appendChild(WindowMenu(winDir.menu));
            }
            if(winDir.resizable===true){
                this.target.prepend(this.WinCon.resizerView.cloneNode(true));
                this.SetResizers();
                this.windowBar.getElementsByClassName("title-maximize")[0].addEventListener("click", this.Maximize, false);
                this.windowBar.addEventListener("dblclick", this.Maximize, false);
            }
            else{
                const max=this.windowBar.getElementsByClassName("title-maximize")
                if(max!==null)
                    max[0].remove();
            }
            if(winDir.fileOpen){
                this._openAction=winDir.fileOpen;
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
    public SetResizers(){
        this._resizable = true;
        this.resizers[0] = new Resizer(this.target.getElementsByClassName("window-resize-n")[0] as HTMLElement, this.target, direction.north);
        this.resizers[1] = new Resizer(this.target.getElementsByClassName("window-resize-s")[0] as HTMLElement, this.target, direction.south);
        this.resizers[2] = new Resizer(this.target.getElementsByClassName("window-resize-e")[0] as HTMLElement, this.target, direction.east);
        this.resizers[3] = new Resizer(this.target.getElementsByClassName("window-resize-w")[0] as HTMLElement, this.target, direction.west);
        this.resizers[4] = new Resizer(this.target.getElementsByClassName("window-resize-ne")[0] as HTMLElement, this.target, direction.ne);
        this.resizers[5] = new Resizer(this.target.getElementsByClassName("window-resize-se")[0] as HTMLElement, this.target, direction.se);
        this.resizers[6] = new Resizer(this.target.getElementsByClassName("window-resize-nw")[0] as HTMLElement, this.target, direction.nw);
        this.resizers[7] = new Resizer(this.target.getElementsByClassName("window-resize-sw")[0] as HTMLElement, this.target, direction.sw);
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
    public OpenFile = (data:string)=>{
        if(this._openAction)
            this._openAction(data, this.contentPage.shadowRoot!);
    }

    public Maximize = () => {
        if (this.PositionData === null) {
            this.PositionData = new Position(this.target.clientWidth, this.target.clientHeight, this.target.offsetTop, this.target.offsetLeft);
            this.target.style.width = "100%";
            this.target.style.height = "100%";
            this.target.style.top = "0";
            this.target.style.left = "0";
            for(let i=0;i<8;i++){
                if(!this.resizers[i]) continue;
                this.resizers[i].self.style.display="none";
            }
            this._maximized=true;
        }
        else {
            this.PositionData.SetStyle(this.target);
            this.PositionData = null;
            for(let i=0;i<8;i++){
                if(!this.resizers[i]) continue;
                this.resizers[i].self.style.display="block";
            }
            this._maximized=false;
        }
        this._resizable = !this.resizable;
    }

    /* Note: recommend to use ONLY in window template scripts */
    public static Now(): WindowObject { return WindowController.Get().ActiveWindow as WindowObject; }
    public get maximized(): boolean { return this._maximized; }
    public get contentPage(): HTMLElement { return this._contentPage; }
    public get modal(): WinObject | null { return this._modal; }
    public set modal(value: WinObject | null) { this._modal = value; }
    public get modalev(): Event | null { return this._modalev; }
    public set modalev(value: Event | null) { this._modalev = value; }
    public get favicon(): HTMLImageElement { return this._favicon; }
}