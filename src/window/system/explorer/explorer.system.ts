import { WindowObject } from "__lib__/index";
import { FileTree, Drive } from "__lib__/modules/hierachy";
import { IconObject } from "__lib__/components/icon/src/icon";
import { ExplorerController } from "./icon.system";
import { DialogObject, WIN } from "../../../../lib/index";
export default function(target:WindowObject){
    const thisBody=target.contentPage.shadowRoot!.querySelector(".explorer-wrap");
    const thisMenu=thisBody!.querySelector(".explorer-head");
    if(!thisMenu) return;
    const [thisMenuUp, thisStatus]=[thisMenu.querySelector(".explorer-menu-up"), thisMenu.querySelector(".explorer-head-state")];
    const attachTarget:HTMLElement=thisBody!.querySelector(".explorer-body") as HTMLElement;
    if(attachTarget===null) return;
    const controller:ExplorerController = new ExplorerController(attachTarget);
    var dirPath:FileTree=Drive;
    const [__system, __userdir]=[FromAbsolutePath(["C:","System42"]), FromAbsolutePath(["C:","Users","localhost"])];
    (function(){
        thisMenuUp.addEventListener("click",()=>Render(dirPath.parent,thisStatus.innerText.replace(/[^\\]*\\$/,"")));
        thisMenu.querySelector(".explorer-menu-root")!.addEventListener("click",()=>Render(Drive,""));
        thisMenu.querySelector(".explorer-menu-userdir")!.addEventListener("click",()=>Render(FromAbsolutePath(["C:","Users","localhost"]),"C:\\Users\\localhost\\"))
    })();
    Render(dirPath);
    //Change IconObject to set the target.
    function Render(currentPath:FileTree|null, resetStatus:string|null=null){
        if(currentPath===null) return;
        dirPath=currentPath;
        const children=currentPath.children;
        if(children===null) return;
        const len=children.length;
        if(resetStatus!==null){
            thisStatus.innerText=resetStatus;
        }
        controller.iconCount=0;
        attachTarget.innerHTML="";
        for(let i=0;i<len;i++){
            let action:(() => void) | null;
            let child:FileTree=children[i];
            let realName:string; //without extension
            let iconName:string;
            realName=child.name;
            if(child!==null){
                if(child.fileInfo===null){
                    if(child.children!==null){
                        action=()=>{ 
                            thisStatus.innerText+=realName+"\\"; Render(child);
                        };
                    }
                    else{
                        action=()=>new DialogObject("Error", "Permission denied", [[":(", WIN.Close]]);
                    }
                    iconName=(currentPath===Drive)?"explorer/drive":"explorer/folder";
                }
                else{
                    const fileName=child.fileInfo.realName;
                    const lastIndex=fileName.lastIndexOf(".");
                    realName=fileName.substring(0,lastIndex);
                    const program=GetMime(fileName.substring(lastIndex+1)) || ((currentPath==__system)?"system/":"")+realName;
                    action=()=>new WindowObject(program);
                    iconName=program;
                }
                const icon=new IconObject(realName, action, child.name, iconName, controller);
                //this changes real name in the file tree
                icon.labelObject.addEventListener("focusout", ()=>{
                    child.name=icon.labelObject.innerText;
                });
            }
        }
    }
    function FromAbsolutePath(pathList:string[]):FileTree|null{
        let current:FileTree|null=Drive;
        const pathLen=pathList.length;
        for(let i=0;i<pathLen;i++){
            let c:Array<FileTree|string>|null=current!.children
            if(c===null) return null;
            current=c.filter(obj=>{
                return (obj as FileTree!==null && typeof obj!=="string")?obj.name==pathList[i]:false;
            })[0] as FileTree;
            if(current===null) return null;
        }
        return current;
    }
    function GetMime(extension:string):string{
        switch(extension){
            case "jpg":
            case "png":
                return "default/paint";
            case "txt":
                return "default/notepad";
            default:
                return "";
        }
    }
}