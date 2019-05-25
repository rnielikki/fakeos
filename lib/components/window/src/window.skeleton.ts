import { WindowController } from "./window"
import { Resizer, direction } from "./resizer";
import { Position } from "modules/position"
import { Copyable } from "modules/copyable";

export enum WindowType { Window, Dialog };

export abstract class WinObject extends Copyable {
    protected _windowBar: HTMLElement;
    protected _resizable: boolean;
    protected _winName: string; //program name
    protected _title: string = ""; //program title
    protected WinCon: WindowController = WindowController.Get();
    protected _minimized: boolean = false;
    protected _maximized: boolean = false;
    protected _order: number = 0;

    //Events
    public OpenEvent = new CustomEvent("winopen", { detail: this });
    public CloseEvent = new CustomEvent("winclose", { detail: this });
    public FocusOnEvent = new CustomEvent("winfocus", { detail: this });
    public FocusOutEvent = new CustomEvent("winfocusout", { detail: this });

    constructor(winName: string, resizable: boolean = true, wType: WindowType = WindowType.Window, Template: DocumentFragment = WindowController.Get().view) {
        super(Template);
        this._winName = winName;
        this._windowBar = this.target.getElementsByClassName("window-title")[0] as HTMLElement;
        this._resizable = resizable;
        this.Init(wType);
    }
    private Init(wType: WindowType) {
        //init resize buttons
        if (this.resizable) {
            new Resizer(this.target.getElementsByClassName("window-resize-n")[0] as HTMLElement, this.target, direction.north);
            new Resizer(this.target.getElementsByClassName("window-resize-s")[0] as HTMLElement, this.target, direction.south);
            new Resizer(this.target.getElementsByClassName("window-resize-e")[0] as HTMLElement, this.target, direction.east);
            new Resizer(this.target.getElementsByClassName("window-resize-w")[0] as HTMLElement, this.target, direction.west);
            new Resizer(this.target.getElementsByClassName("window-resize-ne")[0] as HTMLElement, this.target, direction.ne);
            new Resizer(this.target.getElementsByClassName("window-resize-se")[0] as HTMLElement, this.target, direction.se);
            new Resizer(this.target.getElementsByClassName("window-resize-nw")[0] as HTMLElement, this.target, direction.nw);
            new Resizer(this.target.getElementsByClassName("window-resize-sw")[0] as HTMLElement, this.target, direction.sw);
        }
        //init buttons
        if (wType !== WindowType.Dialog) {
            this.windowBar.getElementsByClassName("title-minimize")[0].addEventListener("mousedown", this.NoMove, false);
            this.windowBar.getElementsByClassName("title-maximize")[0].addEventListener("mousedown", this.NoMove, false);
            this.windowBar.getElementsByClassName("title-minimize")[0].addEventListener("click", this.Minimize, false);
            this.windowBar.getElementsByClassName("title-maximize")[0].addEventListener("click", this.Maximize, false);
            this.windowBar.addEventListener("dblclick", this.Maximize, false);
        }
        this.windowBar.getElementsByClassName("title-close")[0].addEventListener("mousedown", this.NoMove, false);
        this.windowBar.getElementsByClassName("title-close")[0].addEventListener("click", this.Close, false);
        //init windowbar
        this.windowBar.addEventListener("mousedown", this.Register, false);
        //active window
        this.target.addEventListener("focus", this.Select, true);
        this.target.addEventListener("focusout", this.UnSelect, true);
    }
    /////// ---- Initialization End, Always should be in the end of the derived class constructor ----- /////////
    protected EndInit = (): void => {
        //window
        this.WinCon.AddWindow(this);
        WindowController.Get().FocusOutWindow();
        this.Select();
    }
    public SetTitle = (title: string) => {
        this.windowBar.getElementsByTagName("span")[0].innerText = title;
        this._title=title;
    }
    /*buttons*/
    private NoMove = (e: Event) => e.stopPropagation();
    public Minimize = () => {
        this.target.style.display = "none";
        this._minimized = true;
        this.WinCon.FocusOutWindow(this);
    }
    public UnMinimize = () => {
        this.target.style.display = "flex";
        this._minimized = false;
        this.WinCon.ChangeWindow(this);
    }
    public Maximize = () => {
        if (this.PositionData === null) {
            this.PositionData = new Position(this.target.clientWidth, this.target.clientHeight, this.target.offsetTop, this.target.offsetLeft);
            this.target.style.width = "100%";
            this.target.style.height = "100%";
            this.target.style.top = "0";
            this.target.style.left = "0";
            this._maximized=true;
        }
        else {
            this.PositionData.SetStyle(this.target);
            this.PositionData = null;
            this._maximized=false;
        }
        this._resizable = !this.resizable;
    }
    public SetSize(width: number, height: number): void {
        this.target.style.width = width + "px";
        this.target.style.height = height + "px";
    }
    public SetOrder(order: number) {
        this.target.style.zIndex = order.toString();
        this.target.tabIndex = order;
        this._order = order;
    }
    public Close = (): void => {
        this.WinCon.RemoveWindow(this);
    }
    public Select = (e?: Event) => {
        this.WinCon.FocusOnWindow(this);
    }
    public UnSelect = (e?: Event) => {
        this.WinCon.FocusOutWindow(this);
    }
    //getter
    public get winName(): string { return this._winName; }
    public get windowBar(): HTMLElement { return this._windowBar; }
    public get minimized(): boolean { return this._minimized; }
    public get maximized(): boolean { return this._maximized; }
    public get title():string { return this._title; }
    public get resizable(): boolean { return this._resizable; }
    public get order(): number { return this._order; }
}