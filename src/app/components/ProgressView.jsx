import React from 'react';
import { connect } from 'react-redux'
import * as action from '../Redux/actions'

class ProgressView extends React.Component {

	constructor(props) {
		super(props);
	}

	updateProgress(progress) {
		progress = Math.floor(progress);
		if (progress < 25) {
			var angle = -90 + (progress / 100) * 360;
			$(".animate-0-25-b").css("transform", "rotate(" + angle + "deg)");
		}
		else if (progress >= 25 && progress < 50) {
			var angle = -90 + ((progress - 25) / 100) * 360;
			$(".animate-0-25-b").css("transform", "rotate(0deg)");
			$(".animate-25-50-b").css("transform", "rotate(" + angle + "deg)");
		}
		else if (progress >= 50 && progress < 75) {
			var angle = -90 + ((progress - 50) / 100) * 360;
			$(".animate-25-50-b, .animate-0-25-b").css("transform", "rotate(0deg)");
			$(".animate-50-75-b").css("transform", "rotate(" + angle + "deg)");
		}
		else if (progress >= 75 && progress <= 100) {
			var angle = -90 + ((progress - 75) / 100) * 360;
			$(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b")
				.css("transform", "rotate(0deg)");
			$(".animate-75-100-b").css("transform", "rotate(" + angle + "deg)");
		}
		$(".sfa-loading-progess-bar .loader .loader-bg .text").html(progress + "%");

	}

	render() {
		let loadingText = this.props.progress.text || 'Loading...';
		let isSpinner = this.props.progress.isSpinner;
		let isProgressSpinner = this.props.progress.isProgressSpinner;
		if (isProgressSpinner) {
			console.log(this.props.progress.progressValue);
			this.updateProgress(this.props.progress.progressValue);
		}
		return (
			<div>
				{isSpinner ? <div className="sfa-panel sfa-popup sfa-popup-round-progress-bar sfa-popup-round-progress-bar-dark">
					<div className="sfa-panel-body">
						<div className="sfa-loading-progess-bar">
							{isSpinner && isProgressSpinner ? <div className="loader">
								<div className="loader-bg">
									<div className="text"></div>
								</div>
								<div className="spiner-holder-one animate-0-25-a">
									<div className="spiner-holder-two animate-0-25-b">
										<div className="loader-spiner"></div>
									</div>
								</div>
								<div className="spiner-holder-one animate-25-50-a">
									<div className="spiner-holder-two animate-25-50-b">
										<div className="loader-spiner"></div>
									</div>
								</div>
								<div className="spiner-holder-one animate-50-75-a">
									<div className="spiner-holder-two animate-50-75-b">
										<div className="loader-spiner"></div>
									</div>
								</div>
								<div className="spiner-holder-one animate-75-100-a">
									<div className="spiner-holder-two animate-75-100-b">
										<div className="loader-spiner"></div>
									</div>
								</div>
							</div> : null}
							{isSpinner && !isProgressSpinner ? <div className="loader2"></div> : null}
						</div>
						<div className="text-center sfa-text-block sfa-font-bold sfa-ellipsis sfa-loading-text">
							{loadingText}
						</div>
					</div>
				</div> : null}
			</div>
		);
	}
}

let mapStateToProps = function (state) {
	return { progress: state.progress };
}

export default connect(mapStateToProps, action)(ProgressView)
