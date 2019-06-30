import { IconController } from "__lib__/components/icon/src/icon";
export class ExplorerController extends IconController{
    public constructor(background:HTMLElement){
        super(background);
    }
    public static Get(){
        console.error("ExplorerController.Get() method returns IconController.\nIf you want IconController, Please use IconController.Get() directly.\nSince ExplorerController is not private, you can directly assign the controller.");
        return super.Get();
    }
    /*
    public DefaultPosition = ():number => {
        return Math.floor(this.iconCount / IconController.iconPerCol) * IconController.iconMargin, (this.iconCount % IconController.iconPerCol) * IconController.iconMargin;
    }
     */
}