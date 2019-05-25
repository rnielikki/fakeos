import { WIN } from "./window";

export default [
    {
        name: "Minimize",
        action: ()=> WIN.Minimize()
    },
    {
        name: "Maximize",
        action: () => WIN.Maximize()
    },
    {
        name:"Close",
        action: ()=>WIN.CloseAll()
    }
];