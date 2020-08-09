import React from "react";

export class SidePanel extends React.Component {

  render() {
    return (
        <div className='customization_Panel'>
            <input type="checkbox" id="sidepanel_toggle" />
            <div id="mySidepanel" className="sidepanel">
                
            </div>
            <label htmlFor="sidepanel_toggle">
              <div className='toggleBtn2'>
                <div className="vbar"></div>
              </div>
            </label>
        </div>
    );
  }
}

export default SidePanel;