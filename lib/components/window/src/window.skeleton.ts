import { WindowController, DialogObject } from "./window"
import { Copyable } from "modules/copyable";

export enum WindowType { Window, Dialog };

export abstract class WinObject extends Copyable {
    protected _windowBar: HTMLElement;
    protected _resizable: boolean;
    protected _winName: string; //program name
    protected _title: string = ""; //program title
    protected WinCon: WindowController = WindowController.Get();
    protected _minimized: boolean = false;
    protected _order: number = 0;

    //Events
    public OpenEvent = new CustomEvent("winopen", { detail: this });
    public CloseEvent = new CustomEvent("winclose", { detail: this });
    public FocusOnEvent = new CustomEvent("winfocus", { detail: this });
    public FocusOutEvent = new CustomEvent("winfocusout", { detail: this });

    constructor(winName: string, wType: WindowType = WindowType.Window, Template: DocumentFragment = WindowController.Get().view) {
        super(Template);
        this._winName = winName;
        this._windowBar = this.target.getElementsByClassName("window-title")[0] as HTMLElement;
        this._resizable = false;
        this.Init(wType);
    }
    private Init(wType: WindowType) {
        //init buttons
        if (wType !== WindowType.Dialog) {
            this.windowBar.getElementsByClassName("title-minimize")[0].addEventListener("mousedown", this.NoMove, false);
            this.windowBar.getElementsByClassName("title-maximize")[0].addEventListener("mousedown", this.NoMove, false);
            this.windowBar.getElementsByClassName("title-minimize")[0].addEventListener("click", this.Minimize, false);
        }
        this.windowBar.getElementsByClassName("title-close")[0].addEventListener("mousedown", this.NoMove, false);
        this.windowBar.getElementsByClassName("title-close")[0].addEventListener("click", this.Close, false);
        //init windowbar
        this.windowBar.addEventListener("mousedown", this.Register, false);
        //active window
        this.target.addEventListener("mousedown", this.Select, true);
    }
    /////// ---- Initialization End, Always should be in the end of the derived class constructor ----- /////////
    protected EndInit = (): void => {
        //window
        this.WinCon.AddWindow(this);
        //WindowController.Get().FocusOutWindow();
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
    public SetSize(width: number, height: number): void {
        this.target.style.width = width + "px";
        this.target.style.height = height + "px";
    }
    public SetOrder(order: number) {
        this.target.style.zIndex = order.toString();
        this._order = order;
    }
    public Close = (): void => {
        this.WinCon.RemoveWindow(this);
        if(this instanceof DialogObject){
            const dialog=this as DialogObject;
            if(dialog.modal) dialog.modal.RemoveModal();
            if (dialog.parent) {
                dialog.parent.modal = null;
                WindowController.Get().ChangeWindow(this.parent);
            }
        }
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
    public get title():string { return this._title; }
    public get resizable(): boolean { return this._resizable; }
    public get order(): number { return this._order; }
}