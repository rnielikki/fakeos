import { WindowObject, DialogObject, WIN } from "__lib__/index";

export default [{
    name: "Start!",
    action: () => new DialogObject("no settings!", "yeap", [["ok", WIN.Close]])
},
{
    name: "Change the BG!",
    action: () => new WindowObject("system/background",false)
}]