# NOTE: THIS PROJECT WILL GO THROUGH REFACTORING.
-- Please wait. Pull requests may not be accepted until refactoring is done. --

## What is this?

Uh… It’s core engine of something like Windows 93 (which is not related to this). It has windows, icons, and status bar. Works fully on client side, you can add in your own work with only front-end supported page like github.io.

## What I need to develop/use this?

Editor, webpack, node.js and some packages. Typescript and SCSS.
JS and CSS for fake software development. All others are Typescript and SCSS.

## So… What’s the point of this?

Nothing. Maybe April joke?


# Common Rules

* File names must be case-insensitive. All file names are low characters.
*	__lib__ is library, __src__ is source folder.
  * At Webpack require, \_\_lib\_\_ is alias of lib folder and \_\_src\_\_ is alias of src folder.

## Structure
FakeOS is component-based program. As a developer, you can add any component or modules.
* __lib__
  * components 
  * modules
  * common.scss : global stylesheet. SCSS.
  * index.scss : stylesheet entry
  * index.ts : component/module entry
* __src__
  * see "For users" guide.

# For users
## src structure:
* index.ts : add default values when the program is loaded.
* (and each components directory)
* resource : resource directory
  * background.jpg
  * default_icon.png : If Icon files are broken, this is used as default. (mandatory)
  * icons : for custom icons, which can be implemented in future.
### About each components…
* desktop
  * menu.ts : right-click menu file, which exported by “export default”. See below to how to make menu. (mandatory)
* statusbar
  * menu.ts: way of writing is same as desktop menu, but it isn’t right-click but a start menu. (mandatory)
* window
  * They are (program group folder)/program. For example, you can make system/explorer or system/cmd.
  * In a program, it contains:
    * favicon.png (Not mandatory)
    * index.html (mandatory)
      *	You can make more custom html page to load.
    * *program_name*.css (mandatory)
    * *program_name*.js (Not mandatory)
    * *program_name*.ts (mandatory)
    ```typescript
    import { WindowData } from "__lib__/index";

     const app={
     title: “title name”,
     resizable: true|false,
     menu?: [menuObject], //optional, see menu structure section
     }
     export default app;
     ```
    * *program_name*.system.ts (only in "system" folder, not mandatory)
 
### libraries:
* new window for _new WindowObject(winName:string)_
 * This calls from "program info" file from src/window. (See above!)
* new dialog for _new DialogObject(winName: string, message: string, buttons: [string, () => void][], parent: WindowObject | null = WindowObject.Now())_
* new icon for _new IconObject(iconName: string, Action?: (() => void) | null, iconLabel?: string, iconPicName?: string, controller=IconController.Get())_
* new Right-click menu for _new RightMenu(target: HTMLElement, menu: any[], direction: MenuDirection = MenuDirection.down)_
* closing window for WIN.Close()
  * use WIN.CloseAll() instead for closing the dialog and its parent

### Menu structure
   ```typescript
    {
       name: “string”, //menu text to be shown
       action: ()=>void(), //don’t use only function name(like WIN.Close).
       menu: [ … ] //submenu, which contains “menu structure”
              //note: currently we support vmenu(vertical menu), but I don’t know if it’s useful.
   }
   ```
* menu is "Menu" type array. (Menu[])
* Since menu contains function, it cannot be a JSON. But if you want to make JSON, remember to change the action to string.
* If you’re not sure, see the example in the file.

# For developers
## Guide
* Remember to call every stylesheets to lib/index.scss after adding. And removing too.
 * You can call to lib/index.ts if you want. This can make code clean, if you call it often and the path is complicated.
What’s Component and what’s module
* Class and most method names are PascalCase. Fields and properties are either PascalCase or camelCase.
* Components are directly used by library user and contains main HTML or CSS Element template.
* Modules used by components. Even it contains CSS,
  * Module make and attach HTML Elements through the TS code.
* If not sure (rightclick.ts), if it doesn’t contain HTML/CSS element, go to module.
## Component Rules
* Main instantiable name and its skeleton ends with ”Object”
* Instantiable objects’ controller name is “NameController” and they’re singleton. (Exception: IconController is "protected" for Explorer)
* right click menu is menu_name.ts in src directory.
* If the component is a library (can called by library user), add to lib/index.js
* Component structures are:
  * (component).html (not always )
  * (component).css
  * src
    *	(component).ts
    * (can add more ts files here)

## TODO
* Please make more programs!
* Icon multiselect
* Recycle bin
* Sound feature
* If you found some bugs, please report/fix it!
* Make documentation web page <3

## Still not sure?
In the src directory, you can read some test codes and learn how to use.

__Issues tab is always open.__

If you want to commit something, just do it. If the code doesn't follow the rules, I can change it.
