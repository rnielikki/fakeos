export enum MenuDirection { up, down, upLeft, downLeft };
export type Menu={
    name:string;
    action?:()=>void;
    menu?:Menu[];
}
export class PrimaryMenu {
    public static ActiveMenu: PrimaryMenu | null = null;
    protected menu: Menu[];
    protected _div: HTMLElement | null = null;
    protected appendTarget: HTMLElement = document.body;
    protected primaryDivClass: string[] = [];
    constructor(menu: Menu[]) {
        this.menu = menu;
    }
    protected ShowMenu = (e?: Event, left?: number, top?: number, direction?: MenuDirection): void => {
        if (PrimaryMenu.ActiveMenu)
            PrimaryMenu.ActiveMenu.RemoveMenu();
        const div = document.createElement("div");
        this._div = div;
        this.primaryDivClass.push("menu-first");
        div.classList.add(...this.primaryDivClass);
        this.appendTarget.appendChild(div);
        div.appendChild(this.Build(this.menu));
        PrimaryMenu.ActiveMenu = this;

        //size must be calculated,
        if (left && top) {
            switch (direction) {
                case MenuDirection.upLeft:
                    left -= div.getBoundingClientRect().width;
                case MenuDirection.up:
                    top -= div.getBoundingClientRect().height;
                    break;
                case MenuDirection.downLeft:
                    left -= div.getBoundingClientRect().width;
                    break;
                default:
                    break;
            }
            div.style.left = left + "px";
            div.style.top = top + "px";
        }
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

    }
    public RemoveMenu = () => {
        if (this.div) this.div.remove();
        PrimaryMenu.ActiveMenu = null;
        this._div = null;
    }
    private Build(source: Menu[]): DocumentFragment {
        let frag = document.createDocumentFragment();
        this.BuildRecursion(source, frag);
        return frag;
    }
    private BuildRecursion(src: Menu[], parent: HTMLElement | DocumentFragment): void {
        if (!src) return;
        const it = src[Symbol.iterator]();
        let current;
        while (!current || !current.done) {
            current = it.next();
            if (!current.value || !current.value.name) continue;
            let elem = document.createElement("div");
            if (current.value.action) {
                elem.innerText = current.value.name;
                elem.classList.add("menu-selectable");
                elem.onclick = current.value.action;
            }
            else if (!current.value.menu) {
                elem.innerText = current.value.name;
                elem.classList.add("menu-disabled");
            }
            else {
                elem.classList.add("menu-wrapper");
            }
            if (current.value.menu) {
                let elem2 = document.createElement("div");
                let label = document.createElement("div");
                label.classList.add("menu-selectable");
                label.innerText = current.value.name;
                elem.appendChild(label);
                elem2.classList.add("menu-secondary");
                this.BuildRecursion(current.value.menu!, elem2);
                elem.appendChild(elem2);
            }
            parent.appendChild(elem);
        }
    }
    public get div() { return this._div; }
}
export class ClickMenu extends PrimaryMenu {
    constructor(menu: Menu[], btn: HTMLElement) {
        super(menu);
        this.appendTarget = btn.parentElement!;
        btn.addEventListener("click", this.ShowMenu);
    }
    public SetClassList(classList: string[]): void {
        this.primaryDivClass = classList;
    }
}