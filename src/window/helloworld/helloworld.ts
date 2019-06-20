import { DialogObject, WindowObject, WIN } from "__lib__/index";

export default {
    title: "hello world program",
    menu: [
        {
            name: "Menu1",
            menu: [
                {
                    name: "Change Text",
                    action: function (e: Event) {
                        const innerP = WindowObject.Now()!.contentPage.shadowRoot!.childNodes[1] as HTMLElement;
                        if (innerP) {
                            innerP.innerHTML="lol";
                        }
                        else {
                            new DialogObject("I say", "Where did the index page go? oops!", [["OK", WIN.Close]]);
                        }
                    }
                },
                {
                    name: "Submenu2",
                    action: () => {
                        WindowObject.Now()!.SetContent("page2")
                    }
                },
                {
                    name: "Open new",
                    action: () => new WindowObject("helloworld")
                },
                {
                    name: "Save",
                    menu: [
                        {
                            name: "Save",
                            action: () => new DialogObject("I say", "Saved", [["OK", WIN.Close]])
                        },
                        {
                            name: "Save As",
                            action: () => new DialogObject("I say", "Save As not supported :P", [["OK", WIN.Close]])
                        }
                    ]
                },
                {
                    name: "Exit",
                    action: (e: Event) => {
                        new DialogObject("See ya!", "Bye!", [["OK", WIN.CloseAll]])
                    }
                }
            ]
        },
        {
            name: "Menu2",
            menu: [
                {
                    name: "Lol",
                    action: () => new DialogObject("Error", "No such user", [["OK", WIN.Close]])
                },
                {
                    name: "..."
                }
            ]
        }
    ]
};