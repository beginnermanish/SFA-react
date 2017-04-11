import React from 'react';
import cx from "classnames";
import common from '../Utils/common'
import menu from '../Components/IMarketMenu'
import routePlanService from '../services/RoutePlan'
import { browserHistory } from 'react-router';

class RoutePlan extends React.Component {

    init() {
        var me = this
        routePlanService.getDayCustomers().then(function (data) {
            console.log(data);
            me.setState({ events: data });
        })
    }

    constructor(props) {
        super(props);
        this.state = { events: [], messages: [] };
    }

    componentDidMount() {
        this.init();
    }

    changeView(){
    }

    render() {
        return (
            <div className="sfa-layout sfa-with-side-nav">
                {menu}
                <div className="sfa-top-nav">
                    <span className="pull-left">
                        <button className="pull-left sfa-btn sfa-btn-red sfa-btn-prev" onClick={common.back}><span className="sfa-icon sfa-icon-prev"></span> <span>Back</span></button>
                        <button className="pull-left sfa-btn sfa-active" onClick={this.changeView}><span>Day</span></button>
                        <button className="pull-left sfa-btn" onClick={this.changeView}><span>Week</span></button>
                        <button className="pull-left sfa-btn" onClick={this.changeView}><span>Map</span></button>
                    </span>
                    <span className="pull-right">
                        <button className="pull-left sfa-btn" onClick={this.changeView}><span>Day Summary</span></button>
                        <button className="pull-right sfa-btn sfa-btn-red sfa-btn-next" onClick={this.changeView}><span>Start Call</span> <span className="sfa-icon sfa-icon-next"></span></button>
                    </span>
                </div>
                <div className="sfa-grid sfa-grid-with-toolbar">
                    <div className="sfa-grid-toolbar sfa-grid-padding">
                        <div className="sfa-grid-toolbar-panel">
                            <ul>
                                <li>
                                    <button className="sfa-btn" onClick={this.changeView}>
                                        <span className="sfa-icon sfa-icon-ar-collection"></span>
                                        <span className="sfa-ellipsis-2">Collection</span>
                                    </button>
                                </li>
                                <li>
                                    <button className="sfa-btn" onClick={this.changeView}>
                                        <span className="sfa-icon sfa-icon-customer-phone-order"></span>
                                        <span className="sfa-ellipsis-2">Place Order</span>
                                    </button>
                                </li>
                                <li>
                                    <button className="sfa-btn" onClick={this.changeView}>
                                        <span className="sfa-icon sfa-icon-customer-asset"></span>
                                        <span className="sfa-ellipsis-2">CDE</span>
                                    </button>
                                </li>
                                <li>
                                    <button className="sfa-btn" onClick={this.changeView}>
                                        <span className="sfa-icon sfa-icon-customer-dashboard"></span>
                                        <span className="sfa-ellipsis-2">Dashboard</span>
                                    </button>
                                </li>
                                <li>
                                    <button className="sfa-btn" onClick={this.changeView()}>
                                        <span className="sfa-icon sfa-icon-customer-profile"></span>
                                        <span className="sfa-ellipsis-2">Profile</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="pull-left sfa-grid-padding sfa-col-30">
                        <div className="sfa-panel sfa-route-plan">
                            <div className="sfa-panel-header">
                                <span className="sfa-panel-title">Plan <span className="sfa-font-sm">(20/40)</span></span>
                                <button className="sfa-btn sfa-btn-plain sfa-btn-l" onClick={this.changeView}><span className="sfa-icon sfa-icon-edit-call"></span></button>
                                <button className="sfa-btn sfa-btn-plain sfa-btn-r" onClick={this.changeView}><span className="sfa-icon sfa-icon-add-call"></span></button>
                            </div>
                            <div className="sfa-search">
                                <span className="sfa-form-control">
                                    <input className="sfa-text-input" type="text" maxLength="50" placeholder="Code/Name/Address" />
                                    <span className="sfa-btn sfa-btn-search"><span className="sfa-icon sfa-icon-search"></span></span>
                                    <button className="sfa-btn sfa-btn-clear"><span className="sfa-icon sfa-icon-delete"></span></button>
                                </span>
                            </div>
                            <div className="sfa-panel-body">
                                <ul className="sfa-list-view">
                                    <li>
                                        <a href="#" className="sfa-media">
                                            <span className="sfa-text-block sfa-font-sm">
                                                <span className="pull-left sfa-font-italic">Added</span>
                                            </span>
                                            <span className="sfa-text-block sfa-ellipsis">
                                                Club-P.E.Deep Sea Angling
										</span>
                                            <span className="sfa-font-md"><span className="pull-left">Order Call</span> <span className="pull-right">Unplanned</span></span>
                                            <span className="sfa-icon"></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="sfa-media sfa-visited">
                                            <span className="sfa-text-block sfa-font-sm">
                                                <span className="pull-left sfa-font-italic">09:00</span>
                                            </span>
                                            <span className="sfa-text-block sfa-ellipsis">
                                                Erica Girls Primary-SSD
										</span>
                                            <span className="sfa-font-md"><span className="pull-left">Order Call</span></span>
                                            <span className="sfa-icon"></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="sfa-media sfa-visited">
                                            <span className="sfa-text-block sfa-font-sm">
                                                <span className="pull-left sfa-font-italic">09:35</span>
                                            </span>
                                            <span className="sfa-text-block sfa-ellipsis">
                                                Laersk.Morewag-SSD
										</span>
                                            <span className="sfa-font-md"><span className="pull-left">Customer Visit</span></span>
                                            <span className="sfa-icon"></span>
                                        </a>
                                    </li>
                                    <li className="sfa-active">
                                        <a href="#" className="sfa-media">
                                            <span className="sfa-text-block sfa-font-sm">
                                                <span className="pull-left sfa-font-italic">10:15</span>
                                            </span>
                                            <span className="sfa-text-block sfa-ellipsis">
                                                Andrew Rabie Tuck Shop
										</span>
                                            <span className="sfa-font-md"><span className="pull-left">Customer Visit</span></span>
                                            <span className="sfa-icon"></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="sfa-media sfa-muted">
                                            <span className="sfa-text-block sfa-font-sm">
                                                <span className="pull-left sfa-font-italic">10:55</span>
                                            </span>
                                            <span className="sfa-text-block sfa-ellipsis">
                                                Club-Westview Sports Club-SSD
										</span>
                                            <span className="sfa-font-md"><span className="pull-left">Customer Visit</span></span>
                                            <span className="sfa-icon"></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="sfa-media sfa-muted">
                                            <span className="sfa-text-block sfa-font-sm">
                                                <span className="pull-left sfa-font-italic">11:30</span>
                                            </span>
                                            <span className="sfa-text-block sfa-ellipsis">
                                                Club-Wedgewood Catering-SSD
										</span>
                                            <span className="sfa-font-md"><span className="pull-left">Order Call</span></span>
                                            <span className="sfa-icon"></span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="pull-left sfa-grid-padding sfa-col-70">
                        <div className="sfa-panel sfa-route-plan-customer-info">
                            <div className="sfa-panel-header">
                                <span className="sfa-panel-title">Customer Info</span>
                            </div>
                            <div className="sfa-panel-body">
                                <div className="sfa-route-plan-customer-info-detail">
                                    <div className="sfa-customer-image">
                                        <span className="sfa-percentage">
                                            <span className="sfa-font-sm">60.8%</span>
                                        </span>
                                        <button className="sfa-btn"><span className="sfa-icon sfa-icon-camera"></span></button>
                                        <img src="assets/customer_image.jpg" />
                                    </div>
                                    <div className="sfa-customer-title sfa-ellipsis-2">Andrew Rabie Tuck Shop Andrew Rabie Tuck Shop Andrew Rabie Tuck Shop Andrew Rabie Tuck Shop Andrew Rabie Tuck Shop Andrew Rabie Tuck Shop Andrew Rabie Tuck Shop </div>
                                    <div className="sfa-grid">
                                        <div className="pull-left sfa-col-50">
                                            <div className="sfa-text-block">Segment: GOLD</div>
                                            <div className="sfa-text-block">CXX0 123 456 789</div>
                                            <div className="sfa-text-block sfa-ellipsis-3">Aragon Road Adcickvale Port Elizabeth, Frash Street, No.500, Room 9870A, 002255</div>
                                        </div>
                                        <div className="pull-left sfa-col-50">
                                            <div className="sfa-text-block">White Clinton</div>
                                            <div className="sfa-text-block">Sales Manager</div>
                                            <div className="sfa-text-block">136 2645 6341</div>
                                            <div className="sfa-text-block">01 1256 5486</div>
                                            <div className="sfa-text-block"><a href="mailto:white.clinton500@hotmail.com">white.clinton500@hotmail.com</a></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sfa-tab-group">
                                    <button className="pull-left sfa-btn sfa-active" onClick={this.changeView}><span className="sfa-icon sfa-icon-order"></span> <span>Order</span></button>
                                    <button className="pull-left sfa-btn" onClick={this.changeView}><span className="sfa-icon sfa-icon-equipments"></span> <span>CDE Order</span></button>
                                    <button className="pull-left sfa-btn" onClick={this.changeView}><span className="sfa-icon sfa-icon-note"></span> <span>Note</span></button>
                                    <button className="pull-left sfa-btn" onClick={this.changeView}><span className="sfa-icon sfa-icon-issue"></span> <span>Issue</span></button>
                                    <button className="pull-left sfa-btn" onClick={this.changeView}><span className="sfa-icon sfa-icon-order"></span> <span>OpenAR</span></button>
                                </div>
                                <div className="sfa-tab-content">
                                    <ul className="sfa-list-view">
                                        <li className="sfa-display-table">
                                            <span className="text-center sfa-table-cell sfa-col-18"><span className="sfa-date"><span className="sfa-font-md">02</span><span className="sfa-font-sm">Jan 2015</span></span></span>
                                            <span className="text-left sfa-table-cell sfa-col-18">10 CS<br />$25.00</span>
                                            <span className="text-left sfa-table-cell sfa-col-28">Order No:<br />1213468982</span>
                                            <span className="text-left sfa-table-cell sfa-col-18"><span className="sfa-font-italic sfa-font-sm">Confirmed</span></span>
                                            <span className="text-left sfa-table-cell sfa-col-18"><span className="sfa-font-italic sfa-font-sm">by Sean</span></span>
                                        </li>
                                        <li className="sfa-display-table">
                                            <span className="text-center sfa-table-cell sfa-col-18"><span className="sfa-date"><span className="sfa-font-md">06</span><span className="sfa-font-sm">Jan 2015</span></span></span>
                                            <span className="text-left sfa-table-cell sfa-col-18">20 CS<br />$50.00</span>
                                            <span className="text-left sfa-table-cell sfa-col-28">Order No:<br />1213123485</span>
                                            <span className="text-left sfa-table-cell sfa-col-18"><span className="sfa-font-italic sfa-font-sm">Cancelled</span></span>
                                            <span className="text-left sfa-table-cell sfa-col-18"><span className="sfa-font-italic sfa-font-sm">by Frank</span></span>
                                        </li>
                                        <li className="sfa-display-table">
                                            <span className="text-center sfa-table-cell sfa-col-18"><span className="sfa-date"><span className="sfa-font-md">09</span><span className="sfa-font-sm">Jan 2015</span></span></span>
                                            <span className="text-left sfa-table-cell sfa-col-18">15 CS<br />$27.50</span>
                                            <span className="text-left sfa-table-cell sfa-col-28">Order No:<br />1456789299</span>
                                            <span className="text-left sfa-table-cell sfa-col-18"><span className="sfa-font-italic sfa-font-sm">Confirmed</span></span>
                                            <span className="text-left sfa-table-cell sfa-col-18"><span className="sfa-font-italic sfa-font-sm">by Dave</span></span>
                                        </li>
                                        <li className="sfa-display-table">
                                            <span className="text-center sfa-table-cell sfa-col-18"><span className="sfa-date"><span className="sfa-font-md">11</span><span className="sfa-font-sm">Jan 2015</span></span></span>
                                            <span className="text-left sfa-table-cell sfa-col-18">5 CS<br />$12.50</span>
                                            <span className="text-left sfa-table-cell sfa-col-28">Order No:<br />1247836898</span>
                                            <span className="text-left sfa-table-cell sfa-col-18"><span className="sfa-font-italic sfa-font-sm">Delivered</span></span>
                                            <span className="text-left sfa-table-cell sfa-col-18"><span className="sfa-font-italic sfa-font-sm">by Sam</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RoutePlan;