import { ClickMenu } from "modules/menu";

export class StartMenu extends ClickMenu {
    private static _this: StartMenu;
    private _btn: HTMLElement
    constructor(btn: HTMLElement) {
        const statusMenu = require(`__src__/statusbar/menu.ts`).default;
        super(statusMenu, btn);
        this._btn = btn;
        this.primaryDivClass = ["statusbar-startmenu"];
    }
    static Set(btn: HTMLElement): void {
        if (!StartMenu._this) {
            StartMenu._this = new StartMenu(btn);
        }
    }
    static Get(): StartMenu | null {
        if (StartMenu._this) return StartMenu._this;
        else return null;
    }
}