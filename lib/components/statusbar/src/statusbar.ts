import { WindowStatus } from "./windowbar";
import { StartMenu } from "./startmenu"

export class StatusBarObject {
    element: HTMLElement;

    //startBg: HTMLElement;
    clock: HTMLElement;
    private static _this: StatusBarObject;
    private constructor() {
        //init
        const parser = new DOMParser();
        const parsed = parser.parseFromString(require(`../statusbar.html`), "text/html").body;
        //StatusBarObject.Set(parsed.firstChild as HTMLElement);
        this.element = parsed.firstChild as HTMLElement;
        if (parsed.firstChild)
            document.body.appendChild(parsed.firstChild);
        StartMenu.Set(this.element.getElementsByClassName("statusbar-startbutton")[0] as HTMLElement);
        this.clock = this.element.getElementsByClassName("statusbar-clock")[0] as HTMLElement;
        WindowStatus.Set(this.element.getElementsByClassName("statusbar-window")[0] as HTMLElement);
        this.SetClock();
    }
    static Set(): void {
        if (!StatusBarObject._this) {
            StatusBarObject._this = new StatusBarObject();
        }
    }
    static Get(): StatusBarObject | null {
        if (StatusBarObject._this) return StatusBarObject._this;
        else return null;
    }
    SetClock = () => {
        setInterval(() => this.clock.innerText = new Date().toLocaleTimeString(), 1000);
    }
}