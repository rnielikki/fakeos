import { DialogObject, WIN, WindowData } from "__lib__/index";
const app:WindowData = {
    title: "Noname - paint",
    resizable: true,
    menu: [{
            name: "File",
            menu:[{
                name:"Open",
                action:()=>{
                    new DialogObject("Error", "There're no text file to open. please run as administrator.", [["I am already a boss", WIN.Close]]);
                }
            },
            {
                name:"Save",
                action:()=>{
                    new DialogObject("Error", "Disk space is not sufficient. Please delete anything to save.", [["I won't", WIN.Close]]);
                }
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
                    new DialogObject("About", "A broken basic system paint.\nMade by FakeOS.\nNew Feature: You can draw a text.\nBut save is not supported", [["WTF?", WIN.Close]]);   
                }
            }]
        }]
}
export default app;