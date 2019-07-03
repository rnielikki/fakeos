import { WindowController } from "./window";
import { WindowObject } from "./window.object";
import { DialogObject } from "./window.dialog";
//aliases as statics
export class WIN {
    public static Minimize(): void {
        const LastActive=WindowController.Get().LastActive!;
        if(LastActive.minimized) return;
        WindowController.Get().LastActive!.Minimize();
    }
    public static UnMinimize(): void {
        const LastActive=WindowController.Get().LastActive!;
        if(!LastActive.minimized) return;
        LastActive.UnMinimize();
        LastActive.Select();
    }
    public static Maximize(): void {
        const LastActive=WindowController.Get().LastActive!;
        if(LastActive.minimized) this.UnMinimize();
        if(LastActive instanceof WindowObject && !LastActive.maximized) LastActive.Maximize();
        LastActive.Select();
    }
    public static Close(): void {
        WindowController.Get().ActiveWindow!.Close();
    }
    public static CloseAll(): void {
        const win=WindowController.Get().LastActive;
        if(win instanceof WindowObject){
            win.Close();
        }
        else if(win instanceof DialogObject){
            const dialog=win as DialogObject;
            if(dialog.parent){
                dialog.Close();
                dialog.parent.Close();
            }
            else{
                dialog.Close();
            }
        }
    }
}