import { RightMenu } from "modules/rightclick";
import { default as DesktopMenu } from "__src__/desktop/menu"

export class DesktopObject {
    private static This: DesktopObject;
    private _element: HTMLElement = document.createElement("div"); // new div for event target!
    private constructor() {
        this._element.classList.add("desktop");
        document.body.appendChild(this._element);
        new RightMenu(this._element, DesktopMenu);
    }
    public static Get() {
        if (!DesktopObject.This)
            DesktopObject.This = new DesktopObject();
        return DesktopObject.This;
    }
}