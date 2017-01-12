import React from 'react';
import { connect } from 'react-redux'
import * as action from '../Redux/actions'
import LoginSettings from '../Components/LoginSettings.jsx'
import ProgressView from '../Components/ProgressView.jsx'

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = { username: 'yen.5s@dev.com', password: 'eBest@2016', openSettings: false };
	}

	openSettingWindow() {
		this.setState({ openSettings: !this.state.openSettings });
	}

	onUNchange(e) {
		this.setState({ username: e.target.value });
	}

	onPWDchange(e) {
		this.setState({ password: e.target.value });
	}

	onLoginClick() {
		this.props.login(this.state.username, this.state.password, this.context);
	}

	render() {
		let logging = this.props.progress.isSpinner;
		return (
			<div>
				<div className="sfa-viewport">
					<div className="sfa-splash">
						<div className="sfa-login">
							<div className="sfa-grid">
								<div className="sfa-row-50 sfa-grid-padding">
									<div className="sfa-display-table">
										<div className="text-center sfa-table-cell">
											<div className="sfa-app-logo"></div>
											<div className="sfa-app-name">Sales Force Automation</div>
										</div>
									</div>
								</div>
								<div className="sfa-row-50 sfa-grid-padding">
									<div className="sfa-login-form">
										<div className="sfa-text-block">
											<span className="sfa-input-label">Username:</span>
											<input type="text" className="sfa-text-input" onChange={this.onUNchange.bind(this)} defaultValue={this.state.username}></input>
										</div>
										<div className="sfa-text-block">
											<span className="sfa-input-label">Password:</span>
											<input type="password" className="sfa-text-input" onChange={this.onPWDchange.bind(this)} defaultValue={this.state.password}></input>
										</div>
										<div className="sfa-text-block">
											<button className="sfa-btn sfa-btn-red" id="b-info" onClick={this.onLoginClick.bind(this)}><span>Log in</span></button>
											<a href="#">Forgot Password</a>
										</div>
									</div>
									<div className="text-center sfa-version-num"><span className="sfa-font-italic">Ver. 5.0.1</span></div>
								</div>
							</div>
							<button className="sfa-btn sfa-btn-settings" onClick={this.openSettingWindow.bind(this)}><span className="sfa-icon sfa-icon-settings"></span></button>
						</div>
					</div>
				</div>
				{this.state.openSettings || logging ? <div className="sfa-overlay"></div> : null}
				{this.state.openSettings ? <LoginSettings /> : null}
				<ProgressView />
			</div>
		);
	}
}

let mapStateToProps = function (state) {
	return { user: state.user, progress: state.progress };
}

export default connect(mapStateToProps, action)(Login);