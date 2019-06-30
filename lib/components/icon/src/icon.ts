import { Copyable } from "modules/copyable";
import { WindowObject } from "components/window/src/window";
import { RightMenu } from "modules/rightclick"
import { docHeight } from "modules/position";
import * as iconMenu from "./menu_icon";

export class IconController {
    private static _view: DocumentFragment = document.createDocumentFragment();
    protected _background:HTMLElement;
    protected _selected: IconObject | null;
    protected static _lastselect: IconObject | null;
    private static _this: IconController;
    private static _iconMargin: number = 105;
    public iconCount: number;
    private static _iconPerCol: number;
    protected static parsedIcon = (new DOMParser()).parseFromString(require(`../icon.html`), "text/html").body.firstChild;
    protected constructor(background:HTMLElement=document.body) {
        this._background=background;
        this._selected=null;
        IconController._lastselect=null;
        this.iconCount=0;
    }
    //if "sealed"(or final) method is implemented in typescript, we'll make it "sealed".
    public static Get() {
        if (!IconController._this){
            IconController._this = new IconController();
            IconController._this.Init();            
        }
        return this._this;
    }
    private Init(){
        IconController._iconPerCol = Math.floor(docHeight / IconController.iconMargin);
        if(IconController.parsedIcon!=null)
            IconController.view.appendChild(IconController.parsedIcon);
        document.addEventListener("mousedown", this.UnSelectIcon);
        window.addEventListener("resize", () => IconController._iconPerCol = Math.floor(docHeight / IconController.iconMargin)); //docheight change
    }
    public SelectIcon = (target: IconObject) => {
        if (this._selected !== null) this.UnSelectIcon();
        target.target.classList.add("icon-selected");
        this._selected = target;
        IconController._lastselect = target;
    }
    public UnSelectIcon = () => {
        if (this._selected === null) return;
        this._selected.target.classList.remove("icon-selected");
        this._selected.target.style.backgroundColor = "";
        this._selected = null;
    }
    public DefaultPosition = ():[number, number] => {
        return [Math.floor(this.iconCount / IconController.iconPerCol) * IconController.iconMargin, (this.iconCount % IconController.iconPerCol) * IconController.iconMargin];
    }
    public static get view(): DocumentFragment { return this._view; }
    public get selected() { return this._selected; }
    public static get lastselect() { return IconController._lastselect; }
    public get background(){ return this._background; }
    public static get iconMargin(): number { return this._iconMargin; }
    public static get iconPerCol(): number { return this._iconPerCol; }
}
export class IconObject extends Copyable {
    private _icon!: HTMLImageElement;
    labelObject: HTMLElement;
    private controller: IconController;
    constructor(iconName: string, Action?: (() => void) | null, iconLabel?: string, iconPicName?: string, controller=IconController.Get()) {
        super(IconController.view, controller.background);
        this.controller=controller;
        this.target.addEventListener("mousedown", this.Register, false);
        this.labelObject = this.target.getElementsByClassName("icon-label")[0] as HTMLElement;
        this.setName(iconLabel || iconName);
        iconPicName ? this.setIcon(iconPicName, true) : this.setIcon(iconName);
        Action = !Action ? () => new WindowObject(iconName) : Action;
        this.target.addEventListener("dblclick", Action);
        this.target.addEventListener("mousedown", this.Select);
        if(controller===IconController.Get()){
            this.SetPosition(...controller.DefaultPosition());
        }
        new RightMenu(this.target,iconMenu.default);
        controller.iconCount++;
    }
    setIcon(iconName: string, custom: boolean = false) {
        let favicon;
        try {
            if (custom) {
                try{
                    favicon = require(`__src__/resource/icons/${iconName}.png`);   
                }
                catch{
                    getIcon(iconName);
                }
            }
            else {
                getIcon(iconName);
            }
            function getIcon(iconName:string){
                try {
                    favicon = require(`__src__/window/${iconName}/favicon.png`);
                }
                catch{
                    favicon = require(`__src__/resource/default_icon.png`);
                }
            }
        }
        catch{ //default fallback
            favicon = require(`__src__/resource/default_icon.png`);
        }
        finally {
            let img = this.target.getElementsByClassName("icon-img")[0] as HTMLImageElement;
            if (!img) {
                img = document.createElement("img");
                img.src = favicon;
                this.target.prepend(img);
            }
            else {
                img.src = favicon;
            }
            this._icon = img;
        }
    }
    public EditMode(){
        this.labelObject.contentEditable="true";
        this.Select();
        this.labelObject.focus();
        const before=this.labelObject.innerText;
        this.labelObject.addEventListener("focusout", ()=>{
            this.setName(this.labelObject.innerText || before);
            this.labelObject.contentEditable="false";
        } ,{once:true});
    }
    public setName(text:string){
        this.labelObject.innerText=text;
    }
    public Remove=()=>{
        this.target.remove();
        this.controller.iconCount--;
    }
    private Select = (e?: Event) => {
        this.controller.SelectIcon(this);
        if(e) e.stopPropagation();
    }
    public get icon() { return this._icon; }
}