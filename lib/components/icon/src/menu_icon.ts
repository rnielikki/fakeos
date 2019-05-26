import { IconController } from "./icon";

export default[
    {
        name:"change name",
        action:()=>{
            const sel=IconController.Get().lastselect;
            //if(sel) sel.setName("hello, world!");
            if(sel) sel.EditMode();
        }
    },
    {
        name:"delete",
        action:()=>{
            const sel=IconController.Get().lastselect;
            if(sel) sel.Remove();
        }
    }
]