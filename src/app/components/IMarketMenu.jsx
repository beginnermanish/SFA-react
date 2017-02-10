import React from 'react';

class IMarketMenu extends React.Component {
    render() {
        return (<div className="sfa-side-nav">
            <ul>
                <li>
                    <button className="sfa-btn">
                        <span className="sfa-icon sfa-icon-dashboard"></span>
                        <span>Dashboard</span>
                    </button>
                </li>
                <li>
                    <button className="sfa-btn">
                        <span className="sfa-icon sfa-icon-routes"></span>
                        <span>Routes</span>
                    </button>
                </li>
                <li>
                    <button className="sfa-btn">
                        <span className="sfa-icon sfa-icon-gallery"></span>
                        <span>Gallery</span>
                    </button>
                </li>
                <li>
                    <button className="sfa-btn">
                        <span className="sfa-icon sfa-icon-orders"></span>
                        <span>Orders</span>
                    </button>
                </li>
                <li>
                    <button className="sfa-btn">
                        <span className="sfa-icon sfa-icon-request"></span>
                        <span>Request</span>
                    </button>
                </li>
                <li>
                    <button className="sfa-btn">
                        <span className="sfa-icon sfa-icon-elearning"></span>
                        <span>e-Learning</span>
                    </button>
                </li>
                <li>
                    <button className="sfa-btn">
                        <span className="sfa-icon sfa-icon-sync"></span>
                        <span>Sync</span>
                    </button>
                </li>
                <li>
                    <button className="sfa-btn">
                        <span className="sfa-icon sfa-icon-profile"></span>
                        <span>Profile</span>
                    </button>
                </li>
            </ul>
        </div>
        );
    }
}
export default IMarketMenu