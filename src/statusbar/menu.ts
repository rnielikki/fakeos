import { WindowObject, DialogObject, WindowController, Menu } from "__lib__/index";
import { GetMenu, FromAbsolutePath } from "__lib__/modules/hierachy"

const startMenu:Menu[]= [
    {
        name: "Programs",
        menu: GetMenu(FromAbsolutePath("C:\\Program Filez\\")!.path)
    },
    {
        name: "Logout",
        action: () => new DialogObject("Error", "You are not logged in", [["OK", () => WindowController.Get().ActiveWindow!.Close()]], null)
    },
    {
        name: "Turn Off",
    }
]
export default startMenu;