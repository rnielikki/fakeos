import { IconController } from "__lib__/components/icon/src/icon";
import { Menu } from "__lib__/modules/menu";
export class ExplorerController extends IconController{
    public iconCount:number=0;
    protected static _iconMenu:Menu[]=[
        {
            name:"change name",
            action:()=>{
                const sel=IconController.lastselect;
                //if(sel) sel.SetName("hello, world!");
                if(sel) sel.EditMode();
            }
        }
    ];
    public constructor(background:HTMLElement){
        super(background);
    }
    public static Get(){
        console.error("ExplorerController.Get() method returns IconController.\nIf you want IconController, Please use IconController.Get() directly.\nSince ExplorerController is not private, you can directly assign the controller.");
        return super.Get();
    }
    //note: Currently we have obsolete "position changing" method here now without "absolute" position, because the icon class structure is inherited: movable > copyable > IconObject.
    //TODO: so this should be changed in the future by allowing icon movement or removing the event listener. any ideas?
    /*public DefaultPosition = ():[number, number] => {
        return [(this.iconCount % IconController.iconPerCol) * IconController.iconMargin,Math.floor(this.iconCount / IconController.iconPerCol) * IconController.iconMargin];
    }*/
    public get iconMenu():Menu[] { return ExplorerController._iconMenu; }
}