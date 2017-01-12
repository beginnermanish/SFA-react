import localization from '../translations/en'

export default {

	fileThreadProccessType: {
		upload: 1,
		download: 2,
		del: 3
	},
	syncType: {
		initialSync: 0,
		incremenetalSync: 1
	},
	priceEngineSyncType: {
		initialSync: 0,//3
		incremenetalSync: 0
	},
	uploadType: {
		onDemand: 1,
		background: 2
	},
	syncState: {
		running: 1,
		end: 2,
		error: 3
	},
	threadState: {
		running: 4,
		end: 5,
		error: 6
	},
	userInfo: {
		returnUrl: null,
		sessionId: null,
		fromLogin: false
	},
	scheduleType: {
		syncSchedule: 1,
		emailNotifySchedule: 2,
		fileThread: 3
	},
	getBoolean: function (val) {
		return (val && val.trim() === "true");
	},
	appInfo: {},
	syncLogType: {
		order: "Order",
		modify: "Modify",
		redSurvey: "Customer Visit",
		add: "Add",
		request: "Request",
		cdeOrder: 'CDE Order',
		onBoarding: 'Customer OnBoarding',
		contact: 'Contact'
	},
	priceEngineSyncConfig: {
		Port: "8555",
		User: "DemoRoute",//02002645 
		Host: "kofph.cloudapp.net",
		Reset: false
	},
	syncLogStatus: {
		pending: "New",
		started: "Started",
		success: "Success",
		failed: "Failed"
	},
	fileLogStatus: {
		notUploaded: 'Failed',
		uploaded: 'Success'
	},
	logType: {
		visit: 0,
		image: 1
	},
	ipInfo: {
		ipAddress: null,
		port: null
	},
	weatherInfo: {
		location: null
	},
	priceCheckMode: {
		online: 1,
		offline: 2
	},
	roles: {
		SalesRep: 'SalesRep',
		SuperVisor: 'Supervisor'
	},
	orderType: {
		cdeOrder: 'CDE Order',
		cdeIssue: 'CDE Issue',
		invoices: 'Invoices',
		phoneOrder: 'phone order',
		orderVisit: 'order visit',
		customervisit: 'customer visit',
		salesOrder: 'Sales Order',
		sampleOrder: 'Sample Order',
		emptyReturn: 'Empty Return',
		tradeReturn: 'Trade Return'
	},
	amountSymbols: {
		Thousand: 'K',
		Million: 'M',
		Billion: 'B',
		Trillion: 'T'
	},
	recordAction: {
		defaultAction: 0,
		insertRec: 1,
		updateRec: 2,
		deleteRec: 3,
		holdRec: 4,
		updateHoldRec: 5
	},
	orderStatus: {
		New: 'New',
		Hold: 'Hold',
		Cancel: 'Cancelled',
		Pending: 'Pending'
	},
	fileFolders: {
		asset: "CustomerAsset",
		accountGroup: "AccountGroup",
		customerResources: "CustomerResources",
		salesrepResources: "SalesRepResources",
		gallery: "CustomerGallery",
		logs: "Logs",
		cimagine: "Cimagine"
	},

	fileDownloadState: {
		isAssetDownloaded: false,
		isAccountGroupDownloaded: false,
		isCustomerResourcesDownloaded: false,
		isGalleryDownloaded: false
	},
	accountGroupTypes: {
		FocusSKU: 'Focus SKU',
		RedSurvey: 'RED Survey'
	},
	networkTimout: 30000,
	initialSyncNetworkTimeout: 720000, // 12 minutes
	defaultIpaddress: "180.166.98.84",
	defaultPort: "8080",
	defaultSandBoxIpaddress: "191.234.18.233",
	defaultSandBoxPort: "80",
	defaultConnection: "Production",
	defaultRole: 'SalesRep',
	sellingStoriesNameSpace: 'com.eBest.SellingStories',
	priceEngineNamespace: 'ebMobile.Pricing.Service',
	currentBuildVersion: '6.0.0',
	activeSurveyId: null,
	standardDateFormat: "yyyy-mm-dd",
	standardDateTimeFormat: "yyyy-mm-dd HH:MM:ss",
	editorIconRootPath: 'resources/EditorIcons/',
	calculateOfflinePrice: "0",
	showForecast: "0",

	getServerController: function (action) {
		//return 'http://localhost/NetToSalesforce/Api/' + action;
		/*var info = this.getIpInfo();
		var ip = info.ipAddress;
		if (info.port)
			ip += ":" + info.port;
		var http = info.connection === "Production" ? "http" : "http";*/
		var ip = '180.166.98.84:8080', http = 'http';
		return String.format("{2}://{0}/SFAMiddleware/Api/{1}", ip, action, http);
	},

	getIpInfo: function () {
		var me = this;
		var info = window.localStorage.getItem("IPInfo");
		if (!me.ipInfo.ipAddress || !me.ipInfo.role) {
			me.ipInfo.ipAddress = me.defaultIpaddress;
			me.ipInfo.connection = me.defaultConnection;
			me.ipInfo.port = me.defaultPort;
			me.ipInfo.role = me.defaultRole;
		}
		return info ? JSON.parse(info) : me.ipInfo;
	},

	getRole: function () {
		var info = this.getIpInfo();
		return info.role;
	},
	/**
	 * clearSession - common method to clear all the session on the application
	 * */
	clearSession: function () {
		localStorage.removeItem("appInfo");
		localStorage.removeItem("ngStorage-sessionId");
		localStorage.removeItem("ngStorage-weatherInfo");
		//localStorage.removeItem("clientId");
	},
	isOnProgress: function () {
		return $(".sfa-popup-round-progress-bar").is(":visible");
	},

	isNativeApp: function () {
		return !!window.cordova;
	},

	translateText: function (text) {
		var blocks = text.split('.'), localObj;
		for (var i = 0; i < blocks.length; i++) {
			if (i == 0) {
				localObj = localization[blocks[i]];
			}
			else {
				localObj = localObj[blocks[i]];
			}
		}
		return localObj;
	},

	getRecordId: function () {
		return "GUID" + this.getGuid();
	},
	getGuid: function () {
		var me = this;
		var d = new Date().getTime();
		if (window.performance && typeof window.performance.now === "function") {
			d += performance.now(); //use high-precision timer if available
		}
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	},
	/**
	 * getClientId - common method to get client ID
	 * */
	getClientId: function () {
		//Only for testing on browser,need to get actual device ID for native application
		var clientId = window.localStorage.getItem("clientId");
		if (!clientId) {
			clientId = this.getGuid();
			window.localStorage.setItem("clientId", clientId);
		}
		return clientId;
	},
	/**
	 * daysBetween - common method to check the date 
	 * @param {String} lastDate - lastDate value
	 * @param {String} newDate - newDate value
	 * */
	daysBetween: function (lastDate, newDate) {
		//Get 1 day in milliseconds
		var one_day = 1000 * 60 * 60 * 24;
		var date1_ms = lastDate.getTime();
		var date2_ms = newDate.getTime();
		var difference_ms = date2_ms - date1_ms;
		var diff = Math.round(difference_ms / one_day);
		if (diff === 0) {
			//This is to validate for next day starts from morning 12 AM
			return newDate.getDate() - lastDate.getDate();
		}
		return diff;
	},
	/**
	 * setFileDownloadStatus - common method to set the fie download status
	 * @param {String} type - type of the file folders
	 * @param {String} state - state to be set on the status
	 * */
	setFileDownloadStatus: function (type, state) {
		var me = this;
		var data = me.getFileDownloadStatus();
		switch (type) {
			case me.fileFolders.asset:
				data.isAssetDownloaded = state;
				break;
			case me.fileFolders.accountGroup:
				data.isAccountGroupDownloaded = state;
				break;
			case me.fileFolders.customerResources:
				data.isCustomerResourcesDownloaded = state;
				break;
			case me.fileFolders.gallery:
				data.isGalleryDownloaded = state;
				break;
		}

		//window.localStorage.setItem("FileDownloadState", JSON.parse(data));
	},
	getPlatform: function () {
		return typeof device !== "undefined" && device.platform ? device.platform.toLowerCase() : "browser";
	},
	/**
	 * getFileDownloadStatus - common method to get file download status
	 * */
	getFileDownloadStatus: function () {
		var state = window.localStorage.getItem("FileDownloadState");
		return state ? JSON.parse(state) : this.fileDownloadState;
	},

	regExp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	scheduleTime: 0, //seconds
	fileThreadScheduleTime: 0, //seconds
	autoSyncPeriod: '',
	isDeviceReady: false,
	isApplicationOnline: false,
	keepTableRecordsConfig: null,
	serverDateTime: null,
	fileThreadFromLogin: false,
	sendErrorLogAsEmail: true,
	isPriceEngineConnected: false,
	recordActionValues: [],
	downloadAttachementData: null,
	activeDownloadIndex: null,
	enableOfflinePricing: null,
	lastPriceSyncSuccess: null,
	filePrefix: 'ebM__temp__',
	loeFilePrefix: 'LOE_',
	canExportDatabase: false,
	activeAnnotaionXml: null,
	isSyncFromLogin: false,
	isBatchDownload: false,
	canShowLoadingMask: false,
	maxDownloadGroupNumber: 0,
	rootFolder: "SfaResources",
	customerVisited: null,
	loginTime: null,
	activeApkDownloadId: null,
	//Commmon OrderIds and Order Numbers
	salesOrderId: null,
	sampleOrderId: null,
	tradeReturnOrderId: null,
	emptyReturnId: null,
	//customerVisited: true,
	salesOrder: null,
	tradeReturnOrder: null,
	emptyReturn: null,
	sampleOrder: null,
	priceEngineStartTime: null,
	offlinePricingSyncTimeout: 120000,
	offlinePriceSyncTimeoutCode: 522,
	applySettledQuantity: false,
	dataSplitCharacter: '▏',
	isRoleChanged: false,
	chatterNetworkTimout: 30000, // 0.5 minutes
	onlinePricingUrl: "http://onlinepricerestcall.au.cloudhub.io/api/onlineprice",
	onlinePricingUrlUserName: 'ebest',
	onlinePricingUrlPassword: 'ebest',
	onlinePricingUrlBONPC: "http://onlineprice-for-bonpc-test.au.cloudhub.io/api/onlineprice",
	onlinePricingUrlBONPCUserName: 'ebest',
	onlinePricingUrlBONPCPassword: 'ebest',
	attachmentBase64: [],//only for browser test, because of local storage limitation
	chatterApiUrl: {
		feeds: 'services/data/v38.0/chatter/feeds/news/me/feed-elements',
		groups: 'services/data/v38.0/chatter/groups',
		myGroups: 'services/data/v38.0/chatter/users/me/groups',
		files: 'services/data/v38.0/connect/files/users/me',
		postFeedItem: 'services/data/v38.0/chatter/feed-elements/{0}/capabilities/comments/items',
		postNewFeed: 'services/data/v35.0/chatter/feed-elements',
		likeFeedItem: 'services/data/v38.0/chatter/feed-elements/{0}/capabilities/chatter-likes/items',
		likeCommentItem: 'services/data/v38.0/chatter/comments/{0}/likes',
		unlikeItem: 'services/data/v38.0/chatter/likes/{0}',
		downloadLink: 'services/data/v32.0/chatter/files/{0}/content?versionNumber={1}',
		groupFeeds: 'services/data/v38.0/chatter/feeds/record/{0}/feed-elements',
		externalRepositoryFile: 'services/data/v38.0/connect/files/users/me',
		users: 'services/data/v38.0/chatter/users',
		myProfile: 'services/data/v38.0/chatter/users/me',
		sharedWithMe: "services/data/v38.0/connect/files/users/me/filter/shared-with-me"
	},
	chatterApiVisibility: {
		privateAccess: 'PrivateAccess',
		publicAccess: 'PublicAccess'
	},
	/**
	 * setActiveSurveyId - common method to set active survey Id with given ID
	 * @param {Object} source - source information
	 * @param {String} id - id for set survey ID
	 * */
	setActiveSurveyId: function (id, source) {
		if (!id) {
			//msg.data('messageBox').default('Survey id null', 'setActiveSurvey please wait and check ' + source);
			console.log('Survey id null - > setActiveSurvey please wait and check ' + source);
		}
		console.log('Survey id - > setActiveSurvey please wait and check ' + id + ' ' + source);
		this.activeSurveyId = id;
	},
	/**
	 * getActiveSurveyId - common method to get current active survey ID
	 * @param {Object} source - source information
	 * */
	getActiveSurveyId: function (source) {
		if (!this.activeSurveyId) {
			//msg.data('messageBox').default('Survey id null', 'getActiveSurvey: ' + source);
			console.log('Survey id null -> getActiveSurvey please wait and check ' + source);
		}
		console.log('Survey id - > getActiveSurvey please wait and check ' + this.activeSurveyId + ' ' + source);
		return this.activeSurveyId;
	},

	/**
	 * initializeAppInfo - common method to initialize the App information
	 * */
	initializeAppInfo: function () {
		var me = this;
		var info = {
			username: null,
			firstName: null,
			name: null,
			password: null,
			version: null,
			roleId: null,
			userId: null,
			lastEventUpdate: null,
			userCode: null,
			sfdcApiVersion: null,
			isSchemaCreated: false,
			isPriceEngineInitSyncDone: false,
			isInitialDataDownloaded: false,
			deleteExistingRecords: false,
			returnUrl: null,
			sessionId: null,
			lastOnlineLogin: null,
			modifiableTables: []
		};
		localStorage.setItem('currentBuildVersion', me.currentBuildVersion);
		me.appInfo = info;
	},
	/**
	 * openSellingStory - common method to open selling story
	 * */
	openSellingStory: function (nameSpace) {
		var me = this, scheme;
		var url = 'sellingstories://?sfaRoute=true&channel=' + $rootScope.selectedCustomer.TradeChannel;
		// Don't forget to add the cordova-plugin-device plugin for `device.platform`
		if (me.getPlatform().toLowerCase() === 'ios') {
			scheme = 'sellingstories://';
		}
		else if (me.getPlatform().toLowerCase() === 'android') {
			scheme = me.sellingStoriesNameSpace;
			if (nameSpace)
				scheme = nameSpace
		} else {
			window.open(url, '_blank');
			return;
		}

		appAvailability.check(
			scheme,       // URI Scheme or Package Name
			function () {  // Success callback
				console.log("app exists: ");
				window.open(url, me.getPlatform().toLowerCase() !== 'ios' ? '_system' : '_blank');
			},
			function () {  // Error callback
				if (!nameSpace) {
					me.openSellingStory('com.sellingStories.eBest'); // support for old version
					return;
				}
				msg.data('messageBox').default(common.translateText('COMMON.SELLING_STORIES_NOT_FOUND'), common.translateText('COMMON.INSTALL_TRY_AGAIN'));
			}
		);
	},
	checkPriceEngineAvailable: function () {
		var me = this;
		return new Promise(function (resolve, reject) {
			if (me.getPlatform().toLowerCase() === 'android') {
				var sApp = startApp.set({ /* params */
					"package": me.priceEngineNamespace,
					"intentstart": "startActivity"
				}, { /* extras */

					});

				sApp.check(function (values) { /* success */
					resolve(1); //True
				}, function (error) { /* fail */
					console.log(error);
					resolve(2);	//False			
				});
			} else {
				//Not support
				resolve(3);
			}
		});
	},
	/**
	 * validateUserTime - common method to validate user time with time zone
	 * @param {String} date - date to be check
	 * @param {String} timeZone - time zone to be check

	 * */
	validateUserTime: function (date, timeZone) {
		var now = new Date(), tz = now.toString().match(/([A-Z]+[\+-][0-9]+)/)[1], userTime = null, userTz = null, variation = 180 * 1000; //3 min
		var gmtIndex;

		if (!timeZone)
			return this.translateText('COMMON.NOT_VALID_TIMEZONE_CONTACT_ADMINISTARTOR');

		if (date && timeZone) {
			gmtIndex = date.length - 5;

			if (date.indexOf("GMT") == -1) {
				date = date.splice(gmtIndex, 0, "GMT");
			}
			userTime = moment(date, "YYYY-MM-DD hh:mm:ss a").tz(timeZone).toDate();
			/*
			if (["android", "ios"].indexOf(device.platform.toLowerCase()) > -1)
				userTime = moment(date, "YYYY-MM-DD hh:mm:ss a").tz(timeZone).toDate();
			else
				userTime = moment(date, "YYYY-MM-DD hh:mm:ss a").toDate();*/
		}


		if (userTime) {
			userTz = date.substring(gmtIndex);

			if (userTz !== tz)
				return this.translateText('COMMON.CHANGE_DEVICE_TIMEZONE') + timeZone + " " + userTz + this.translateText('COMMON.RESTART_DEVICE');

			var userDate = userTime;//moment(userTime, "MM/DD/YYYY hh:mm:ss a").toDate();
			var timeDiff = now.getTime() - userDate.getTime();

			return (Math.abs(timeDiff) <= variation) || this.translateText('COMMON.INVALID_TIME') + date + this.translateText('COMMON.RESTART_DEVICE');
		}
		return this.translateText('COMMON.NOT_VALID_SERVER_TIME');
		//new Date("2015-11-4 10:44:27 +0800").toLocaleString("en-US", {timeZone: "Asia/Shanghai"})
	},
	/**
	 * deviceReady - common method to check the device ready
	 * */
	deviceReady: function () {
		this.isDeviceReady = true;
	},
	updateIpInfo: function (ipInfo) {
		this.isRoleChanged = ipInfo.role !== this.getRole();
		window.localStorage.setItem("IPInfo", angular.toJson(ipInfo));
	},
	showImagePreview: function (params, callback, quality) {
		$rootScope.$broadcast('showImagePreview', params, callback, quality);
	},
	hideImagePreview: function () {
		$rootScope.$broadcast('hideImagePreview');
	},
	/**
	 * createImage - common method to create new image
	 * @param {String} url - url to define image src
	 * @param {Method} callback - callback method on image loading
	 * */
	createImage: function (url, callback) {
		var image = new Image();
		image.onload = function () {
			callback(image);
		};
		image.src = url;
	},
	/**
	 * getParsedSequenceSort - common method to get product code parsed
	 * @param {String} val - value of product code
	 * */
	getParsedSequenceSort: function (val) {
		var data = val.split(',');
		var index = data.indexOf("ProductCode");
		if (index !== -1) {
			data[index] = "cast(cast(ProductCode as numeric) as text)";
		}
		return data.join(',');
	},
	/**
	 * encryptPassword - common method to encrypt password value
	 * @param {String} val - password value
	 * */
	encryptPassword: function (val) {
		return CryptoJS.AES.encrypt(val, "eBest Secret Passphrase", { format: this.JsonFormatter });
	},
	/**
	 * decryptPassword - common method to decrypt password
	 * @param {String} encrypted - encrypted password value
	 * */
	decryptPassword: function (encrypted) {
		var decrypted = CryptoJS.AES.decrypt(encrypted, "eBest Secret Passphrase", { format: this.JsonFormatter });
		return decrypted.toString(CryptoJS.enc.Utf8); // Message
	},
	/**
	 * JsonFormatter - common method to JSON formatter
	 * */
	JsonFormatter: {
		stringify: function (cipherParams) {
			// create json object with ciphertext
			var jsonObj = {
				ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
			};

			// optionally add iv and salt
			if (cipherParams.iv) {
				jsonObj.iv = cipherParams.iv.toString();
			}
			if (cipherParams.salt) {
				jsonObj.s = cipherParams.salt.toString();
			}

			// stringify json object
			return JSON.stringify(jsonObj);
		},

		parse: function (jsonStr) {
			// parse json string
			var jsonObj = JSON.parse(jsonStr);

			// extract ciphertext from json object, and create cipher params object
			var cipherParams = CryptoJS.lib.CipherParams.create({
				ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
			});

			// optionally extract iv and salt
			if (jsonObj.iv) {
				cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
			}
			if (jsonObj.s) {
				cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
			}

			return cipherParams;
		}
	},
	/**
	 * getCompressedImage - common method to get compressed image from the image object
	 * @param {Object} sourceImgObj - source object information
	 * @param {Object} options - contains the image resize options
	 * */
	getCompressedImage: function (sourceImgObj, options) {
		var outputFormat = options.resizeType;
		var quality = options.resizeQuality * 100 || 70;
		var mimeType = 'image/jpeg';
		if (outputFormat !== undefined && outputFormat === 'png') {
			mimeType = 'image/png';
		}


		var maxHeight = options.resizeMaxHeight || 300;
		var maxWidth = options.resizeMaxWidth || 250;

		var height = sourceImgObj.height;
		var width = sourceImgObj.width;

		// calculate the width and height, constraining the proportions
		if (width > height) {
			if (width > maxWidth) {
				height = Math.round(height *= maxWidth / width);
				width = maxWidth;
			}
		}
		else {
			if (height > maxHeight) {
				width = Math.round(width *= maxHeight / height);
				height = maxHeight;
			}
		}

		var cvs = document.createElement('canvas');
		cvs.width = width; //sourceImgObj.naturalWidth;
		cvs.height = height; //sourceImgObj.naturalHeight;
		var ctx = cvs.getContext('2d').drawImage(sourceImgObj, 0, 0, width, height);
		var newImageData = cvs.toDataURL(mimeType, quality / 100);
		var resultImageObj = new Image();
		resultImageObj.src = newImageData;
		return resultImageObj.src;
	},
	/**
	 * parseDate - common method to parse the given date
	 * @param {String} input - input date to be parsed
	 * @param {String} spliter - spliter string to be split the date
	 * */
	parseDate: function (input, spliter) {
		var isValid = true;
		if (input) {
			var date = input.split(" ")[0];
			var parts = date.split(spliter || '/').map(function (item) {
				var val = Number(item);
				if (isNaN(val))
					isValid = false;
				return val;
			});
		} else {
			isValid = false;
		}
		if (!isValid)
			return null;

		// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
		return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
	},
	loginSenario: {
		afterValildatingPassword: 1,
		afterSynchronizingSchema: 2,
		afterDownloadingData: 3
	},
	covertDegreesToRadians: function (value) {
		return value * Math.PI / 180;
	},
	/**
	 * calculateLatLngDistance - common method to calculate distance using lattitude and longtitude 
	 * @param {String} lat1 - latitude1 value
	 * @param {String} lon1 - longtitude1 value
	 * @param {String} lat2 - latitude2 value
	 * @param {String} lon2 - longtitude2 value
	 * */
	calculateLatLngDistance: function (lat1, lon1, lat2, lon2) {
		var me = this;
		var R = 6371 * 1000; // meters
		var dLat = me.covertDegreesToRadians(lat2 - lat1);
		var dLon = me.covertDegreesToRadians(lon2 - lon1);
		var lat1 = me.covertDegreesToRadians(lat1);
		var lat2 = me.covertDegreesToRadians(lat2);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d;
	},
	/**
	 * groupArrayByProperty - common method to grouping the array with given property
	 * @param {Array} array - contains array of value to group
	 * @param {String} property - property information
	 * */
	groupArrayByProperty: function (array, property) {
		var hash = {};
		for (var i = 0; i < array.length; i++) {
			if (!hash[array[i][property]]) hash[array[i][property]] = [];
			hash[array[i][property]].push(array[i]);
		}
		return hash;
	},
	/**
	 * getSfdcApiVersion - common method to get version of SDFC
	 * */
	getSfdcApiVersion: function () {
		return "v" + this.appInfo.sfdcApiVersion;
	},
	/**
	 * showCommonLoading - common method to show common loading screen
	 * @param {String} loadingText - loadingText string is used to display on loading mask
	 * @param {Boolean} isGridView - boolean value to define the loading mask is grid view or not
	 * @param {Boolean} disablePercentage - boolean value to disable the percentage
	 * */
	showCommonLoading: function (loadingText, isGridView, disablePercentage) {
		var text = { text: loadingText || this.translateText('COMMON.LOADING'), isGridView: isGridView, disablePercentage: disablePercentage };
		$rootScope.$broadcast('showProgress', text);
		$rootScope.$broadcast('updateProgress', { isSpinner: false });
	},
	hideCommonLoading: function () {
		$rootScope.$broadcast('hideProgress');
	},
	/**
	 * prepareRecordActionValues - common method to prepare record action value
	 * */
	prepareRecordActionValues: function () {
		var me = this;
		angular.forEach(me.recordAction, function (value, key) {
			if (value !== me.recordAction.defaultAction && value !== me.recordAction.holdRec)
				me.recordActionValues.push(value);
		});
	},
	/**
	 * dealocData - common method to dealocate data by clean up default one
	 * @param {Object} objects - objects value to cleanup from controller
	 * */
	dealocData: function (objects) {
		var me = this;
		angular.forEach(objects, function (value, key) {
			var obj = value;
			if (typeof value === "string")
				obj = $('[ng-controller=' + value + ']');

			me.dealoc(obj);
		}, this);
	},
	dealoc: function (obj) {
		var me = this;
		var jqCache = angular.element.cache;
		if (obj) {
			if (angular.isElement(obj)) {
				me.cleanup(angular.element(obj));
				obj.detach();
			}
			else if (!window.jQuery) {
				// jQuery 2.x doesn't expose the cache storage.
				for (var key in jqCache) {
					var value = jqCache[key];
					if (value.data && value.data.$scope == obj) {
						delete jqCache[key];
					}
				}
			}
			else {
				obj = null; //Not exactly, need to handle in some condition
			}
		}
	},
	cleanup: function (element) {
		var me = this;
		element.off().removeData();
		if (window.jQuery) {
			// jQuery 2.x doesn't expose the cache storage; ensure all element data
			// is removed during its cleanup.
			jQuery.cleanData([element]);
		}
		// Note: We aren't using element.contents() here. Under jQuery,   element.contents() can fail
		// for IFRAME elements. jQuery explicitly uses (element.contentDocument ||
		// element.contentWindow.document) and both properties are null for IFRAMES that aren't attached
		// to a document.
		var children = element[0] ? element[0].childNodes : [];
		for (var i = 0; i < children.length; i++) {
			me.cleanup(angular.element(children[i]));
		}
	},
	/**
	 * imageRenderError - common method to show error on image render
	 * @param {String} image - image string to define the error image
	 * */
	imageRenderError: function (image) {
		image.onerror = "";
		image.src = "resources/images/Placeholder.png";
		return true;
	},
	/**
	 * bytesToSize - common method to change bytes to integer
	 * @param {String} bytes - bytes value
	 * */
	bytesToSize: function (bytes) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	},
	/**
	 * removeByAttr - common method to remove one value from array using attribute
	 * @param {Object} arr - array value
	 * @param {Object} attr - attribute to remove from array
	 * @param {Object} value - value to be removed
	 * */
	removeByAttr: function (arr, attr, value) {
		var i = arr.length;
		while (i--) {
			if (arr[i]
				&& arr[i].hasOwnProperty(attr)
				&& (arguments.length > 2 && arr[i][attr] === value)) {

				arr.splice(i, 1);

			}
		}
		return arr;
	},
	/**
	 * getNearestValue - common method to get nearest value on array 
	 * @param {Object} arr - array value
	 * @param {String} closestTo - closestTo string value to check with array
	 * */
	getNearestValue: function (arr, closestTo) {
		arr = arr.sort(function (a, b) { return a > b });
		var closest = Math.max.apply(null, arr); //Get the highest number in arr in case it match nothing.
		for (var i = 0; i < arr.length; i++) { //Loop the array
			if (arr[i] <= closestTo) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
		}
		return closest; // return the value
	},
	isFloat: function (n) {
		return n === Number(n) && n % 1 !== 0;
	},
	disconnectOfflinePricing: function () {
		var me = this;
		return new Promise(function (resolve, reject) {
			if (typeof PricingInterface != 'undefined') {
				PricingInterface.disconnect({
					error: function (e) {
						me.isPriceEngineConnected = false;
						console.log(e);
						resolve(e);
					},
					success: function (s) {
						console.log(s);
						resolve(s);
					}
				});
			}
		});
	},
	getOfflinePricing: function (data) {
		var me = this;
		return new Promise(function (resolve, reject) {
			if (!data || data.length === 0) {
				reject("Invalid input data");
				return;
			}
			me.connectOfflinePricing().then(function (e) {
				if (e !== "connected") {
					reject(e);
					return;
				}

				me.loadCustomerSpecificData(data[0].CustomerRef).then(function (response) {
					var isJson = response && response.startsWith("{"), numberOfOrders = data.length, responseIndex = 0, responseData = [];
					if (!isJson) {
						reject(response);//Exception from price engine/ interface side
						return;
					}
					var res = angular.fromJson(response);
					if (res.Result != 1 || res.Code != 1004) {
						reject(this.translateText('COMMON.FAILED_LOAD_CUSTOMER_DATA') + response);//Error from price engine/ interface side, load failed
						return;
					}
					/*
					-----------------Sample data for single order-------------------
					var data = [{ CustomerRef: "0503933455", CalcDate: "2016-01-22", Products: [{ ProductId: "101620", Quantity: 2, UnitOfMeasure: "CS" }] }];	
				
					----------------Sample data for multiple orders---------------
					var data = [{ CustomerRef: "0503933455", CalcDate: "2016-01-22", Products: [{ ProductId: "101620", Quantity: 2, UnitOfMeasure: "CS" }] }, { CustomerRef: "0503933455", CalcDate: "2016-01-23", Products: [{ ProductId: "101620", Quantity: 3, UnitOfMeasure: "CS" }] }]; 			
					*/

					PricingInterface.getOfflinePricing(angular.toJson(data), {
						error: function (e) {
							console.log(e);
							responseIndex += 1;
							reject(this.translateText('COMMON.ERROR_LOADING_CUSTOMER_SPECIFIC_DATA') + e);
						},
						success: function (s) {
							console.log(s);
							responseIndex += 1;
							responseData.push(angular.fromJson(angular.fromJson(s).Data));
							if (responseIndex === numberOfOrders) {
								resolve(responseData);
							}

						}
					});
				});

			});
		});

	},
	loadCustomerSpecificData: function (CustomerRef) {
		return new Promise(function (resolve, reject) {
			console.log("Customer ref value " + CustomerRef);
			//Example customer ref 0503933455 (string)						
			PricingInterface.loadCustomerSpecificPriceData(CustomerRef, {
				error: function (e) {
					var error = e ? e : this.translateText('COMMON.ERROR_LOADING_CUSTOMER_SPECIFIC_DATA');
					console.log(error);
					resolve(error);
				},
				success: function (s) {
					console.log(s);
					resolve(s);
				}
			});
		});
	},
	connectOfflinePricing: function () {
		var me = this;
		return new Promise(function (resolve, reject) {
			PricingInterface.connect({
				error: function (e) {
					me.isPriceEngineConnected = false;
					console.log(e);
					resolve(e);
				},
				success: function (s) {
					me.isPriceEngineConnected = true;
					console.log(s);
					resolve(s);
				}
			});
		});
	},
	/**
	 * getFixedValue - common method to get fixed value
	 * @param {String} val - val to be get fixed value
	 * @param {String} fraction - fraction define the value to be fixed by this string
	 * */
	getFixedValue: function (val, fraction) {
		var me = this;
		if (me.isFloat(val))
			return val.toFixed(fraction || 1);
		else
			return val;
	},
	/**
	 * getCurrentLocation - common method to get current location of the user
	 * */
	getCurrentLocation: function () {
		var me = this;
		return new Promise(function (resolve, reject) {
			$geolocation.get().then(
				function (position) {
					resolve(position);
				},
				function (error) {

					if (me.isNativeApp()) {
						//getting location by using GPS satellite.
						var position = typeof (LocationServices) === "undefined" ? navigator.geolocation : LocationServices;
						position.getCurrentPosition(
							function (position) {
								console.log('location success');
								resolve(position);
							},
							function (error) {
								console.log('Location error', 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
								resolve();
							}, {
								enableHighAccuracy: true,
								timeout: 180000, // 3 minutes
								maximumAge: 60000
							});
						return;
					}
					resolve();
				});

		});
	},
	/**
	 * getDateOnly - common method to get the valid date
	 * @param {String} date - date string to be return with valid format
	 * */
	getDateOnly: function (date) {
		date = date || new Date();
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	},
	/**
	 * getMaxValue - common method to get maximum value of data
	 * @param {Object} data - data values to set maximum value
	 * */
	getMaxValue: function (data) {
		var arr = [0], val = 0;
		for (var i = 0; i < data.length; i++) {
			val = Number.isNaN(Number(data[i].Sequance)) ? 0 : Number(data[i].Sequance);
			arr.push(val);
		}
		return Math.max.apply(Math, arr);
	},
	/**
	 * getUTCDate - common method to get UTC date from the given date
	 * @param {String} date - date to be change to UTC format
	 * */
	getUTCDate: function (date) {
		return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	},
	globDirectionsDisplay: null,
	globMap: null,
	globBingMap: null,
	currCustId: '',
	/**
	 * showNavigateDiv - common method to show the navigation div on map
	 * @param {String} latitude - latitude value 
	 * @param {String} longitude - longitude value
	 * @param {String} custId - custId define the customer ID
	 * */
	showNavigateDiv: function (latitude, longitude, custId) {
		var me = this;
		if (navigator.geolocation && typeof google === 'object') {
			if (me.currCustId != custId) {
				var directionsService = new google.maps.DirectionsService();
				me.getCurrentLocation().then(function (position) {

					if (!position)
						position = $localStorage.weatherInfo;

					if (!position) {
						msg.data('messageBox').default(this.translateText('COMMONNOT_ABLE_TO_ACCESS_LOCATION'));
						return;
					}

					var currLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					//var nearByLoc = new google.maps.LatLng(10.80583, 106.64416); //uncomment this if you not near by and want to test navigation functionality --set it to origin below
					var request = {
						origin: currLoc,
						destination: new google.maps.LatLng(latitude, longitude),
						travelMode: google.maps.TravelMode.DRIVING
					};

					directionsService.route(request, function (result, status) {
						console.log("Status from api : " + status);
						if (status == google.maps.DirectionsStatus.OK) {
							me.globDirectionsDisplay.setMap(me.globMap);
							me.globDirectionsDisplay.setDirections(result);
						} else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
							msg.data('messageBox').default(this.translateText('COMMON.NO_ROUTE_FOUND'));
						}
					});
				});
				me.currCustId = custId;
			}
			else {
				me.globDirectionsDisplay.setMap(null);
				me.currCustId = ''
			}
		}
	},
	/**
	 * isTodayDate - common method to check the given date is today or not
	 * @param {String} val - val contains the date
	 * */
	isTodayDate: function (val) {

		if (!val)
			return false;

		var currentDate = moment(val, 'YYYY-MM-DD hh:mm:ss');
		return currentDate.toDate().format('yyyy-mm-dd') === moment().toDate().format('yyyy-mm-dd')
	},
	/**
	 * getProductCode - common method to change product code to number
	 * @param {String} val - product code value
	 * */
	getProductCode: function (val) {
		var isNum = !isNaN(Number(val));
		return isNum ? Number(val) : val;
	},
	/**
	 * currentDateTime - common method to get current date with time
	 * @param {Object} scope - scope information of current controller
	 * */
	currentDateTime: function (scope) {
		// Date Time made Dynamic
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm.toUpperCase();
		scope.currentTime = strTime;
		scope.currentDate = date.getDate();//
		days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		scope.day = days[date.getDay()].toUpperCase();
		scope.month = months[date.getMonth()].toUpperCase();
	},
	/**
	 * removeQuotes - common method to clean the sql string
	 * @param {Object} str - dirty string to be cleaned
	 * */
	removeQuotes: function (str, obj) {
		if (obj && Object.getOwnPropertyNames(obj).length != 0) {
			Object.keys(obj).forEach(function (key) {
				obj[key] = typeof obj[key] === 'string' ? obj[key].replace(/'/g, "''").replace(/"/g, "\"\"") : obj[key];
			});
			return obj;
		}
		else if (str && typeof str === 'string') {
			return str.replace(/'/g, "''").replace(/"/g, "\"\"").replace(/▏/g, "");
		}
	},
	removeArrayStringSpace: function (str) {
		var codes = [];
		if (str) {
			codes = str.split(',');
			for (var i = 0; i < codes.length; i++) {
				codes[i] = codes[i].trim();
			}
		}
		return codes;
	},
	/**
	 * @function getImageExtention - to return the extention of the image
	 * @param content - content type of the image
	 */
	getImageExtention: function (content) {
		var ext = '.jpg';
		switch (content) {
			case 'image/png':
				ext = '.png';
				break;
			case 'image/jpeg':
				ext = '.jpg';
				break;
		}
		return ext;
	},

	//Get the code value from the configuration.
	getConfiguration: function (codeCategory) {
		var data = $rootScope.configurationData.filter(function (e) { return e.ebMobile__CodeCategory__c === codeCategory }), toReturn = '0';
		if (data && data.length > 0) {
			toReturn = data[0].ebMobile__CodeValue__c;
		}
		return toReturn;
	},
	//Funtion for generate the unique order number.
	generateOrderNumber: function () {
		var newDate = new Date(),
			orderNumber = this.appInfo.userCode + moment(newDate).format("YYMMDDHHmmss");
		return orderNumber;
	},
	/**
	 * removeSpace - function for remove space from string.
	 * @param {String} value - having string value.
	 * */
	removeSpace: function (value) {
		return value && value.length > 0 ? value.replace(/ /g, '') : value;
	},
	bingMapkey: 'JcyNiGFnCOMmlVdnJ57x~2lVcSkpLq0koiyG-hcaYMA~AvNtrUoFfTSb9Znj8W9LE8bsB1fc2MebGo5XS4Pr7UyYcZWvfgWLWgWnPpVYKDXr',

	isInTimeRange: function (period) {
		if (period && period.length > 0) {
			var startEndTime = period.split('-');
			var startTime = moment(startEndTime[0], 'HH:mm'),
				endTime = moment(startEndTime[1], 'HH:mm');
			return moment().isBetween(startTime, endTime);
		} else {
			return true;
		}
	},
	/**
	 * function back - to manululate history 
	 * @param {string} url - go back to some specific url
	 */
	back: function (url) {
		if (url) {
			window.history.go($rootScope.browseHistory.length - $rootScope.browseHistory.indexOf(url));
			$rootScope.browseHistory.length = $rootScope.browseHistory.indexOf(url) + 1;
		} else {
			$rootScope.browseHistory.length = $rootScope.browseHistory.length - 1;
			window.history.back();
		}
	}
}