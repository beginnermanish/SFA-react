import React from 'react';

class LoginSettings extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="sfa-panel sfa-popup sfa-login-settings" >
				<div className="sfa-panel-header">
					<span className="sfa-panel-title">Settings</span>
				</div>
				<div className="sfa-panel-body">
					<div className="sfa-form-control">
						<span className="sfa-label">Connection:</span>
						<select className="sfa-combo-box">
							<option>Production</option>
							<option>Sandbox</option>
						</select>
					</div>
					<div className="sfa-form-control">
						<span className="sfa-label">IP&nbsp;:</span>
						<input type="text" className="sfa-text-input" value="192.168.2.125" placeholder="" />
					</div>
					<div className="sfa-form-control">
						<span className="sfa-label">Port:</span>
						<input type="text" className="sfa-text-input" value="8081" placeholder="" />
					</div>
				</div>
				<div className="text-right sfa-panel-footer">
					<button className="sfa-btn sfa-btn-l"><span>Reset</span></button>
					<button className="sfa-btn" onclick="javascript:window.location.href='login.html'"><span className="sfa-icon sfa-icon-popup-ok"></span></button>
					<button className="sfa-btn" onclick="javascript:window.location.href='login.html'"><span className="sfa-icon sfa-icon-popup-close"></span></button>
				</div>
			</div>
		);
	}

}

export default LoginSettings