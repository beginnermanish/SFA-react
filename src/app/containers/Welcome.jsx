import React from 'react';
import common from '../Utils/common'
import welcomeService from '../services/welcome'

class Welcome extends React.Component {

	navigate(path) {
		if (path === 'back') {
			window.history.back();
		}
	}

	init() {
		welcomeService.getEvents(moment().format(common.momentDateFormat)).then(function (data) {});
		welcomeService.getMessages().then(function (data) {});
	}

	constructor(props) {
		super(props);
		this.init();
	}

	render() {
		return (
			<div className="sfa-layout">
				<div className="sfa-side-nav">
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
				<div className="sfa-top-nav">
					<span className="pull-left">
						<button className="pull-left sfa-btn sfa-btn-red sfa-btn-prev" onClick={this.navigate}><span className="sfa-icon sfa-icon-prev"></span> <span>Back</span></button>
					</span>
					<span className="pull-right">
						<button className="pull-right sfa-btn sfa-btn-red sfa-btn-next" onClick={this.navigate}><span>Start</span> <span className="sfa-icon sfa-icon-next"></span></button>
					</span>
				</div>
				<div className="sfa-grid">
					<div className="pull-left sfa-col-25 sfa-grid-padding">
						<div className="sfa-panel sfa-welcome-weather">
							<div className="sfa-weather-detail">
								<div className="sfa-weather-weekly">
									<ul>
										<li className="pull-left sfa-col-16">
											<span>Thu</span>
											<span className="sfa-icon">
												<img src="img/weather/gray/01d.png" />
											</span>
											<span>25°C</span>
										</li>
										<li className="pull-left sfa-col-16">
											<span>Fri</span>
											<span className="sfa-icon">
												<img src="img/weather/gray/02d.png" />
											</span>
											<span>17°C</span>
										</li>
										<li className="pull-left sfa-col-16">
											<span>Sat</span>
											<span className="sfa-icon">
												<img src="img/weather/gray/09d.png" />
											</span>
											<span>12°C</span>
										</li>
										<li className="pull-left sfa-col-16">
											<span>Sun</span>
											<span className="sfa-icon">
												<img src="img/weather/gray/10d.png" />
											</span>
											<span>16°C</span>
										</li>
										<li className="pull-left sfa-col-16">
											<span>Mon</span>
											<span className="sfa-icon">
												<img src="img/weather/gray/04d.png" />
											</span>
											<span>23°C</span>
										</li>
										<li className="pull-left sfa-col-16">
											<span>Tue</span>
											<span className="sfa-icon">
												<img src="img/weather/gray/02d.png" />
											</span>
											<span>20°C</span>
										</li>
									</ul>
								</div>
								<div className="sfa-weather-today">
									<span className="sfa-temperature"><span><i className="fa fa-long-arrow-up"></i>23°C</span> <span><i className="fa fa-long-arrow-down"></i>18°C</span></span>
									<span className="sfa-weather">20°C<br />Sunny</span>
									<span className="sfa-icon">
										<img src="img/weather/white-shadow/01d.png" />
									</span>
									<span className="sfa-accuweather-logo" ><img alt="" src="img/AccuWeather_Logo.png" /></span>
								</div>
								<button className="sfa-btn sfa-btn-block sfa-btn-red" disabled="disabled"><span className="sfa-icon sfa-icon-map"></span> <span>Shanghai, China</span></button>
							</div>
							<div className="sfa-panel-body">
								<ul className="sfa-list-view">
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">10:00 a.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/01d.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											20°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">11:00 a.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/01d.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											21°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">12:00 a.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/01d.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											22°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">01:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/01d.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											23°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">02:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/01d.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											21°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">03:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/02d.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											20°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">04:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/02d.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											19°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">05:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/02d.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											19°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">06:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/03n.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											16°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">07:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/03n.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											16°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">08:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/03n.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											16°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">09:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/01n.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											16°C
									</span>
									</li>
									<li>
										<span className="pull-left sfa-col-40 sfa-font-italic sfa-text-left">10:00 p.m</span>
										<span className="pull-left sfa-col-30 sfa-icon sfa-text-center">
											<img src="img/weather/gray/01n.png" />
										</span>
										<span className="pull-left sfa-col-30 sfa-text-right">
											14°C
									</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="pull-left sfa-col-40 sfa-grid-padding">
						<div className="sfa-panel sfa-welcome-message">
							<div className="sfa-panel-header">
								<span className="sfa-panel-title">Message</span>
							</div>
							<div className="sfa-panel-body">
								<ul className="sfa-list-view">
									<li>
										<a href="#">
											<span className="sfa-text-block sfa-ellipsis-2">Coke Zero Product Launch planned for 5th Feb at Key accounts.</span>
											<span className="sfa-text-block sfa-font-sm">
												<span className="pull-left sfa-font-italic">David</span>
												<span className="pull-right sfa-font-italic">Jan,13th</span>
											</span>
										</a>
									</li>
									<li>
										<a href="#">
											<span className="sfa-text-block sfa-ellipsis-2">Government increased taxes on beverage as of 1st March.</span>
											<span className="sfa-text-block sfa-font-sm">
												<span className="pull-left sfa-font-italic">John</span>
												<span className="pull-right sfa-font-italic">Jan,13th</span>
											</span>
										</a>
									</li>
									<li>
										<a href="#">
											<span className="sfa-text-block sfa-ellipsis-2">Pepsi launched a new design for 300ml can.</span>
											<span className="sfa-text-block sfa-font-sm">
												<span className="pull-left sfa-font-italic">Bob</span>
												<span className="pull-right sfa-font-italic">Jan,13th</span>
											</span>
										</a>
									</li>
									<li>
										<a href="#">
											<span className="sfa-text-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pellentesque orci rutrum mollis suscipit. Ut et urna eget urna auctor lacinia eu in tellus. Morbi ante orci, ultrices ac scelerisque ac, dictum nec dolor. Aenean accumsan lorem quis sagittis tempor. Vestibulum vitae magna sed risus lobortis malesuada nec et arcu. Integer at laoreet sapien. Nullam finibus neque ut massa feugiat dictum. Praesent in orci in leo iaculis ultricies.</span>
											<span className="sfa-text-block sfa-font-sm">
												<span className="pull-left sfa-font-italic">Lorem Ipsum</span>
												<span className="pull-right sfa-font-italic">Jan,13th</span>
											</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="pull-left sfa-col-35 sfa-grid-padding">
						<div className="sfa-panel sfa-welcome-mailbox">
							<table className="sfa-calendar">
								<tbody>
									<tr>
										<td colSpan="7" className="sfa-cal-header">
											<span className="sfa-cal-title">January, 2015</span>
											<a href="#" className="sfa-cal-prev"></a>
											<a href="#" className="sfa-cal-next"></a>
										</td>
									</tr>
									<tr className="sfa-cal-week">
										<td><span className="sfa-text-red">S</span></td>
										<td><span>M</span></td>
										<td><span>T</span></td>
										<td><span>W</span></td>
										<td><span>T</span></td>
										<td><span>F</span></td>
										<td><span className="sfa-text-red">S</span></td>
									</tr>
									<tr>
										<td><a href="#" className="sfa-text-gray">28</a></td>
										<td><a href="#" className="sfa-text-gray">29</a></td>
										<td><a href="#" className="sfa-text-gray">30</a></td>
										<td><a href="#" className="sfa-text-gray">31</a></td>
										<td><a href="#">1</a></td>
										<td><a href="#">2</a></td>
										<td><a href="#">3</a></td>
									</tr>
									<tr>
										<td><a href="#">4</a></td>
										<td><a href="#">5</a></td>
										<td><a href="#">6</a></td>
										<td><a href="#">7</a></td>
										<td><a href="#">8</a></td>
										<td><a href="#">9</a></td>
										<td><a href="#">10</a></td>
									</tr>
									<tr>
										<td><a href="#">11</a></td>
										<td><a href="#">12</a></td>
										<td><a href="#" className="sfa-active">13</a></td>
										<td><a href="#">14</a></td>
										<td><a href="#">15</a></td>
										<td><a href="#">16</a></td>
										<td><a href="#">17</a></td>
									</tr>
									<tr>
										<td><a href="#">18</a></td>
										<td><a href="#">19</a></td>
										<td><a href="#">20</a></td>
										<td><a href="#">21</a></td>
										<td><a href="#">22</a></td>
										<td><a href="#">23</a></td>
										<td><a href="#">24</a></td>
									</tr>
									<tr>
										<td><a href="#">25</a></td>
										<td><a href="#">26</a></td>
										<td><a href="#">27</a></td>
										<td><a href="#">28</a></td>
										<td><a href="#">29</a></td>
										<td><a href="#">30</a></td>
										<td><a href="#">31</a></td>
									</tr>
								</tbody>
							</table>
							<div className="sfa-panel-body">
								<ul className="sfa-list-view">
									<li>
										<a href="welcome_mailopen.html" className="sfa-media sfa-visited">
											<span className="sfa-icon sfa-icon-flag-important"></span>
											<span className="sfa-text-block sfa-ellipsis">Meet supervisor at Starbucks near the Walmart.</span>
											<span className="sfa-text-block sfa-font-sm">
												<span className="pull-left sfa-font-italic">Ann</span>
												<span className="pull-right sfa-font-italic">01:00 &ndash; 02:00 p.m</span>
											</span>
										</a>
									</li>
									<li>
										<a href="welcome_mailopen.html" className="sfa-media">
											<span className="sfa-icon sfa-icon-flag"></span>
											<span className="sfa-text-block sfa-ellipsis">Meet supervisor at Starbucks near the Walmart.</span>
											<span className="sfa-text-block sfa-font-sm">
												<span className="pull-left sfa-font-italic">Ann</span>
												<span className="pull-right sfa-font-italic">01:00 &ndash; 02:00 p.m</span>
											</span>
										</a>
									</li>
									<li>
										<a href="welcome_mailopen.html" className="sfa-media">
											<span className="sfa-icon sfa-icon-flag"></span>
											<span className="sfa-text-block sfa-ellipsis">Meet supervisor at Starbucks near the Walmart.</span>
											<span className="sfa-text-block sfa-font-sm">
												<span className="pull-left sfa-font-italic">Ann</span>
												<span className="pull-right sfa-font-italic">01:00 &ndash; 02:00 p.m</span>
											</span>
										</a>
									</li>
									<li>
										<a href="welcome_mailopen.html" className="sfa-media">
											<span className="sfa-icon"></span>
											<span className="sfa-text-block sfa-ellipsis">Meet supervisor at Starbucks near the Walmart.</span>
											<span className="sfa-text-block sfa-font-sm">
												<span className="pull-left sfa-font-italic">Ann</span>
												<span className="pull-right sfa-font-italic">01:00 &ndash; 02:00 p.m</span>
											</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Welcome
