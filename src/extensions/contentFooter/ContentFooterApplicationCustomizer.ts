import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

import * as strings from 'ContentFooterApplicationCustomizerStrings';

const LOG_SOURCE: string = 'ContentFooterApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IContentFooterApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ContentFooterApplicationCustomizer
  extends BaseApplicationCustomizer<IContentFooterApplicationCustomizerProperties> {

  inDom = (selector, callback, timeout = 1000) => {
      const interval = setInterval(() => {
          const elem = document.querySelector(selector);
          if (elem) {
              clearInterval(interval);
              // Do stuff
              callback()
          } else {
              console.log('Not in dom')
          }
      }, timeout);
  };

  appendFooter = () => {
    const content = document.querySelector('#spPageCanvasContent');
    if(content){
      const footerExists = document.querySelector('.custom-footer');
      if(!footerExists){
        const footer = document.createElement('div');
        footer.innerHTML = '<p class="custom-footer">I am Chandima</p>';
        content.appendChild(footer);

        // use footer element to render the react app here
        // ReactDOM.render(footer, <App />);
      }
    }
  }

  listener = (args) => {
    console.log(args);
    this.inDom('#spPageCanvasContent', this.appendFooter);
  }
  event = null;


  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.inDom('#spPageCanvasContent', this.appendFooter);

    if(!(window as any)._footerEvent){
      this.context.application.navigatedEvent.add(this, this.listener);
      (window as any)._footerEvent = true;
    }
    

    return Promise.resolve();
  }

  @override
  public onDispose(){
    this.context.application.navigatedEvent.remove(this, this.listener);
  }
}
