//file hierachy module.
const test={"a":"b", "c":"d"}
export type FileTree={
    parent:FileTree|null;
    name:string;
    children:Array<FileTree>|null;
    isDirectory:boolean;
}
//change this the way, whatever you want.
export const Drive=ParseTree({
    "C:":
        {
        "Program Filez":GetFiles(require.context('__src__/window/',true,/index\.html$/).keys(),"exe","system"),
        "System42":GetFiles(require.context('__src__/window/system/',true,/index\.html$/).keys(),"exe"),
        "Users":{
            "Admin":{},
            "localhost":{
                "Documents":{},
                "Videos":{},
                "Images":GetFiles(require.context('__src__/resource/backgrounds',false,/.*(\.jpg)$/).keys(),"jpg")
            }
        }
    },
    "D:":{}
}, "file:\\");

function ParseTree(inputs:string|object|null, dirname:string, parent:FileTree|null=null):FileTree{
    let TreeRoot:FileTree;
    TreeRoot={
        parent: parent,
        name: dirname,
        children: new Array<FileTree>(),
        isDirectory: true
    }
    const input=inputs as {[index:string]:string|object|null}
    if(input){
        TreeRoot.children=Object.keys(input).reduce((acc:Array<FileTree>, name:string)=>{
            if(input[name]!==null && typeof input[name]!=="string"){
                acc.push(ParseTree(input[name],name,TreeRoot));
            }
            else{
                const childTree:FileTree={
                    parent:TreeRoot,
                    name: name,
                    children: null,
                    isDirectory: false
                }
                acc.push(childTree);
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
function GetFiles(list:Array<string>,extension:string, exclude?:string):Object|null{
    let value={};
    try{
        if(exclude){
            const excludeLength=exclude.length;
            list=list.filter(str=>str.substring(0,str.lastIndexOf("/")).slice(-excludeLength)!==exclude);
        }
        if(extension==="exe"){
            list=list.map(f=>f=f.replace(/\/index\.html$/,"")+".exe");
        }
        value=list.reduce((acc:any, name)=>{
            const realName=name.substring(2); //remove "./"
            acc[realName]=null;
            return acc;
        },{});
    }
    catch(err){
        console.error(err);
        return null;
    }
    return value;
}