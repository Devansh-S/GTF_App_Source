import React, {Component} from 'react';
import './cBtn.scss';


class cBtn extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <div className="dropdown">
                <button className="dropbtn">{this.props.BtnName}</button>
                    <div className="dropdown-content">
                        {this.props.Layers.map(layer => {
                            return <p name={layer.name}>{layer.name}</p>
                        })}
                    </div>
            </div>
        )
    }
}

export default cBtn;