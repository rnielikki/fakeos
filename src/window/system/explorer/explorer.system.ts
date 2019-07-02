import { WindowObject } from "__lib__/index";
import { FileTree, Drive, __system, __userdir } from "__lib__/modules/hierachy";
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
    (function(){
        thisMenuUp.addEventListener("click",()=>Render(dirPath.parent,thisStatus.innerText.replace(/[^\\]*\\$/,"")));
        thisMenu.querySelector(".explorer-menu-root")!.addEventListener("click",()=>Render(Drive,""));
        thisMenu.querySelector(".explorer-menu-userdir")!.addEventListener("click",()=>Render(__userdir));
    })();
    console.log(dirPath);
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
                    const getMime=GetMime(fileName.substring(lastIndex+1));
                    realName=fileName.substring(0,lastIndex);
                    const program=getMime[0] || ((currentPath==__system)?"system/":"")+realName;
                    action=()=>{ let w=new WindowObject(program); (getMime[1] && child.fileInfo!.data)?w.OpenFile(getMime[1](child.fileInfo!.data)):0; };
                    iconName=(currentPath==__system)?"fakeos":program;
                }
                const icon=new IconObject(realName, action, child.name, iconName, controller);
                //this changes real name in the file tree
                icon.labelObject.addEventListener("focusout", ()=>{
                    child.name=icon.labelObject.innerText;
                });
            }
        }
    }
    function GetMime(extension:string):[string | null, ((src:string)=>string|HTMLElement) | null]{
        switch(extension){
            case "jpg":
            case "png":
                return ["default/paint",(src)=>{ let img=document.createElement("img"); img.src=src; return img; }];
            case "txt":
                return ["default/notepad", (src)=>src.replace(/\n/g,"&#13;&#10;")];
            default:
                return [null, null];
        }
    }
}