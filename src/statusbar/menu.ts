import { WindowObject, DialogObject, WindowController } from "__lib__/index";

export default [
    {
        name: "Windows",
        menu: [
            {
                name: "Open new",
                action: function (e: Event) {
                    new WindowObject("helloworld");
                }
            }
        ]
    },
    {
        name: "Logout",
        action: () => new DialogObject("Error", "You are not logged in", [["OK", () => WindowController.Get().ActiveWindow!.Close()]], null)
    },
    {
        name: "Turn Off",
    }
]