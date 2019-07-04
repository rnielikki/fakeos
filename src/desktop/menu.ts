import { WindowObject, DialogObject, WIN, IconObject } from "__lib__/index";

let counter_pic=0;
let counter_txt=0;
export default [{
    name: "Refresh all",
    action: () => {
        new DialogObject("Serious Question", "All of your settings will be gone. Is it OK?", [["OK", () => location.reload()], ["Cancel", WIN.Close]]);
    }
},
{
    name: "Make new...",
    menu: [{
        name: "Text File",
        action: () => new IconObject("default/notepad", null, `noname${++counter_txt}.txt`)
    }, {
        name: "Doodle File",
        action: () => new IconObject("default/paint", null, `untitled${++counter_pic}.png`)
    }]
}
    , {
    name: "Monitor Settings",
    action: () => new WindowObject("system/_monitor")
},
{
    name: "Change the BG!",
    action: () => new WindowObject("system/background")
}]