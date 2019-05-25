import { PrimaryMenu } from "../menu";

export function InitMenu() {
    document.addEventListener("mousedown", (e:Event) => {
        if (PrimaryMenu.ActiveMenu) {
            const target:HTMLElement=(e as MouseEvent).target as HTMLElement;
            if(!target.classList.contains("menu-selectable") && !target.classList.contains("menu-disabled"))
            PrimaryMenu.ActiveMenu.RemoveMenu();
        }
    }, true);
    document.addEventListener("click", (e:Event) => {
        if (PrimaryMenu.ActiveMenu) {
            const target:HTMLElement=(e as MouseEvent).target as HTMLElement;
            if(!target.classList.contains("menu-selectable")) return;
            PrimaryMenu.ActiveMenu.RemoveMenu();
        }
    });
    //from rightclick.ts
    (function () {
        document.addEventListener("contextmenu", (e: Event) => e.preventDefault());
    })();
}