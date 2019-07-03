import { docWidth, docHeight } from "modules/position";
import { WinObject } from "./window.skeleton";
import { WindowObject, WindowData } from "./window.object";
import { DialogObject } from "./window.dialog";
import { WIN } from "./window.alias";

export {
    WinObject,
    WindowObject,
    DialogObject,
    WIN,
    WindowData
}
export class WindowController {
    private _Windows: WinObject[] = new Array(); //order by recently selected
    private static _this: WindowController | undefined;
    private _view: DocumentFragment = document.createDocumentFragment();
    private _dialogView: DocumentFragment = document.createDocumentFragment();
    private _resizerView: DocumentFragment = document.createDocumentFragment();
    private _ActiveWindow: WinObject | null = null;
    private _LastActive: WinObject | null = null;
    private _next: IterableIterator<number> = this.nextPos();

    private constructor() {
        //Init
        const parser = new DOMParser();
        const parsedWin = parser.parseFromString(require(`../window.html`), "text/html").body;
        const parsedDialog = parser.parseFromString(require(`../dialog.html`), "text/html").body;
        const parsedResizers = parser.parseFromString(require(`../resizer.html`), "text/html").body;
        if (parsedWin.firstChild) {
            this.view.appendChild(parsedWin.firstChild);
        }
        if (parsedDialog.firstChild) {
            this.dialogView.appendChild(parsedDialog.firstChild);
        }
        if (parsedResizers.firstChild) {
            [...parsedResizers.children].forEach((resizer)=>this._resizerView.appendChild(resizer));
        }
        //Event Listener
        document.body.addEventListener("mousedown",()=>this.FocusOutWindow(),true);
        window.addEventListener("resize", function () {
            WindowController.Get().Windows.filter(obj => parseInt(obj.target.style.left || "0") > docWidth).forEach((obj) => obj.target.style.left = docWidth.toString() + "px");
            WindowController.Get().Windows.filter(obj => parseInt(obj.target.style.top || "0") > docHeight).forEach((obj) => obj.target.style.top = docHeight.toString() + "px");
        });
    }
    public static Get() {
        if (!WindowController._this) WindowController._this = new WindowController();
        return WindowController._this;
    }
    public AddWindow(target: WinObject) {
        this.Windows.push(target);
        target.SetOrder(this.Windows.length + 1);
        this.FocusOnWindow(target);
        document.body.dispatchEvent(target.OpenEvent);
    }
    public RemoveWindow(target: WinObject) {
        if (this.ActiveWindow !== target) this.FocusOnWindow(target);
        target.target.remove();
        const len = this.Windows.length;
        this.Windows.splice(this.Windows.indexOf(target), 1);
        if (len > 0) {
            this.FocusOnWindow(this.SortedWindow()[len - 1]);
        }
        this.FocusOutWindow();
        document.body.dispatchEvent(target.CloseEvent);
    }
    public FocusOnWindow(target: WinObject | null) {
        if (this.ActiveWindow === target) return;
        if(this._ActiveWindow) this.FocusOutWindow();
        this._ActiveWindow = target;
        if (target) {
            //recent selection
            const sorted = this.SortedWindow();
            const index = sorted.indexOf(target);
            if(index!==-1){
                sorted.slice(index).map(obj => obj.SetOrder(obj.order - 1));
                target.SetOrder(this.Windows.length + 1);
            }
            let selection:HTMLElement;
            if (target instanceof WindowObject && target.modal) {
                this.FocusOnWindow(target.modal);
                selection = target.modal.target;
            }
            else {
                this._ActiveWindow!.target.classList.add("window-active");
                selection = target.target;
            }
            //editing some bug after closed
            //if (document.activeElement !== selection) selection.focus();
            this._LastActive = target;
            document.body.dispatchEvent(target.FocusOnEvent);
        }
    }
    public FocusOutWindow(target: WinObject | null = this._ActiveWindow) {
        if (!this._ActiveWindow || (this._ActiveWindow !== target && this._ActiveWindow instanceof WindowObject && this._ActiveWindow.modal !== target)) return;
        this._ActiveWindow.target.classList.remove("window-active");
        document.body.dispatchEvent(this._ActiveWindow.FocusOutEvent);
        this._ActiveWindow = null;
    }
    public ChangeWindow(target: WinObject | null) {
        this.FocusOutWindow();
        this.FocusOnWindow(target);
    }
    public SortedWindow = () => this.Windows.sort((obj1, obj2) => obj1.order - obj2.order);
    //getters
    public get view() { return this._view; }
    public get dialogView() { return this._dialogView; }
    public get resizerView() { return this._resizerView; }
    public get ActiveWindow() { return this._ActiveWindow; }
    public get Windows() { return this._Windows; }
    public get LastActive() { return this._LastActive; }
    public *nextPos() {
        let _nextPos = 0;
        while (true) {
            for (; _nextPos < docHeight - 300; _nextPos += 30) {
                yield _nextPos;
            }
            _nextPos = this.Windows.length * 2;
        }
    }
    public get next() { return this._next; }
}