import { PrimaryMenu, MenuDirection } from "modules/menu";

export class RightMenu extends PrimaryMenu {
    private _target: HTMLElement;
    private _direction: MenuDirection;
    constructor(target: HTMLElement, menu: any[], direction: MenuDirection = MenuDirection.down) {
        super(menu);
        this._target = target;
        this._direction = direction;
        this.primaryDivClass = ["menu-right", "menu-secondary"];
        target.addEventListener("contextmenu", this.RightMenu);
    }
    private RightMenu = (e: Event) => {
        if (e.currentTarget !== this.target) return;
        this.ShowMenu(e, (<MouseEvent>e).clientX, (<MouseEvent>e).clientY, this._direction);
    }
    public get target() { return this._target; }
}