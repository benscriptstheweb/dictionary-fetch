import videojs from "video.js";

// Get the Component base class from Video.js
const Component = videojs.getComponent('Component');

class SettingsGroup extends Component {

  // The constructor of a component receives two arguments: the
  // player it will be associated with and an object of options.
  constructor(player) {

    // It is important to invoke the superclass before anything else, 
    // to get all the features of components out of the box!
    super(player);
  }

  // The `createEl` function of a component creates its DOM element.
  createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-settings-group'
    });
  }
}

Component.registerComponent('SettingsGroup', SettingsGroup);
export default SettingsGroup;