import { WindowData, DialogObject, WIN, WindowController, WindowObject } from "__lib__/index";
import { FromAbsolutePath } from "__lib__/modules/hierachy";
import { default as system } from "./explorer.system";
const app: WindowData = {
    title: "XPlorer!",
    resizable: true,
    fileOpen: (src: string, page: ShadowRoot) => {
        const res = FromAbsolutePath(src);
        if (res === null) {
            new DialogObject("404", "I think it's wrong path...", [["OK..?", WIN.Close]]);
        }
        else {
            //this sets everything up from first. so it takes time...
            let thisWin=WindowController.Get().ActiveWindow! as WindowObject;
            system(thisWin, res.path, res.label);
        }
    }
}
export default app;