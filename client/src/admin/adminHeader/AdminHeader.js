import React, {Component} from "react";
import logo from "../../logo.svg";
import "./AdminHeader.css";

class adminHeader extends Component {
    componentDidMount() {}

    render() {
        return (
            <div className="adminHeader">
                <header className="adminHeader-header">
                    <img src={logo} className="adminHeader-logo" alt="logo"/>
                    <h1 className="adminHeader-title">Rejestrator Czasu Pracy Sacewicz</h1>
                </header>
            </div>

        );
    }
}

export default adminHeader;
