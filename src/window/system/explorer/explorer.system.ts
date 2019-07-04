import { FileTree, Drive, __system, __userdir } from "__lib__/modules/hierachy";
import { ExplorerController } from "./icon.system";
import { DialogObject, WIN, IconObject, WindowObject } from "__lib__/index";
export default function(target:WindowObject, dirPath:FileTree=Drive, dirName?:string){
    const thisBody=target.contentPage.shadowRoot!.querySelector(".explorer-wrap");
    const thisMenu=thisBody!.querySelector(".explorer-head");
    if(!thisMenu) return;
    const [thisMenuUp, thisStatus]=[thisMenu.querySelector(".explorer-menu-up"), thisMenu.querySelector(".explorer-head-state")];
    const attachTarget:HTMLElement=thisBody!.querySelector(".explorer-body") as HTMLElement;
    if(attachTarget===null) return;
    const controller:ExplorerController = new ExplorerController(attachTarget);
    if(!dirName){    
        (function(){
            thisMenuUp.addEventListener("click",()=>Render(dirPath.parent,thisStatus.innerText.replace(/[^\\]*\\$/,"")));
            thisMenu.querySelector(".explorer-menu-root")!.addEventListener("click",()=>Render(Drive,""));
            thisMenu.querySelector(".explorer-menu-userdir")!.addEventListener("click",()=>Render(__userdir!.path, __userdir!.label));
        })();
    }
    Render(dirPath, dirName || "");
    //Change IconObject to set the target.
    function Render(currentPath:FileTree|null, resetStatus:string|null=null){
        if(currentPath===null) return;
        dirPath=currentPath;
        if(currentPath.children===null) return;
        //remove hidden file
        const children=currentPath.children.filter((ftree:FileTree)=>ftree.name[0]!=="_");
        if(!children) return;
        const len=children.length;
        if(resetStatus!==null){
            thisStatus.innerText=resetStatus;
        }
        controller.iconCount=0;
        attachTarget.textContent="";
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
                    iconName=(currentPath===Drive)?"drive":"folder";
                }
                else{
                    const fileName=child.fileInfo.realName;
                    const lastIndex=fileName.lastIndexOf(".");
                    realName=fileName.substring(0,lastIndex);
                    const program=GetMime(fileName.substring(lastIndex+1)) || ((currentPath==__system!.path)?"system/":"")+realName;
                    action=()=>{ let w=new WindowObject(program); (child.fileInfo!.data)?w.OpenFile(child.fileInfo!.data):0; };
                    iconName=(currentPath==__system!.path)?"fakeos":program;
                }
                const icon=new IconObject(realName, action, child.name, iconName, controller);
                //this changes real name in the file tree
                icon.labelObject.addEventListener("focusout", ()=>{
                    child.name=icon.labelObject.innerText;
                });
            }
        }
    }
    function GetMime(extension:string):string | null {
        switch(extension){
            case "jpg":
            case "png":
                return "default/imgview";
            case "txt":
                return "default/notepad";
            default:
                return null;
        }
    }
}