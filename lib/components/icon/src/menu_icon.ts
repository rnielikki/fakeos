import { IconController } from "./icon";
export default[
    {
        name:"change name",
        action:()=>{
            const sel=IconController.lastselect;
            //if(sel) sel.SetName("hello, world!");
            if(sel) sel.EditMode();
        }
    },
    {
        name:"delete",
        action:()=>{
            const sel=IconController.lastselect;
            if(sel) sel.Remove();
        }
    }
]