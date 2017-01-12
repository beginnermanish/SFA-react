import AjaxUtil from '../../Utils/ajax';
import util from '../../Utils/util';
import common from '../../Utils/common';

export const LOGIN = 'LOGIN'
export const LOGGEDIN = 'LOGGEDIN'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const GET_DATA_START = 'GET_DATA_START'
export const GET_DATA_SUCCESS = 'GET_DATA_SUCCESS'
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
export const SHOW_PROGRESS = 'SHOW_PROGRESS'
export const HIDE_PROGRESS = 'HIDE_PROGRESS'

const requestPosts = url => {
	return {
		type: REQUEST_POSTS,
		url
	}
}

export const updateProgress = (data) => {
	return {
		type: UPDATE_PROGRESS,
		data
	}
}

const showProgress = (data) => {
	return {
		type: SHOW_PROGRESS,
		data
	}
}

const hideProgress = (data) => {
	return {
		type: HIDE_PROGRESS,
		data
	}
}

export const UPDATE_APP_STATUS = "UPDATE_APP_STATUS";

const appStatus = (data) => {
	return {
		type: UPDATE_APP_STATUS,
		data
	}
}

export const updateAppStatus = (data) => {
	return dispatch => {
		dispatch(appStatus(data));
	}
}

export const updateAppProgress = (data) => {
	return dispatch => {
		dispatch(appStatus(data));
	}
}

const processLogin = (existingInfo, isDbSchemaChanged) => {

	/*chekNewVersion().then(function (isFound) {
		if (isFound) {
			common.clearSession();
			return;
		}
	});*/
	//common.appInfo.lastOnlineLogin = new Date();
	if (common.canExportDatabase || !existingInfo || existingInfo.username != common.appInfo.username || isDbSchemaChanged
		|| !existingInfo.isSchemaCreated || existingInfo.roleId != common.appInfo.roleId || existingInfo.version !== common.currentBuildVersion
		|| common.isRoleChanged) {
		common.isRoleChanged = false;
		common.clearSession();
		common.appInfo.isSchemaCreated = false;
		common.appInfo.deleteExistingRecords = false;
		common.appInfo.isInitialDataDownloaded = false;
		//common.fileDownloadState.isAccountGroupDownloaded = false;
		if (common.isNativeApp() && common.enableOfflinePricing && (existingInfo.username != common.appInfo.username || !existingInfo.isPriceEngineInitSyncDone)) {
			//common.showCommonLoading(common.translateText("COMMON.SYNCHRONIZING_PRICE_ENGINE"));
			util.syncPriceEngine(common.priceEngineSyncType.initialSync).then(function (res) {
				if (res.errorCode === common.offlinePriceSyncTimeoutCode) {
					util.hideLoadingMask(true);
					msg.onClose = function (ret) {
						switch (ret) {
							case "1":
								processLogin(existingInfo, isDbSchemaChanged);
								break;
							case "2":
								break;
						}

					}
					msg.data('messageBox').question(String.format(common.translateText('LOGIN.OFFLINE_PRICING_ERROR'), res.result), common.translateText('LOGIN.CLICK_YES_NO'), [{ text: 'Retry', return: 1 }, { text: 'NO', return: 2 }]);
					return;
				}
				if (!res.success) {
					util.hideLoadingMask(true);
					common.appInfo.isPriceEngineInitSyncDone = false;
					util.updateAppInfo();
					msg.data('messageBox').default(common.translateText('LOGIN.PRICE_ENGINE_SYNC_FAILED'), common.translateText("COMMON.PLEASE_TRY_AFTER_SOMETIME"));
					return;
				}
				common.appInfo.isPriceEngineInitSyncDone = true;
				util.updateAppInfo();
				util.downloadSchema();
			});
		}
		else
			util.downloadSchema();
	}
	else if (existingInfo.isSchemaCreated && !existingInfo.isInitialDataDownloaded) {
		common.appInfo.deleteExistingRecords = true;
		common.appInfo.isSchemaCreated = true;
		if (!existingInfo.isPriceEngineInitSyncDone && common.isNativeApp() && common.enableOfflinePricing) {
			//common.showCommonLoading(common.translateText("COMMON.SYNCHRONIZING_PRICE_ENGINE"));
			util.syncPriceEngine(common.priceEngineSyncType.initialSync).then(function (res) {
				if (res.errorCode === common.offlinePriceSyncTimeoutCode) {
					util.hideLoadingMask(true);
					msg.onClose = function (ret) {
						switch (ret) {
							case "1":
								processLogin(existingInfo, isDbSchemaChanged);
								break;
							case "2":
								break;
						}

					}
					msg.data('messageBox').question(String.format(common.translateText('LOGIN.OFFLINE_PRICING_ERROR'), res.result), common.translateText('LOGIN.CLICK_YES_NO'), [{ text: 'Retry', return: 1 }, { text: 'No', return: 2 }]);
					return;
				}
				if (!res.success) {
					util.hideLoadingMask(true);
					common.appInfo.isPriceEngineInitSyncDone = false;
					util.updateAppInfo();
					msg.data('messageBox').default(common.translateText('LOGIN.PRICE_ENGINE_SYNC_FAILED'), common.translateText("COMMON.PLEASE_TRY_AFTER_SOMETIME"));
					return;
				}
				common.appInfo.isPriceEngineInitSyncDone = true;
				util.updateAppInfo();
				util.syncDatabse(common.syncType.initialSync, true);
			});
		}
		else
			util.syncDatabse(common.syncType.initialSync, true);
	}
	else if (existingInfo.isSchemaCreated && existingInfo.isInitialDataDownloaded && !existingInfo.isPriceEngineInitSyncDone && common.enableOfflinePricing) {
		common.appInfo.isSchemaCreated = true;
		common.appInfo.isInitialDataDownloaded = true;
		common.appInfo.deleteExistingRecords = false;
		if (!existingInfo.isPriceEngineInitSyncDone && common.isNativeApp()) {
			//common.showCommonLoading(common.translateText("COMMON.SYNCHRONIZING_PRICE_ENGINE"));
			util.syncPriceEngine(common.priceEngineSyncType.initialSync).then(function (res) {
				if (res.errorCode === common.offlinePriceSyncTimeoutCode) {
					util.hideLoadingMask(true);
					msg.onClose = function (ret) {
						switch (ret) {
							case "1":
								processLogin(existingInfo, isDbSchemaChanged);
								break;
							case "2":
								'';
								break;
						}

					}
					msg.data('messageBox').question(String.format(common.translateText('LOGIN.OFFLINE_PRICING_ERROR'), res.result), common.translateText('LOGIN.CLICK_YES_NO'), [{ text: 'Retry', return: 1 }, { text: 'No', return: 2 }]);
					return;
				}
				if (!res.success) {
					util.hideLoadingMask(true);
					common.appInfo.isPriceEngineInitSyncDone = false;
					util.updateAppInfo();
					msg.data('messageBox').default(common.translateText('LOGIN.PRICE_ENGINE_SYNC_FAILED'), common.translateText("COMMON.PLEASE_TRY_AFTER_SOMETIME"));
					return;
				}
				common.appInfo.isPriceEngineInitSyncDone = true;
				util.updateAppInfo();
				util.syncDatabse(common.syncType.incremenetalSync, true);
			});
		}
		else
			util.syncDatabse(common.syncType.incremenetalSync, true);
	}
	else {
		common.appInfo.isSchemaCreated = true;
		common.appInfo.isInitialDataDownloaded = true;
		common.appInfo.deleteExistingRecords = false;
		if (common.enableOfflinePricing && common.isNativeApp() && ((!existingInfo.lastOnlineLogin || common.daysBetween(new Date(existingInfo.lastOnlineLogin), new Date()) > 0) || !existingInfo.isPriceEngineInitSyncDone)) {
			if (!common.appInfo.isPriceEngineInitSyncDone) {
				//common.showCommonLoading(common.translateText("COMMON.SYNCHRONIZING_PRICE_ENGINE"));
				util.syncPriceEngine(common.priceEngineSyncType.incremenetalSync).then(function (res) {
					if (!res.success) {
						common.appInfo.isPriceEngineInitSyncDone = false;
						util.updateAppInfo();
						util.hideLoadingMask(true);
						return;
					}
					common.appInfo.isPriceEngineInitSyncDone = true;
					util.updateAppInfo();
					util.syncDatabse(common.syncType.incremenetalSync, true);
				});
			}
			else
				util.syncDatabse(common.syncType.incremenetalSync, true);
		}
		else
			util.syncDatabse(common.syncType.incremenetalSync, true);

	}
	util.updateAppInfo();

}

const loggedIn = data => {
	if (data.ServerUrl && data.SessionID) {

		var existingInfo = util.getAppInfo();
		// Added for Ticket -#983.
		if (existingInfo && (!existingInfo.lastOnlineLogin || common.daysBetween(new Date(existingInfo.lastOnlineLogin), new Date()) > 0) && common.getRole() === common.roles.SalesRep && common.appInfo.isSchemaCreated) {
			var dataToBeDelete = [
				'DELETE FROM [OrderItem] WHERE OrderId IN (SELECT Id FROM [Order] WHERE ebMobile__RecordAction__c = -1)',
				'DELETE FROM [Order] WHERE ebMobile__RecordAction__c = -1',
				'DELETE FROM [ebMobile__AssetOrder__c] WHERE ebMobile__RecordAction__c = -1',
				'DELETE FROM [ebMobile__File__c] WHERE ebMobile__RecordAction__c = -1',
				'DELETE FROM [ebMobile__AccountNote__c] WHERE ebMobile__AccountId__c IN (SELECT ebMobile__AccountID__c FROM ebMobile__call__c WHERE ebMobile__RecordAction__c = -1)',
				'DELETE FROM [Task] WHERE AccountId IN (SELECT ebMobile__AccountID__c FROM ebMobile__call__c WHERE ebMobile__RecordAction__c = -1)',
				'DELETE FROM [ebMobile__Call__c] WHERE ebMobile__RecordAction__c = -1',
				'DELETE FROM [ebMobile__SurveyTransactions__c] WHERE ebMobile__RecordAction__c = -1 ',
				'DELETE FROM [ebMobile__AccountStock__c] WHERE ebMobile__RecordAction__c = -1',
				'DELETE FROM [ebMobile__REDSurveys__c] WHERE ebMobile__RecordAction__c = -1',
				'DELETE FROM [ebMobile__AssetTrackingTransaction__c] WHERE ebMobile__RecordAction__c = -1'
			];
			var i = -1, len = dataToBeDelete.length;
			util.promiseFor(function () {
				i += 1;
				return i < len;
			}, function () {
				return new Promise(function (resolve, reject) {
					var table = dataToBeDelete[i].trim();
					util.execute(table).then(function (result) {
						resolve();
					});
				});
			});
		}
		//update current location based on latitude and longitude					
		common.userInfo.returnUrl = data.ServerUrl;
		common.userInfo.sessionId = data.SessionID;
		common.userInfo.fromLogin = true;
		window.localStorage.setItem('sessionId', data.SessionID);
		window.localStorage.setItem('IpAddress', data.IpAddress);
		if (!data.ConfigData.Data || !data.ConfigData.Data.result) {
			common.userInfo.returnUrl = null;
			common.userInfo.sessionId = null;
			//msg.data('messageBox').danger(common.translateText('COMMON.ERROR_OCCURED'), common.translateText('LOGIN.ERROR_RECIEVING_CONFIG_DATA'));
			//util.hideLoadingMask(true);
			return;
		}
		if (!data.ConfigData.Data.success) {
			//msg.data('messageBox').danger(common.translateText('LOGIN.ERROR_RECIEVING_CONFIG_DATA'), data.ConfigData.Data.result);
			//util.hideLoadingMask(true);
			return;
		}
		var configResult = JSON.parse(data.ConfigData.Data.result).records;
		var userInfo = util.getConfigInfo(configResult, "User");
		if (common.getRole() !== common.roles.SalesRep)
			userInfo = userInfo.length > 1 ? userInfo[0] : userInfo;

		common.keepTableRecordsConfig = util.getConfigInfo(configResult, common.getRole() === common.roles.SalesRep ? "ebMobile__MobileObjectConfigure__c" : " ebMobile_ImentorObjectConfigure__c");
		var settings = util.getConfigInfo(configResult, "ebMobile__eBestSFASetting__c");

		if (!util.isNativeApp())
			common.enableOfflinePricing = false;
		else if (typeof (settings.ebMobile__OfflinePricing__c) !== "undefined")
			common.enableOfflinePricing = settings.ebMobile__OfflinePricing__c === "true";
		else if (typeof (settings.Offline_Pricing__c) !== "undefined")
			common.enableOfflinePricing = settings.Offline_Pricing__c === "true";


		if (util.isNativeApp()) {
			var timeValidation = true;//common.validateUserTime(userInfo.ebMobile__LocalTimeGMT__c, userInfo.TimeZoneSidKey);
			if (timeValidation !== true) {
				msg.onClose = function (ret) {
					if (ret === "4") {
						if (typeof MSApp !== "undefined") {
							MSApp.terminateApp(ret);
						} else {
							navigator.app.exitApp();
						}
					}
				}
				msg.data('messageBox').danger('Info', timeValidation);
				util.hideLoadingMask(true);
				return;
			}
		}
		var isDbSchemaChanged = common.getBoolean(userInfo.ebMobile__RequireInitSync__c), serverDate = moment(userInfo.ebMobile__ServerTime__c), syncDelay = Math.round(Number(settings.ebMobile__IncrementalSyncDelayMinutes__c));

		if (!isNaN(syncDelay))
			common.scheduleTime = syncDelay * 60;//Minutes to  seconds

		//common.scheduleTime = 30; //For testing only
		//isDbSchemaChanged = true; //For testing
		common.isSyncFromLogin = true;
		common.appInfo.returnUrl = data.ServerUrl;// Storing this for offline usage
		common.appInfo.sessionId = data.SessionID;// Storing this for offline usage
		common.serverDateTime = serverDate === "Invalid Date" ? new Date() : serverDate;
		common.appInfo.username = userInfo.Username;
		common.appInfo.userId = userInfo.Id;
		common.appInfo.firstName = userInfo.FirstName;
		common.appInfo.name = userInfo.Name;
		common.appInfo.userCode = userInfo.ebMobile__UserCode__c;
		//common.appInfo.password = common.encryptPassword(password).toString(); - TODO 
		common.isBatchDownload = settings.ebMobile__IsBatchDownload__c && settings.ebMobile__IsBatchDownload__c.trim() === "true";
		common.maxDownloadGroupNumber = Math.round(Number(common.getRole() === common.roles.SalesRep ? settings.ebMobile__MaxGroupNumber__c : settings.ebMobile__iMentorMaxGroup__c));
		common.fileThreadScheduleTime = Math.round(Number(settings.ebMobile__FileThreadScheduleTime__c)) * 60;//Minutes to seconds
		common.appInfo.version = settings.ebMobile__VersionNumber__c;
		common.appInfo.iMentorVersion = settings.ebMobile__iMentorVersion__c;
		common.appInfo.sfdcApiVersion = settings.ebMobile__SFDCApiVersion__c;
		common.appInfo.roleId = userInfo.UserRoleId;
		common.appInfo.countryCode = userInfo.ebMobile__CountryCode__c;
		common.appInfo.modifiableTables = existingInfo.modifiableTables;
		common.appInfo.lastEventUpdate = existingInfo.lastEventUpdate;
		if (common.isNativeApp() && common.enableOfflinePricing) {
			common.checkPriceEngineAvailable().then(function (status) {
				if (status === 2) {
					util.hideLoadingMask(true);
					util.setAppInfo("isPriceEngineInitSyncDone", false);
					msg.onClose = function () {
						navigator.app.exitApp();
					}
					msg.data('messageBox').default(common.translateText("COMMON.PRICE_ENGINE_NOT_FOUND"), common.translateText("COMMON.PLEASE_INSTALL_TRY_AGAIN"));
					return;
				}
				if (status === 3) {
					//util.hideLoadingMask(true);
					util.setAppInfo("isPriceEngineInitSyncDone", false);
					common.enableOfflinePricing = false;
					//msg.data('messageBox').default("Application error", "Price engine service not handled for this device, contact administrator.");
					//return;
				}
				processLogin(existingInfo, isDbSchemaChanged);

			});
			return;
		}
		processLogin(existingInfo, isDbSchemaChanged);

	}
	else {
		util.hideLoadingMask(true);
		msg.data('messageBox').default(common.translateText("LOGIN.LOGIN_FAILED"), common.translateText("LOGIN.INVALID_UNAME_PWD"));
	}
	return {
		type: LOGGEDIN,
		data
	}
}

export const login = (username, password, context) => {
	var options = {
		controller: 'Login',
		method: 'POST',
		params: {
			returnUrl: null,
			sessionId: null,
			username: 'yen.5s@dev.com',
			password: 'eBest@2016',
			deviceId: 'cd18ace1-c48f-446b-8069-731464315b3d',
			role: 'SalesRep'
		}
	}
	return dispatch => {
		dispatch(updateProgress({ isSpinner: true, text: 'Logging in...' }));
		AjaxUtil.ajax(options).then(function (response) {
			//dispatch(hideProgress());
			dispatch(loggedIn(response));
		}, function (response) {
			console.log(response);
		})
	}
};
