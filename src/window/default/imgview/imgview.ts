import { DialogObject, WIN, WindowController, WindowData } from "__lib__/index";
const rotateRegex=new RegExp(/(?<=rotate\()-?\d+(?=deg\))/i);
const app:WindowData= {
    title: "Image Viewer",
    resizable: false,
    menu: [{
            name: "Options",
            menu:[{
                name:"Turn...",
                menu:[{
                    name:"Left",
                    action:()=>{
                        Transform("rotate",rotateRegex,-90);
                    }
                },
                {
                    name:"Right",
                    action:()=>{
                        Transform("rotate",rotateRegex,90);
                    }
                },
                {   name:"180deg",
                    action:()=>{
                        Transform("rotate",rotateRegex,180);
                    }
                },
                {
                    name:"360deg",
                    action:()=>{} //nothing happened
                }]
            },
            {
                name:"Flip...",
                menu:[{
                    name: "Horizontal",
                    action:()=>{
                        Transform("scaleX",/(?<=scaleX\()-?\d+(?=\))/i, -1, (n)=>-n);
                    }
                },
                {
                    name: "Vertical",
                    action:()=>{
                        Transform("scaleY",/(?<=scaleY\()-?\d+(?=\))/i, -1, (n)=>-n);
                    }
                }]
            },
            {
                name:"Exit",
                action:()=>WIN.CloseAll()
            }]
        },
        {
            name: "Help",
            menu:[{
                name:"About",
                action:()=>{
                    new DialogObject("About", "Image viewer. Text view not supported", [["Ok", WIN.Close]]);   
                }
            },
            {
                name:"Bug report",
                action:()=>{
                    new DialogObject("Alert", "It's not a bug. it's a feature.", [["What?", WIN.Close]]);
                }
            }]
        }]
}
export default app;
const Transform=(type:string, regex:RegExp, amount:number, calculate:((n:number)=>number)|null=null)=>{
    const win:HTMLElement=WindowController.Get().LastActive!.target;
    const transformState:string=win.style.transform || "";
    let getVal=transformState.match(regex);
    if(transformState && getVal!==null){
        let value=(calculate)?calculate(amount):(parseInt(getVal[0],10)+amount);
        win.style.transform=transformState.replace(regex,(value).toString());
    }
    else{
        switch(type){
            case "rotate":
                win.style.transform+=`rotate(${amount}deg)`;
                break;
            default:
                win.style.transform+=`${type}(${amount})`;
                break;    
        }
    }
}