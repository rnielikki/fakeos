//file hierachy module.
export type FileTree={
    parent:FileTree|null;
    name:string;
    children:Array<FileTree> | null;
    fileInfo:FileInfo | null;
}
export type FileInfo={
    realName:string; //remembers real require path to load
    data:string | null;//file open with data will be added
}
//change this the way, whatever you want.
export const Drive=ParseTree({
    "C:":
        {
        "Program Filez":GetFiles(require.context('__src__/window/',true,/index\.html$/),"exe","system"),
        "System42":GetFiles(require.context('__src__/window/system/',true,/index\.html$/),"exe"),
        "Users":{
            "Admin":{},
            "localhost":{
                "Documents":{
                        'readme.txt':require('!!text-loader!__root__/readme.md'),
                        'about_backgrounds.txt':require('__src__/resource/backgrounds/LICENSE.txt'),
                        'license.txt':require('!!text-loader!__root__/LICENSE')
                    },
                "Videos":{},
                "Images":GetFiles(require.context('__src__/resource/backgrounds',false,/.*(\.jpg)$/),"jpg")
            }
        }
    },
    "D:":{}
}, "file:\\");
export const [__system, __userdir]=[FromAbsolutePath(["C:","System42"]), FromAbsolutePath(["C:","Users","localhost"])];
function ParseTree(inputs:string|object|null, dirname:string, parent:FileTree|null=null):FileTree{
    let TreeRoot:FileTree;
    TreeRoot={
        parent: parent,
        name: dirname,
        children: new Array<FileTree>(),
        fileInfo: null
    }
    const input=inputs as {[index:string]:string|object|null}
    if(input){
        TreeRoot.children=Object.keys(input).reduce((acc:Array<FileTree>, name:string)=>{
            const inputName=input[name];
            if(inputName!==null && typeof inputName!=="string"){
                acc.push(ParseTree(inputName,name,TreeRoot));
            }
            else{
                const childTree:FileTree={
                    parent:TreeRoot,
                    name: name,
                    children: null,
                    fileInfo: {
                        realName: name,
                        data: inputName as string
                    }
                }    
                //this is part for program filez subdirectories.
                if(name.indexOf("/")!==-1){
                    const inputIndex=name.indexOf("/");
                    const inputDir=name.substring(0,inputIndex);
                    const inputFile=name.substring(inputIndex+1);
                    let parentDir:FileTree=acc.filter(a=>a.name==inputDir)[0]
                    if(!parentDir){
                        parentDir={ parent:TreeRoot, name: inputDir, children: new Array<FileTree>(), fileInfo: null };
                        acc.push(parentDir);
                    } 
                    if(parentDir.children!==null){
                        childTree.name=inputFile;
                        parentDir.children.push(childTree);
                    }
                }
                else{                    
                    acc.push(childTree);
                }
            }
            return acc;
        },[]);
    }
    else{
        TreeRoot.children=null;
    }
    if(TreeRoot.children!.length==0) TreeRoot.children=null;
    return TreeRoot;
}
function GetFiles(context:__WebpackModuleApi.RequireContext,extension:string, exclude?:string):Object|null{
    let value={};
    let names=context.keys();
    let getData:(str:string)=>string|null;
    try{
        if(exclude){
            const excludeLength=exclude.length;
            names=names.filter(str=>str.match("^\.\/"+exclude+"\/")===null);
        }
        switch(extension){
            case "exe":
                names=names.map(f=>f=f.replace(/\/index\.html$/,"")+".exe");
                getData=()=>null; 
                break;
            case "jpg":
            case "png":
                getData=(str)=>context(str);
                break;
            default:
                getData=(str)=>str;
                break;
        }
        value=names.reduce((acc:any, name)=>{
            const realName=name.substring(2); //remove "./"
            acc[realName]=getData(name);
            return acc;
        },{});
    }
    catch(err){
        console.error(err);
        return null;
    }
    return value;
}
type Dir={path:FileTree; label:string;};
function FromAbsolutePath(pathList:string[]):Dir|null{
    let current:Dir={
        path:Drive,
        label:pathList.join("\\")+"\\"
    };
    const pathLen=pathList.length;
    for(let i=0;i<pathLen;i++){
        let c:Array<FileTree|string>|null=current.path!.children
        if(c===null) return null;
        current.path=c.filter(obj=>{
            return (obj as FileTree!==null && typeof obj!=="string")?obj.name==pathList[i]:false;
        })[0] as FileTree;
        if(current===null) return null;
    }
    return current;
}