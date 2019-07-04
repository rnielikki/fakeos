//let fakeos=require("fakeos");
import * as fakeos from "../lib/index";
window.onload = function () {
    Set();
}
function Set() {
    fakeos.StatusBarObject.Set();
    fakeos.DesktopObject.Get();
    new fakeos.IconObject("system/explorer",null,"My Computer","computer");
    new fakeos.IconObject("system/explorer",(()=>{ const n=new fakeos.WindowObject("system/explorer"); n.OpenFile("C:\\Users\\localhost"); }),"My Documents","folder");
    new fakeos.IconObject("helloworld", null, "hello world");
    new fakeos.IconObject("default/paint", null, "photoshop");
    new fakeos.IconObject("default/calculator", null, "matlab");
    new fakeos.IconObject("default/notepad", null, "visual studio code");
}