import React from 'react';
import cx from "classnames";
import menu from '../Components/IMarketMenu'
import Slider from 'react-slick';
import DashboardService from '../services/Dashboard'
import { browserHistory } from 'react-router';

class Dashboard extends React.Component {

	navigate(path) {
		if (path === 'back') {
			window.history.back();
		}
		else {
			browserHistory.push('/' + path);
		}
	}

	getMetricsdata(period) {
		let me = this;
		this.period = period;
		DashboardService.getKpiData(period).then(function (data) {
			me.setState({ kpiData: data });
		});
	}

	constructor(props) {
		super(props);
		this.period = 'Monthly';
		this.state = {
			kpiData: [],
		}
		this.getMetricsdata(this.period);
	}

	render() {
		let settings = {
			infinite: false,
			speed: 500,
			slidesToShow: 4,
			slidesToScroll: 4,
			className: "sfa-row-50 sfa-custom-kpiRow",
			arrows: false
		};

		let kpiBlocks = this.state.kpiData.map((block, index) => {
			return (
				<div key={block.Id} data-index={index} className="pull-left sfa-grid-padding sfa-col-25">
					<div className="sfa-panel">
						<div className="sfa-panel-header">
							<span className="sfa-panel-title">{block.ebMobile__Description__c}</span>
						</div>
						<div className="sfa-panel-body">
							<span className="sfa-text-block sfa-kpi-percentage">Achieved: <span className="sfa-font-bold">{block.ebMobile__Achieved__c}</span>%</span>
							<span className="sfa-text-block sfa-kpi-growth-rate sfa-increase"><span className="sfa-icon sfa-icon-increase"></span> <span className="sfa-font-bold">15</span>%</span>
							<span className="sfa-text-block sfa-kpi-target">Target: <span className="sfa-font-bold">{block.ebMobile__Target__c}</span></span>
							<span className="sfa-display-table">
								<span className="sfa-table-cell sfa-kpi-actual">
									<span className="sfa-text-block sfa-font-numeric sfa-text-red">{block.ebMobile__Value__c}</span>Actual
									</span>
							</span>
						</div>
					</div>
				</div>
			);
		});

		return (
			<div className="sfa-layout sfa-with-side-nav">
				{menu}
				<div className="sfa-top-nav">
					<span className="pull-left">
						<button className="pull-left sfa-btn sfa-btn-red sfa-btn-prev" onClick={this.navigate}><span className="sfa-icon sfa-icon-prev"></span> <span>Back</span></button>
						<button onClick={this.getMetricsdata.bind(this, 'Daily')} className={cx('pull-left sfa-btn', { 'sfa-active': this.period == 'Daily' })}><span>DTD</span></button>
						<button onClick={this.getMetricsdata.bind(this, 'Weekly')} className={cx('pull-left sfa-btn', { 'sfa-active': this.period == 'Weekly' })}><span>WTD</span></button>
						<button onClick={this.getMetricsdata.bind(this, 'Monthly')} className={cx('pull-left sfa-btn', { 'sfa-active': this.period == 'Monthly' })}><span>MTD</span></button>
						<button onClick={this.getMetricsdata.bind(this, 'Yearly')} className={cx('pull-left sfa-btn', { 'sfa-active': this.period == 'Yearly' })}><span>YTD</span></button>
						<button className="pull-left sfa-btn sfa-btn-left-gap"><span>Time Gone 60%</span></button>
					</span>
					<span className="pull-right">
						<button className="pull-left sfa-btn" onClick={this.navigate}><span>Sales Forecast</span></button>
						<button className="pull-right sfa-btn sfa-btn-red sfa-btn-next" onClick={this.navigate.bind(this, 'route-plan')}><span>Route Plan</span> <span className="sfa-icon sfa-icon-next"></span></button>
					</span>
				</div>
				<div className="sfa-grid">
					{
						this.state.kpiData.length > 0 ? <Slider {...settings}>
							{kpiBlocks}
						</Slider> : null
					}
					<div className="sfa-row-50">
						<div className="pull-left sfa-grid-padding sfa-col-50">
							<div className="sfa-panel">
								<div className="sfa-panel-header">
									<span className="sfa-panel-title">Volume / Revenue</span>
									<button className="sfa-btn sfa-btn-r"><span className="sfa-icon sfa-icon-link"></span></button>
								</div>
							</div>
						</div>
						<div className="pull-left sfa-grid-padding sfa-col-50">
							<div className="sfa-panel">
								<div className="sfa-panel-header">
									<span className="sfa-panel-title">Execution Score</span>
									<button className="sfa-btn sfa-btn-r"><span className="sfa-icon sfa-icon-link"></span></button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}
export default Dashboard