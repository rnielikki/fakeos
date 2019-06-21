import { DialogObject, WIN } from "__lib__/index";
export default {
    title: "Noname - notepad",
    menu: [{
            name: "File",
            menu:[{
                name:"Open",
                action:()=>{
                    new DialogObject("Error", "There're no text file to read. please run as administrator.", [["I am already a boss", WIN.Close]]);
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
                    new DialogObject("About", "A broken basic system notepad.\nMade by FakeOS.\nNew Feature: You can draw ASCII Art.\nBut save is not supported", [["WTF?", WIN.Close]]);   
                }
            }]
        }]
}