/* list of components and modules */
/* if you add components or modules with css, please add to index.scss too */
import { WindowObject, WindowController, DialogObject, WIN } from 'components/window/src/window';
import { StatusBarObject } from 'components/statusbar/src/statusbar';
import { IconObject } from 'components/icon/src/icon';
import { DesktopObject } from 'components/desktop/src/desktop';
import { RightMenu } from 'modules/rightclick';
import * as Init from 'modules/init/entry.init';
export {
  WindowObject,
  WindowController,
  DialogObject,
  WIN,
  StatusBarObject,
  IconObject,
  RightMenu,
  DesktopObject,
};
Init.default();
/* css
  just remember to add! */
require(`./index.scss`);