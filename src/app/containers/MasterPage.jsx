import React from 'react';

class MasterPage extends React.Component {

	constructor(props) {
		super(props);
	}

	navigate(path){
		if(path === 'back'){
			window.history.back();
		}
	}

	render() {
		return (
			<div>
				<div className="sfa-viewport">
					<div className="sfa-actionbar">
						<span className="sfa-actionbar-title">
							<span className="sfa-display-table">
								<span className="sfa-table-cell"><img src="img/actionbar_coke_logo.png" className="sfa-coke-logo" /></span>
							</span>
						</span>
						<span className="pull-left sfa-welcome">Hello Richa</span>
						<button className="pull-left sfa-btn"><span className="sfa-icon sfa-icon-chatter"></span><span className="sfa-notification"></span></button>
						<button className="pull-left sfa-btn"><span className="sfa-icon sfa-icon-camera"></span></button>
						<button className="pull-left sfa-btn"><span className="sfa-icon sfa-icon-mail"></span><span className="sfa-notification"></span></button>
						<span className="pull-right sfa-utility">
							<span className="pull-left sfa-time">
								<span>04:21 p.m</span>
							</span>
							<span className="pull-left sfa-date">
								<span className="sfa-calendar">
									<span className="sfa-week">Thu</span>
									<span className="sfa-month">Apr</span>
								</span>
								<span className="sfa-day">30</span>
							</span>
							<button className="pull-left sfa-btn sfa-weather" onClick={this.navigate('welcome')}>
								<span>25°C</span> <span className="sfa-icon"><img src="img/weather/white/01d.png" /></span>
							</button>
						</span>
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
}

export default MasterPage