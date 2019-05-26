import { Copyable } from "modules/copyable";
import { WindowObject } from "components/window/src/window";
import { RightMenu } from "modules/rightclick"
import { docHeight } from "modules/position";
import * as iconMenu from "./menu_icon";


export class IconController {
    private _view: DocumentFragment = document.createDocumentFragment();
    private _selected: IconObject | null = null;
    private _lastselect: IconObject | null = null;
    private static _this: IconController;
    private static _iconMargin: number = 105;
    public static iconCount: number = 0;
    private static _iconPerCol: number;
    private constructor() {
        const parser = new DOMParser();
        const parsedIcon = parser.parseFromString(require(`../icon.html`), "text/html").body;
        if (parsedIcon.firstChild) {
            this.view.appendChild(parsedIcon.firstChild);
        }
        IconController._iconPerCol = Math.floor(docHeight / IconController.iconMargin);
        document.addEventListener("mousedown", this.UnSelectIcon);
        //docheight change
        window.addEventListener("resize", () => IconController._iconPerCol = Math.floor(docHeight / IconController.iconMargin));
    }
    public static Get() {
        if (!IconController._this) IconController._this = new IconController();
        return this._this;
    }
    public SelectIcon = (target: IconObject) => {
        if (this._selected !== null) this.UnSelectIcon();
        target.target.classList.add("icon-selected");
        this._selected = target;
        this._lastselect = target;
    }
    public UnSelectIcon = () => {
        if (this._selected === null) return;
        this._selected.target.classList.remove("icon-selected");
        this._selected.target.style.backgroundColor = "";
        this._selected = null;
    }
    public get view(): DocumentFragment { return this._view; }
    public get selected() { return this._selected; }
    public get lastselect() { return this._lastselect; }
    public static get iconMargin(): number { return this._iconMargin; }
    public static get iconPerCol(): number { return this._iconPerCol; }
}
export class IconObject extends Copyable {
    private _icon!: HTMLImageElement;
    labelObject: HTMLElement;
    constructor(iconName: string, Action?: (() => void) | null, iconLabel?: string, iconPicName?: string) {
        super(IconController.Get().view);
        this.target.addEventListener("mousedown", this.Register, false);
        this.labelObject = this.target.getElementsByClassName("icon-label")[0] as HTMLElement;
        this.setName(iconLabel || iconName);
        iconPicName ? this.setIcon(iconPicName, true) : this.setIcon(iconName);
        Action = !Action ? () => new WindowObject(iconName) : Action;
        this.target.addEventListener("dblclick", Action);
        this.target.addEventListener("mousedown", this.Select);
        this.SetPosition(Math.floor(IconController.iconCount / IconController.iconPerCol) * IconController.iconMargin, (IconController.iconCount % IconController.iconPerCol) * IconController.iconMargin);
        new RightMenu(this.target,iconMenu.default);
        IconController.iconCount++;
    }
    setIcon(iconName: string, custom: boolean = false) {
        let favicon;
        try {
            if (custom) {
                favicon = require(`__src__/resource/icons/${iconName}.png`);
            }
            else {
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
        IconController.iconCount--;
    }
    private Select = (e?: Event) => {
        IconController.Get().SelectIcon(this);
        if(e) e.stopPropagation();
    }
    public get icon() { return this._icon; }
}