export enum MenuDirection { up, down, upLeft, downLeft };
export function build(source: any[]): DocumentFragment {
    let frag = document.createDocumentFragment();
    buildRecursion(source, frag);
    return frag;
}
function buildRecursion(src: any, parent: HTMLElement | DocumentFragment): void {
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
        else if (!current.value.menu && !current.value.vmenu) {
            elem.innerText = current.value.name;
            elem.classList.add("menu-disabled");
        }
        else {
            elem.classList.add("menu-wrapper");
        }
        if (current.value.menu || current.value.vmenu) {
            let elem2 = document.createElement("div");
            let label = document.createElement("div");
            label.classList.add("menu-selectable");
            label.innerText = current.value.name;
            elem.appendChild(label);
            elem2.classList.add("menu-secondary");
            if (current.value.vmenu) {
                elem2.classList.add("menu-secondary-vertical");
                buildRecursion(current.value.vmenu, elem2);
            }
            else {
                buildRecursion(current.value.menu, elem2);
            }
            elem.appendChild(elem2);
        }
        parent.appendChild(elem);
    }
}
export function WindowMenu(Menu: { name: string, action?: () => void, menu?: any }[]): DocumentFragment {
    const len = Menu.length;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < len; i++) {
        const wrap = document.createElement("div");
        const title = document.createElement("div");
        wrap.classList.add("menu-wrapper-primary");
        title.classList.add("menu-primary");
        title.innerText = Menu[i].name;
        wrap.appendChild(title);
        if (Menu[i].menu) {
            document.createElement("div");
            new ClickMenu(Menu[i].menu, title).SetClassList(["window-submenu", "menu-secondary"]);
        }
        frag.appendChild(wrap);
    }
    return frag;
}
export class PrimaryMenu {
    public static ActiveMenu: PrimaryMenu | null = null;
    protected menu: any[];
    protected _div: HTMLElement | null = null;
    protected appendTarget: HTMLElement = document.body;
    protected primaryDivClass: string[] = [];
    constructor(menu: any[]) {
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
        div.appendChild(build(this.menu));
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
    public get div() { return this._div; }
}
export class ClickMenu extends PrimaryMenu {
    constructor(menu: any[], btn: HTMLElement) {
        super(menu);
        this.appendTarget = btn.parentElement!;
        btn.addEventListener("click", this.ShowMenu);
    }
    public SetClassList(classList: string[]): void {
        this.primaryDivClass = classList;
    }
}