import common from './common';
import * as action from '../Redux/actions'

export default {
	
	getCommonParams: function(){
		return {};
	},
	
	ajax: function (options) {
		var controller = options.controller, params = options.params || {};
		var me = this;
		var param = options.ignoreDefaultParams ? {} : me.getCommonParams();
		me.lastUploadProgress = null;
		me.lastDownloadProgress = null;
		for (var o in params) {
			param[o] = params[o];
		}
		return new Promise(function (resolve, reject) {
			$.ajaxSetup({ timeout: options.timeout || common.networkTimout });
			me.activeRequest = $.ajax({
				url: common.getServerController(controller),
				data: param,
				timeout: options.timeout || common.networkTimout,
				type: options.method || 'GET',
				dataType: 'json',
				cache: false,
				success: function (response) {
					me.activeRequest = null;
					resolve(response);
				},
				error: function (jqXHR, error) {
					me.activeRequest = null;
					var errorMsg = error;
					if (jqXHR.status === 0) {
						errorMsg = 'Not connect.\n Verify Network.';
					} else if (jqXHR.status == 404) {
						errorMsg = 'Requested page not found. [404]';
					} else if (jqXHR.status == 500) {
						errorMsg = 'Internal Server Error [500].';
					} else if (exception === 'parsererror') {
						errorMsg = 'Requested JSON parse failed.';
					} else if (exception === 'timeout') {
						errorMsg = 'Time out error.';
					} else if (exception === 'abort') {
						errorMsg = 'Ajax request aborted.';
					} else {
						errorMsg = 'Uncaught Error.\n' + jqXHR.responseText;
					}
					reject([jqXHR, error || errorMsg]);
				},
				xhr: function () {
					var xhr = new window.XMLHttpRequest();
					//Upload progress
					xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							//Do something with upload progress										
							if (!(percentComplete == 1 && !me.lastUploadProgress))
								common.store.dispatch(action.updateProgress({ isProgressSpinner:true, isSpinner: true, progressValue: percentComplete * 100, text: common.translateText('COMMON.UPLOADING_DATA') }))
							me.lastUploadProgress = percentComplete;
						}
					}, false);
					//Download progress
					xhr.addEventListener("progress", function (evt) {
						console.log(evt);
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;				
							
							if (!(percentComplete == 1 && !me.lastDownloadProgress))
								common.store.dispatch(action.updateProgress({ isProgressSpinner:true, isSpinner: true, progressValue: percentComplete * 100, text: common.translateText('COMMON.DOWNLOADING_DATA') }))

							me.lastDownloadProgress = percentComplete;
						}
					}, false);
					return xhr;
				}
			});
		});
	}
}
