import common from './common'
import * as action from '../Redux/actions'
import { browserHistory } from 'react-router'

var databaseFileName = "ebest.db", localDatabaseName = "eBestDBnew";
export default {
	dataSplitCharacter: '▏',//This is a special character not the following character |

	syncStatus: {
		msg: null,
		time: new Date(),
		state: common.syncState.end //default values for initializing incremental sync
	},
	fileThreadStatus: common.threadState.end,
	activeRequest: null,
	canShowMainForm: null,
	/**
	 * showLoadingMask - function to show loading text with loading text that was passed
	 * @param {String} loadingText - loading text is the display value that view on loading mask
	 * @param {Boolean} isForced - boolean value to define the loading mask forced to load or not
	 * */
	showLoadingMask: function (loadingText, isForced) {
		action.updateAppStatus({ 'isSynchronizing': true });
		if (common.canShowLoadingMask || isForced)
			common.store.dispatch(action.updateProgress({ isSpinner: true, text: loadingText }))

	},
	/**
	 * hideLoadingMask - function to hide the loading mask
	 * @param {Boolean} isForced - boolean value to define the loading mask forced to close or not
	 * */
	hideLoadingMask: function (isForced) {
		action.updateAppStatus({ 'isSynchronizing': this.fileThreadStatus == common.threadState.running || this.syncStatus.state == common.syncState.running });
		if (common.canShowLoadingMask || isForced) {
			common.canShowLoadingMask = false;
			action.updateAppStatus({ 'hideProgress': true });
		}

	},
	exportDb: null,
	/**
	 * loadDatabaseFromFile - function to load database from the local storage
	 * @param {Boolean} isProcessLoginSuccess - boolean value to check whether the login success or not
	 * */
	loadDatabaseFromFile: function (isProcessLoginSuccess) {
		var me = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', databaseFileName, true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = function (e) {
			var uInt8Array = new Uint8Array(this.response);
			var db = new SQL.Database(uInt8Array);
			me.postDatabase(db);
			var totalTables = db.exec("select * from sqlite_master where type='table'")[0].values.length;
			//console.log(String.format("Totally {0} Tables loaded", totalTables));
			if (isProcessLoginSuccess)
				me.showMain();
		};
		xhr.send();
	},
	/**
	 * toBinString - function to change the array value to binary string
	 * @param {Array} arr -Array value to be change in binary
	 * */
	toBinString: function (arr) {
		var uarr = new Uint8Array(arr);
		var strings = [], chunksize = 0xffff;
		// There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
		for (var i = 0; i * chunksize < uarr.length; i++) {
			strings.push(String.fromCharCode.apply(null, uarr.subarray(i * chunksize, (i + 1) * chunksize)));
		}
		return strings.join('');
	},
	getCommonParams: function () {
		return { returnUrl: common.userInfo.returnUrl, sessionId: common.userInfo.sessionId };
	},
	/**
	 * createIndex - function to create a index for event,contact
	 * */
	createIndex: function () {
		if (common.getRole() === common.roles.SuperVisor)
			return;
		this.execute("CREATE INDEX index_recordTypeName ON Event (ebMobile__RecordTypeName__c);");
		this.execute("CREATE INDEX index_contact_accId ON Contact (AccountId);");
		this.execute("CREATE INDEX index_event_accId ON Event (AccountId);");
		this.execute("CREATE INDEX index_contact_primary ON Contact (ebMobile__Primary__c);");
	},
	/**
	 * updateAppInfo - function to update Application Info to local storage
	 * */
	updateAppInfo: function (info) {
		window.localStorage.setItem("appInfo", JSON.stringify(info || common.appInfo));
	},
	setAppInfo: function (field, val) {
		var me = this, info = window.localStorage.getItem("appInfo");
		if (info) {
			var data = JSON.parse(info);
			for (var s in data) {
				if (s == field) {
					data[s] = val;
				}
			}
			me.updateAppInfo(data);
		}

	},
	getAppInfo: function () {
		var info = window.localStorage.getItem("appInfo");
		return info ? JSON.parse(info) : common.appInfo;
	},

	/**
	 * toBinArray - function to change the string value to binary
	 * @param {String} str - string value to change binary
	 * */
	toBinArray: function (str) {
		var l = str.length,
			arr = new Uint8Array(l);
		for (var i = 0; i < l; i++) arr[i] = str.charCodeAt(i);
		return arr;
	},

	emailNotifyRunner: function () {
		//console.log('email notify running');
	},
	/**
	 * showMain - function to show main from login
	 * @param {Boolean} forceLogin - boolean value to check the login is forced or not
	 * */
	showMain: function (forceLogin) {
		var me = this;
		$('body').css('background', '');

		if (!forceLogin) {
			//$location.path(common.getRole() === common.roles.SalesRep ? '/welcome' : '/im_welcome');
			browserHistory.push('/welcome');
		} else {
			browserHistory.push('/welcome');
			//window.location = common.getRole() === common.roles.SalesRep ? '#welcome' : '#im_welcome';
		}

		common.appInfo.lastOnlineLogin = new Date();
		me.updateAppInfo();
		common.loginTime = new Date();

	},

	isPhoneGap: function () {
		return !!window.cordova;
	},
	/**
	 * getDatabase - function to get database from the local storage
	 * */
	getDatabase: function () {
		var prefix = '';

		if (common.getRole() === common.roles.SuperVisor) {
			//prefix = 'im_';
		}

		var me = this, database;

		if (me.database)
			return me.database;

		var databaseOptions = {
			fileName: prefix + localDatabaseName,
			version: "1.0",
			displayName: prefix + "ebestDB",
			maxSize: 1024 * 4
		};

		if (me.isPhoneGap() && common.getPlatform() === 'windows') {
			database = window.sqlitePlugin.openDatabase(databaseOptions.fileName,
				databaseOptions.version,
				databaseOptions.displayName,
				databaseOptions.maxSize);
		} else {
			database = openDatabase(
				databaseOptions.fileName,
				databaseOptions.version,
				databaseOptions.displayName,
				databaseOptions.maxSize
			);
		}
		me.database = database;
		return database;
		/*
		if (!window.localStorage.getItem(localDatabaseName))
			return new SQL.Database();
		return new SQL.Database(me.toBinArray(window.localStorage.getItem(localDatabaseName)));
		*/
	},
	/**
	 * saveModel - function to save model for all tables
	 * @param {Object} arg - arguments that passed for inserting model to table
	 * */
	saveModel: function (arg) {
		var me = this, model = arg;
		var fields = model.fields, sql = 'INSERT INTO ' + model.modelName + ' (' + fields.join(',') + ') VALUES (';
		var args = [];
		for (var i = 0, len = fields.length; i < len; i++) {
			args[i] = model[fields[i]];
			sql += (i == 0 ? '' : ',') + '?';
		}
		sql += ')';
		me.execute(sql, args);
	},
	/**
	 * execute - function to execute the query with parameters
	 * @param {String} query - query that want to execute on database
	 * @param {Object} params - parameters that passed for executing query
	 * */
	execute: function (query, params) {
		var me = this;
		if (common.canExportDatabase) {
			if (!me.exportDb) {
				me.exportDb = new SQL.Database();
				console.log('Preparing for export database.');
			}

			if (query.indexOf('INSERT INTO ClientAppLog') == -1)
				me.exportDb.exec(query);
		}

		return new Promise(function (resolve, reject) {
			var db = me.getDatabase();

			if (typeof (query) === "string")
				query = [{ query: query, params: params }];
			else if (query && query.length === 0) {
				resolve({}, { rows: [] });
				return;
			}

			db.transaction(
				function (transaction) {
					var res = [];
					_.forEach(query, function (value, key) {
						transaction.executeSql((value.query),
							value.params,
							function (transaction, results) {
								res.push(arguments);

								if (query.length === key + 1)
									resolve(res.length === 1 ? res[0] : res);
							},
							function (transaction, error) {
								reject(error);
								me.errorHandler(error, query);
							});
					});

				},
				function (error) {
					console.error(error && error.message ? error.message : 'Transaction error');
					console.log(query);
					reject(error);
				}
			);
		}).catch(function (args) {
			me.errorHandler(args);
		});
	},
	errorHandler: function (error, query) {
		console.error(error && error.message ? error.message : 'Query Error ');
		console.log(query);
	},
	/**
	 * createTable - function to create table with the given name
	 * @param {Object} table - table object contain the new information about the table
	 * */
	createTable: function (table) {
		var me = this;
		var promise = new Promise(function (resolve, reject) {
			var tableName = table.ObjName, fields = table.FieldInfo, fieldString = "";

			me.execute(String.format("DROP TABLE IF EXISTS [{0}]", tableName)).then(function () {

				var i = -1, len = fields.length;
				me.promiseFor(function () {
					i += 1;
					return i < len;
				}, function () {
					return new Promise(function (resolve, reject) {
						var value = fields[i];
						if (value) {
							me.getField(value, tableName, table).then(function (res) {
								fieldString += String.format("{0},", res);
								resolve();
							});
						}
						else {
							//console.log("Null colums found in the table " + tableName);
							resolve();
						}

					});
				}).then(function () {
					if (fieldString.indexOf(",") != -1) {
						var isSfdcTable = fieldString.indexOf(me.getRecordActionField(tableName)) !== -1, createTableQueries = [];
						var query = String.format("CREATE TABLE IF NOT EXISTS [{0}] ({1})", tableName, fieldString.slice(0, -1));
						//console.log(query);
						me.execute(query).then(function () {
							//console.log("Created table " + tableName);
							resolve(isSfdcTable ? tableName : null);
						});
						return;
					}
					//console.log("No fields found in the table " + tableName);
					resolve();
				});

			});
		});

		return promise;
	},
	keepSchemaInfoObjects: ['Account', 'Event', 'ebMobile__Asset__c', 'ebMobile__AssetAccount__c', 'ebMobile__AssetModel__c', 'ebMobile__AssetTrackingTransaction__c', 'ebMobile__AssetOrder__c', 'ebMobile__CustomerOnboarding__c'],
	/**
	 * getField - function to get fields from the tables
	 * @param {Object} value - value of the table field information
	 * @param {String} fields - fileds that is need to get
	 * @param {Object} tableObject - table object
	 * */
	getField: function (value, tableName, tableObject) {
		var me = this;
		return new Promise(function (resolve, reject) {
			var type = value.type, len = value.byteLength, fieldName = value.fieldApiName, isRequired = value.required, isAccessible = value.isAccessible, fieldLabel = value.fieldLabel, isPrimarykey = value.isPrimaryKey, autoIncrement = value.autoIncrement;
			var field = fieldName;
			if (me.keepSchemaInfoObjects.indexOf(tableName) !== -1) {
				var query = String.format('INSERT INTO [SchemaInfo] (TableName, FieldName, DataType, FieldLabel, IsUpdateable, IsAccessible, IsCreateable, IsDeletable, IsObjectAccessible, IsObjectCreateable, IsObjectDeletable, IsObjectUpdateable) ' +
					'VALUES ("{0}", "{1}", "{2}", "{3}", {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11})', tableName, value.fieldApiName, type, fieldLabel, value.isUpdateable ? 1 : 0, isAccessible ? 1 : 0, value.isCreateable ? 1 : 0, value.IsDeletable ? 1 : 0, tableObject.IsAccessible ? 1 : 0, tableObject.IsCreateable ? 1 : 0, tableObject.IsDeletable ? 1 : 0, tableObject.IsUpdateable ? 1 : 0);
				me.execute(query).then(function (result) {
					//console.log("Schema info Inserted   " + query);
				});
			}
			if (type.startsWith("PICKLIST") || type.startsWith("MULTIPICKLIST")) {
				var startIndex = type.indexOf('('), records = [], endIndex = type.lastIndexOf(')'), picklistValues = type.substring(startIndex + 1, endIndex).split(','), fields = "DisplayValue, ParentTableName, ParentFieldName";

				_.forEach(picklistValues, function (value, key) {
					records.push(value + me.dataSplitCharacter + tableName + me.dataSplitCharacter + fieldName);
				});

				me.processBulkTableData(records, "eBest__Lookup", fields.split(','), fields, 0).then(function () {
					resolve(me.getFormatedFieldValues(type, field, isPrimarykey, isRequired, autoIncrement));
				});
				return;
			}
			resolve(me.getFormatedFieldValues(type, field, isPrimarykey, isRequired, autoIncrement));

		});
	},
	/**
	 * getFormatedFieldValues - function to formated field value on database
	 * @param {String} type - filed data type
	 * @param {String} field - name of the field
	 * @param {Boolean} isPrimarykey - boolean value to check the field is primary or not
	 * @param {Boolean} isRequired - boolean value to check the field is required or not
	 * @param {Boolean} autoIncrement - boolean value to check the field auto increement one or not
	 * */
	getFormatedFieldValues: function (type, field, isPrimarykey, isRequired, autoIncrement) {
		var dataType, fieldName = String.format('{0}', field);
		switch (type) {
			case "BOOLEAN":
				dataType = "NUMERIC";
				break;
			case "LONG":
			case "INT":
			case "INTEGER":
			case "DATE":
			case "DATETIME":
			case "DOUBLE":
			case "REAL":
				dataType = type;
				break;
			default:
				dataType = "TEXT";
				break;
		}
		field += String.format(" {0}", dataType);
		if (isRequired)
			field += String.format(" {0}", "NOT NULL");
		if (isPrimarykey || fieldName === 'Id')
			field += String.format(" {0}", "PRIMARY KEY");
		if (autoIncrement)
			field += String.format(" {0}", "ASC");

		return field;
	},
	getLookupTableSchema: function () {
		return { ObjName: "eBest__Lookup", FieldInfo: [{ type: "INTEGER", fieldApiName: "Id", isPrimaryKey: true, autoIncrement: true }, { type: "STRING", fieldApiName: "DisplayValue" }, { type: "STRING", fieldApiName: "ParentTableName" }, { type: "STRING", fieldApiName: "ParentFieldName" }] };
	},
	getLogTableSchema: function () {
		return { ObjName: "ClientAppLog", FieldInfo: [{ type: "INTEGER", fieldApiName: "Id", isPrimaryKey: true, autoIncrement: true }, { type: "STRING", fieldApiName: "Message" }, { type: "DATE", fieldApiName: "Time" }, { type: "STRING", fieldApiName: "State" }] };
	},
	getTableSchemaInfo: function () {
		return { ObjName: "SchemaInfo", FieldInfo: [{ type: "INTEGER", fieldApiName: "Id", isPrimaryKey: true, autoIncrement: true }, { type: "STRING", fieldApiName: "TableName" }, { type: "STRING", fieldApiName: "FieldName" }, { type: "STRING", fieldApiName: "DataType" }, { type: "STRING", fieldApiName: "FieldLabel" }, { type: "INTEGER", fieldApiName: "IsUpdateable" }, { type: "INTEGER", fieldApiName: "IsAccessible" }, { type: "INTEGER", fieldApiName: "IsCreateable" }, { type: "INTEGER", fieldApiName: "IsDeletable" }, { type: "INTEGER", fieldApiName: "IsObjectAccessible" }, { type: "INTEGER", fieldApiName: "IsObjectCreateable" }, { type: "INTEGER", fieldApiName: "IsObjectDeletable" }, { type: "INTEGER", fieldApiName: "IsObjectUpdateable" }] };
	},
	getSyncLogTableSchema: function () {
		return { ObjName: "SyncLog", FieldInfo: [{ type: "INTEGER", fieldApiName: "Id", isPrimaryKey: true, autoIncrement: true }, { type: "STRING", fieldApiName: "CustomerId" }, { type: "STRING", fieldApiName: "CallId" }, { type: "STRING", fieldApiName: "Type" }, { type: "DATETIME", fieldApiName: "SyncDate" }, { type: "STRING", fieldApiName: "Status" }, { type: 'INTEGER', fieldApiName: 'LogType' }, , { type: 'INTEGER', fieldApiName: 'AssociationId' }] };
	},
	/**
	 * updateSyncStatus - function to update the sync status
	 * @param {String} msg - Message that for update sync status
	 * @param {String} time - time of the sync
	 * @param {String} state - state of the sync
	 * */
	updateSyncStatus: function (msg, time, state) {
		var me = this;
		me.syncStatus = { msg: msg, time: time, state: state };
		//var log = new Sfa.Model.ClientAppLog({ Message: msg, Time: time, State: state });
		//me.saveModel(log);
		console.log(me.syncStatus);
	},
	/**
	 * getLastSyncTime - function to get the get the last sync time
	 * */
	getLastSyncTime: function () {
		var date = window.localStorage.getItem('lastSyncTime');
		return date ? new Date(date) : new Date();
	},
	setLastSyncTime: function (time) {
		var me = this;
		me.updateSyncTimeOnServer();
		window.localStorage.setItem('lastSyncTime', time);
	},
	/**
	 * downloadRemoteSchema - function to download remote schema from schema controller
	 * */
	downloadRemoteSchema: function () {
		var me = this;
		var promise = new Promise(function (resolve, reject) {
			var params = { "role": common.getRole() };
			me.ajax({
				controller: 'Schema',
				params: params
			}).then(function (response) {
				if (response.success) {
					var data = JSON.parse(response.result);
					if (data.length === 0) {
						reject({ error: 'No schema available for this user/role' });
					}
					else if (!data || (data && data[0].ErrorInfo)) {
						reject({ error: data[0].ErrorInfo });
					} else {
						resolve(data);
					}
				} else {
					reject({ error: response.result });
				}
			}, function (result) {
				var request = result[0], error = result[1];
				reject({ error: error || "Server Error" });
			});
		});
		return promise;
	},

	promiseFor: function (condition, action) {
		return new Promise(function (resolve, reject) {
			var loop = function () {
				if (!condition(resolve.length)) return resolve();
				return Promise.resolve(action())
					.then(loop)
					.catch(function (e) {
						reject(e);
					});
			};
			process.nextTick(loop);
		});
	},
	/**
	 * downloadSchema - function to download schema from the created schema
	 * */
	downloadSchema: function () {
		var util = this;
		var logSchema = util.getLogTableSchema(), lookupSchema = util.getLookupTableSchema(), schemaInfo = util.getTableSchemaInfo(), syncLog = util.getSyncLogTableSchema(), modifiableTables = [];

		common.store.dispatch(action.updateProgress({ isSpinner: true, text: common.translateText('COMMON.LOADING_SCHEMA') }));

		util.createTable(logSchema)
			.then(function () {
				util.updateSyncStatus("Loading schema", new Date(), common.syncState.running);
				//console.log("Loading schema...");
				return util.createTable(schemaInfo);
			}).then(function () {
				return util.createTable(lookupSchema);
			}).then(function () {
				return util.createTable(syncLog);
			}).then(function () {
				return util.downloadRemoteSchema();
			}).then(function (data) {
				action.updateAppStatus({ isSpinner: false, progressText: common.translateText('COMMON.PROCESSING_SCHEMA') });
				common.store.dispatch(action.updateProgress({ isSpinner: true, text: common.translateText('COMMON.PROCESSING_SCHEMA') }));
				util.updateSyncStatus("Schema loaded", new Date(), common.syncState.running);
				//console.log("Schema loaded...");
				var i = -1, len = data.length;
				util.promiseFor(function () {
					i += 1;
					return i < len;
				}, function () {
					return new Promise(function (resolve, reject) {
						util.createTable(data[i]).then(function (modifiableTable) {
							if (modifiableTable) {
								modifiableTables.push(modifiableTable);
							}
							resolve();
						});
					});
				}).then(function () {
					util.updateSyncStatus(String.format("Database and {0} tables created", data ? data.length : 0), new Date(), common.syncState.end);
					common.appInfo.modifiableTables = modifiableTables;
					util.createIndex();
					common.appInfo.isSchemaCreated = true;
					util.updateAppInfo();
					util.syncDatabse(common.syncType.initialSync, true);
				});
			}, function (errorInfo) {
				common.appInfo.isSchemaCreated = false;
				common.appInfo.isInitialDataDownloaded = false;
				util.updateAppInfo();
				util.updateSyncStatus("Error occurred while receiving schema", new Date(), common.syncState.error);
				util.updateSyncError(String.format("Error while downloading schema - {0}", errorInfo.error));
				msg.onClose = function (ret) {
					if (ret === "4") {
						$location.path('/login');
					}
				}
				msg.data('messageBox').default(common.translateText('COMMON.ERROR_OCCURED_WHILE_RECIEVING_SCHEMA'), errorInfo.error);
			});
	},
	/**
	 * ajax - Ajax call to connect application with server
	 * @param {Object} options - options contains server call information
	 * */
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
								action.updateAppStatus({ isSpinner: true, progressValue: percentComplete * 100, progressText: common.translateText('COMMON.UPLOADING_DATA') });

							me.lastUploadProgress = percentComplete;
						}
					}, false);
					//Download progress
					xhr.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							//Do something with download progress							

							if (!(percentComplete == 1 && !me.lastDownloadProgress))
								action.updateAppStatus({ isSpinner: true, progressValue: percentComplete * 100, progressText: common.translateText('COMMON.DOWNLOADING_DATA') });

							me.lastDownloadProgress = percentComplete;
						}
					}, false);
					return xhr;
				}
			});
		});
	},
	/**
	 * updateSyncTimeOnServer - function to update sync time to server
	 * */
	updateSyncTimeOnServer: function () {
		var me = this;
		this.ajax({
			controller: 'UpdateSyncSuccess',
			method: 'POST',
			params: {
				deviceId: common.getClientId(),
				role: common.getRole(),
				username: me.getAppInfo().username
			}
		}).then(function (response) {
			if (response.success) {
				//console.log("Last sync time updated successfully.");
			} else {
				me.updateSyncError(String.format("Error while updating last sync time - {0}", response.result));
			}
		}, function (result) {
			var request = result[0], error = result[1];
			me.updateSyncError(String.format("Error while updating last sync time - {0}", error));
		});
	},
	/**
	 * getTableValues - function to get table values
	 * @param {Object} record - record of the value fields 
	 * @param {Object} fieldsArray - Array of the fields
	 * @param {String} idFieldIndex - Id of the filed index
	 * */
	getTableValues: function (record, fieldsArray, idFieldIndex) {
		var me = this;
		var valueFields = record.split(me.dataSplitCharacter), values = "", id = 0, updateValues = "";
		_.forEach(valueFields, function (value, key) {
			var val = value.trim();
			var isNum = val.length === 0 ? false : isFinite(Number(val)), isBoolean = false;

			//Condition added for validating number leading zero
			if (isNum)
				isNum = !(val.substring(0, 1) === "0" && val.length > 1);

			if (key === idFieldIndex) {
				id = val;
			}

			if (typeof val === "string" && val.toLowerCase() === "true") {
				isBoolean = true;
				val = 1;
			}

			if (typeof val === "string" && val.toLowerCase() === "false") {
				isBoolean = false;
				val = 0;
			}

			if (isNum) {
				values += String.format('{0}, ', Number(val));
				updateValues += String.format('{0} = {1}, ', fieldsArray[key], Number(val));
			}
			else if (isBoolean) {
				values += String.format('{0}, ', val);
				updateValues += String.format('{0} = {1}, ', fieldsArray[key], val);
			}
			else {

				if (typeof (val) === 'string' && val.indexOf('"') != -1)
					val = val.split('"').join("'"); //Replaceing all double coat's to single coat's.

				values += String.format('"{0}", ', val);
				updateValues += String.format('{0} = "{1}", ', fieldsArray[key], val);
			}

		});
		var valString = values.trim().slice(0, -1);
		var updateValString = updateValues.trim().slice(0, -1);
		return { valueFields: valueFields, valString: valString, id: id, updateValString: updateValString };
	},
	/**
	 * updateRecords - function to update records to table 
	 * @param {Object} record - that modified records or new records
	 * @param {String} tableName - name of the table
	 * @param {Array} fieldsArray - Array of fields
	 * @param {Array} fields - fields that want to update
	 * @param {String} idFieldIndex - Index field ID
	 * */
	updateRecords: function (record, tableName, fieldsArray, fields, idFieldIndex) {
		var me = this;
		var res = me.getTableValues(record, fieldsArray, idFieldIndex);
		var valString = res.valString, updateValString = res.updateValString, id = res.id;

		var query = "";

		query = String.format('SELECT "x" FROM [{0}] WHERE Id = "{1}"', tableName, id);
		var promise = new Promise(function (resolve, reject) {
			me.execute(query).then(function (result) {
				if (result[1].rows.length > 0) {
					query = String.format('UPDATE [{0}] SET {1} WHERE Id="{2}"', tableName, updateValString, id);
				}
				else {
					query = String.format('INSERT INTO [{0}] ({1}) VALUES ({2})', tableName, fields, valString);
				}

				me.execute(query).then(function (result) {
					//console.log("Record processed " + query);
					resolve();
				});

			});
		});

		return promise;

	},
	/**
	 * processTableData - function to process table data
	 * @param {Object} record - that modified records or new records
	 * @param {String} tableName - name of the table
	 * @param {Array} fieldsArray - Array of fields
	 * @param {Array} fields - fields that want to update
	 * @param {String} idFieldIndex - Index field ID
	 * */
	processTableData: function (records, tableName, fieldsArray, fields, idFieldIndex) {
		var me = this;
		return new Promise(function (resolve, reject) {
			var j = -1, row = records.length;
			me.promiseFor(function () {
				j += 1;
				return j < row;
			}, function () {
				return new Promise(function (resolve, reject) {
					me.updateRecords(records[j], tableName, fieldsArray, fields, idFieldIndex).then(function (res) {
						resolve();
					});

				});
			}).then(function () {
				resolve();
			});
		});
	},

	processTableDataNew: function (records, tableName, fieldsArray, fields, idFieldIndex) {
		var me = this;
		return new Promise(function (resolve, reject) {
			//console.log('Records to insert or update - ' + records.length);
			me.processBulkTableData(records, tableName, fieldsArray, fields, idFieldIndex, true).then(function () {
				//Execute Update and insert record 
				resolve();
			});
		});
	},
	/**
	 * processBulkTableData - function to process bulk of data on database
	 * @param {Object} record - that modified records or new records
	 * @param {String} tableName - name of the table
	 * @param {Array} fieldsArray - Array of fields
	 * @param {Array} fields - fields that want to update
	 * @param {String} idFieldIndex - Index field ID
	 * */
	processBulkTableData: function (records, tableName, fieldsArray, fields, idFieldIndex, withReplace) {
		var me = this;
		return new Promise(function (resolve, reject) {
			var valuePart = "", count = 0, limit = 500, compountStatements = [];

			if (records.length === 0) {
				resolve();
				return;
			}
			_.forEach(records, function (record, index) {
				var res = me.getTableValues(record, fieldsArray, idFieldIndex);
				valuePart += valuePart ? ", (" + res.valString + ")" : "(" + res.valString + ")";
				count++;
				if (count >= limit) {
					compountStatements.push(valuePart);
					count = 0;
					valuePart = "";
				}
			});

			if (valuePart)
				compountStatements.push(valuePart);

			var i = -1, len = compountStatements.length;
			me.promiseFor(function () {
				i += 1;
				return i < len;
			}, function () {
				return new Promise(function (resolve, reject) {
					var statement = compountStatements[i];

					var query = String.format('INSERT {3} INTO [{0}] ({1}) VALUES {2}', tableName, fields, statement, withReplace ? 'OR REPLACE' : '');
					me.execute(query).then(function (result) {
						//console.log("Table data processed " + query);
						resolve();
					});


				});
			}).then(function () {
				resolve();
			});

		});
	},
	/**
	 * manipulateData - function to manipulate data from the database 
	 * @param {Object} fields - fields that will manipulate data from database
	 * @param {String} type - type of the sync process
	 * @param {Boolean} showMain - boolean value to check main will show or not
	 * @param {Object} inputParams - input parameters to manipulate the data
	 * @param {Boolean} isCallSync - boolean value to check the call sync
	 * @param {String} callId - value of the cal ID
	 * */
	manipulateData: function (data, type, showMain, inputParams, isCallSync, callId) {
		var me = this;
		return new Promise(function (resolve, reject) {
			var tables = data.records, error = data.Error, isSuccess = true;
			var msg = String.format("Downloaded data and manipulating {0} tables records", tables ? tables.length : 0);
			if (error) {
				msg = String.format("Downloaded data error - {0}", error);
				me.updateSyncStatus(msg, new Date(), common.syncState.end);
				//console.log(msg);
				isSuccess = false;
			}
			action.updateAppStatus({ isSpinner: false, progressText: common.translateText('COMMON.PROCESSING_DATA') });
			common.store.dispatch(action.updateProgress({ isSpinner: true, text: common.translateText('COMMON.PROCESSING_DATA') }));
			me.updateSyncStatus(msg, new Date(), common.syncState.running);

			var i = -1, len = tables.length;
			me.promiseFor(function () {
				i += 1;
				return i < len;
			}, function () {
				return new Promise(function (resolve, reject) {
					var table = tables[i];
					var tableName = table.name, fields = table.fields, records = table.values, fieldsArray = table.fields.split(','), idFieldIndex = fieldsArray.indexOf("Id");
					if (idFieldIndex === -1)
						idFieldIndex = fieldsArray.indexOf("Id");

					if (idFieldIndex === -1) {
						var err = String.format("Error processing data, table - {0} Id field not found", tableName);
						me.updateSyncStatus(err, new Date(), common.syncState.error);
						//console.log(err);
						resolve();
						return;
					}
					if (type === common.syncType.initialSync) {
						if (common.appInfo.deleteExistingRecords) {
							var query = String.format('DELETE FROM [{0}]', tableName);
							me.execute(query).then(function (result) {
								//console.log("Deleted existing records " + query);
								me.processBulkTableData(records, tableName, fieldsArray, fields, idFieldIndex).then(function () {
									resolve();
								});
							});
						}
						else {
							me.processBulkTableData(records, tableName, fieldsArray, fields, idFieldIndex).then(function () {
								resolve();
							});
						}

					}
					else {

						if (records.length > 0 && inputParams.eventFlag === 1 && tableName === "Event") {
							me.deleteEventData().then(function () {
								me.processTableData(records, tableName, fieldsArray, fields, idFieldIndex).then(function () {
									common.appInfo.lastEventUpdate = new Date();
									me.updateAppInfo();
									resolve();
								});
							});
							return;
						}
						//console.time('processTime')
						me.processTableDataNew(records, tableName, fieldsArray, fields, idFieldIndex).then(function () {
							//console.timeEnd('processTime')
							resolve();
						});
					}

				});
			}).then(function () {
				common.appInfo.deleteExistingRecords = false;
				if (type === common.syncType.initialSync) {
					common.appInfo.isInitialDataDownloaded = true;

					if (isSuccess)
						common.appInfo.lastEventUpdate = new Date();

					me.updateAppInfo();
				}

				if (isSuccess) {
					me.deleteTempRecords(isCallSync, callId).then(function () {
						me.deleteExistingRecords().then(function () {
							me.updateSyncLog(isCallSync, common.syncLogStatus.success, callId).then(function () {
								me.showMainFromLogin(showMain);
								resolve();
							});
						});
					});
				}
				else {
					me.updateSyncLog(isCallSync, common.syncLogStatus.failed, callId).then(function () {
						me.showMainFromLogin(showMain);
						resolve();
					});
				}
				me.setLastSyncTime(new Date());
				me.updateSyncStatus("Synchronization completed", new Date(), common.syncState.end);
			});
		});
	},
	/**
	 * showMainFromLogin - function to show main on login
	 * @param {Boolean} showMain - boolean value to show the login page
	 * */
	showMainFromLogin: function (showMain) {
		var me = this;
		me.canShowMainForm = showMain;
		if (common.getRole() === common.roles.SalesRep)
			me.downloadAttachament();
		me.showWelcome();
		common.isSyncFromLogin = false;
	},
	/**
	 * showWelcome - function to show welcome page
	 * */
	showWelcome: function () {
		var me = this;
		if (common.canExportDatabase)
			me.createLocalDb();

		if (me.canShowMainForm) {
			me.canShowMainForm = false
			me.loadingText = common.translateText('COMMON.LOADING_APPLICATION');
			me.showLoadingMask(me.loadingText);
			me.showMain(true);
		}
		else
			me.hideLoadingMask();
	},
	/**
	 * getFieldsFromTable - function to get fields from table
	 * @param {Object} table - table values
	 * @param {Object} scope - scope information 
	 * */
	getFieldsFromTable: function (table, scope) {
		return new Promise(function (resolve, reject) {
			var me = scope || this;
			var query = String.format('SELECT name, sql FROM sqlite_master WHERE type="table" and name="{0}"', table);
			me.execute(query).then(function (result) {
				var record = me.getResultAsArray(result[1].rows)[0];
				var fieldString = record.sql;
				var firstIndex = fieldString.indexOf("(");
				var lastIndex = fieldString.lastIndexOf(")");
				var fieldVal = fieldString.substring(firstIndex + 1, lastIndex);
				var fieldArray = fieldVal.split(",");
				var fields = [];
				_.forEach(fieldArray, function (item) {
					fields.push(item.split(" ")[0]);
				});
				resolve(fields);
			});
		});
	},//Query execution order changed for delete operation, no issue for upload data formation
	callDataUploadConfig: [
		'SELECT * FROM [ebMobile__AccountNote__c] WHERE ebMobile__AccountId__c IN (SELECT ebMobile__AccountID__c FROM ebMobile__call__c WHERE Id = "{0}")',
		'SELECT * FROM [Task] WHERE AccountId IN (SELECT ebMobile__AccountID__c FROM ebMobile__call__c WHERE Id = "{0}")',
		'SELECT * FROM [OrderItem] WHERE OrderId IN (SELECT Id FROM [Order] WHERE ebMobile__VisitID__c = "{0}")',
		'SELECT * FROM [Order] WHERE ebMobile__VisitID__c = "{0}"',
		'SELECT * FROM [ebMobile__AssetOrder__c] WHERE ebMobile__VisitID__c = "{0}"',
		'SELECT * FROM [ebMobile__Call__c] WHERE Id = "{0}"',
		'SELECT * FROM [ebMobile__SurveyTransactions__c] WHERE ebMobile__VisitID__c = "{0}"',
		'SELECT * FROM [ebMobile__AccountStock__c] WHERE ebMobile__VisitID__c = "{0}"',
		'SELECT * FROM [ebMobile__REDSurveys__c] WHERE ebMobile__VisitID__c = "{0}"',
		'SELECT * FROM [ebMobile__AssetTrackingTransaction__c] WHERE ebMobile__VisitID__c = "{0}"',
		'SELECT * FROM [ebMobile__File__c] WHERE (ebMobile__VisitID__c = "{0}" OR ebMobile__AssetOrder__c IN ( SELECT Id FROM [ebMobile__AssetOrder__c] WHERE ebMobile__VisitID__c = "{0}" ) OR ebMobile__RecordAction__c = 2 )',
		'SELECT * FROM [Event] WHERE ebMobile__RecordAction__c = 1'
	],
	getTableNameFromQuery: function (query) {
		var start = query.indexOf('['), end = query.indexOf(']');
		return query.substring(start + 1, end);
	},
	getRecordActionField: function (table) {
		return table === "CustomerProduct__c" ? "RecordAction__c" : "ebMobile__RecordAction__c";
	},
	/**
	 * getUploadData - function to get uploaded data 
	 * @param {Object} scope - scope information
	 * @param {Boolean} isCallSync - boolean value to check the call sync
	 * @param {String} callId - value of the cal ID
	 * */
	getUploadData: function (scope, isCallSync, callId) {
		return new Promise(function (resolve, reject) {
			var me = scope || this, lastSyncTime = me.getLastSyncTime();
			//var allTables = db.exec("select name from sqlite_master where type='table'");
			//var tableNames = allTables[0].values.join(',').split(','), modifiedRecords = [];

			var data = common.appInfo.modifiableTables, modifiedRecords = [];
			if (isCallSync && callId)
				data = me.callDataUploadConfig;

			//db = me.updateUploadRecords(db); //For testing


			/*
			"{
			"records": [
				{
					"values": [
						"00190000014IoCoAAK | 00081 | Super Mart | ...",
						"00190000014EoCAABK | 0008tator | Test Mart | ...",
					],
					"name": "Account",
					"fields": "Id,AccountNumber,Name, ..."
				},
				{
					"values": [
						"0039000001JDBt7AAH | 00190000014IoCoAAK | Ues1 | ..."
					],
					"name": "Contact",
					"fields": "Id,AccountId,Name, ..."
				}
			]
			}"
			*/

			//var i = -1, len = 0; // Just for the demo purpose disabled upload data functionality.
			var i = -1, len = data.length, recordActions = common.recordActionValues;

			me.promiseFor(function () {
				i += 1;
				return i < len;
			}, function () {
				return new Promise(function (resolve, reject) {
					var table = data[i], query = '';

					if (isCallSync && callId) {
						query = String.format(table, callId);
						table = me.getTableNameFromQuery(table);
					}
					else {
						//GUID based upload only for hold order
						query = String.format('SELECT * FROM [{0}] WHERE {3} IN ({1}) OR (Id LIKE "GUID%" AND {3} = {2})', table, recordActions, common.recordAction.holdRec, me.getRecordActionField(table));
					}

					me.execute(query).then(function (result) {
						if (result[1].rows.length === 0) {
							resolve();
							return;
						}
						me.getResultBySchema(result[1].rows, table, me).then(function (record) {

							var data = { values: [], name: table, fields: null }, values = [], fields = [];

							var firstRow = record[0].row;
							for (var v = 0; v < firstRow.length; v++) {
								fields.push(Object.keys(firstRow[v])[0]);
							}
							data.fields = fields.join();
							_.forEach(record, function (rec, key) {
								var val = "", rows = rec.row;
								for (var m = 0; m < rows.length; m++) {
									var obj = rows[m];
									val += obj[Object.keys(obj)[0]] + me.dataSplitCharacter;
								}
								values.push(val.substring(0, val.length - 1));
							});
							data.values = values;
							modifiedRecords.push(data);
							//console.log("Collecting records to upload " + query);
							resolve();
						});

					});

				});
			}).then(function () {
				me.updateSyncLog(isCallSync, common.syncLogStatus.started, callId).then(function () {
					resolve(modifiedRecords);
				});

			});

		});

	},
	/**
	reSyncDataBase: function () {
		var me = this;
		var dataToBeUpload = [
				'SELECT * FROM [Order] WHERE ebMobile__RecordAction__c IN ({0})',
				'SELECT * FROM [OrderItem] WHERE OrderId IN (SELECT Id FROM [Order] WHERE ebMobile__RecordAction__c IN ({0}))',
				'SELECT * FROM [ebMobile__AssetOrder__c] WHERE ebMobile__RecordAction__c IN ({0})',
				'SELECT * FROM [ebMobile__File__c] WHERE ebMobile__RecordAction__c IN ({0})',
				'SELECT * FROM [ebMobile__AccountNote__c] WHERE ebMobile__AccountId__c IN (SELECT ebMobile__AccountID__c FROM ebMobile__call__c WHERE ebMobile__RecordAction__c IN ({0}))',
				'SELECT * FROM [Task] WHERE AccountId IN (SELECT ebMobile__AccountID__c FROM ebMobile__call__c WHERE ebMobile__RecordAction__c IN ({0}))',
				'SELECT * FROM [ebMobile__Call__c] WHERE ebMobile__RecordAction__c IN ({0})',
				'SELECT * FROM [ebMobile__SurveyTransactions__c] WHERE ebMobile__RecordAction__c IN ({0})',
				'SELECT * FROM [ebMobile__AccountStock__c] WHERE ebMobile__RecordAction__c IN ({0})',
				'SELECT * FROM [ebMobile__REDSurveys__c] WHERE ebMobile__RecordAction__c IN ({0})',
				'SELECT * FROM [ebMobile__AssetTrackingTransaction__c] WHERE ebMobile__RecordAction__c IN ({0})'
		];
		var i = -1, len = dataToBeUpload.length;
		me.promiseFor(function () {
			i += 1;
			return i < len;
		}, function () {
			return new Promise(function (resolve, reject) {
				var table = String.format(dataToBeUpload[i].trim(), common.recordActionValues);
				me.execute(table).then(function (result) {
					var data = me.getResultAsArray(result[1].rows);
					if (data.length) {
						msg.onClose = function (ret) {
							if (ret === "-1") {
								me.syncDatabse(common.syncType.incremenetalSync);
							}
						}
						msg.data('messageBox').exclamation('Message', 'You have data which is not synced, Press OK to sync.', [{ text: 'OK', return: "-1" }]);
						return;
					}
					resolve();
				});
			});
		});
	},
	**/
	/**
	 * updateSyncLog - function to update sync log
	 * @param {Boolean} isCallSync - boolean value to check the call sync
	 * @param {String} status - sync status
	 * @param {String} callId - value of the call ID
	 * @param {String} customerId - value of the customer ID
	 * @param {String} surveyType - survey type
	 * */
	updateSyncLog: function (isCallSync, status, callId, customerId, surveyType, associationId) {
		var me = this;
		var where = surveyType === common.syncLogType.redSurvey ? String.format(' CallId = "{0}"', callId) : String.format(' AssociationId = "{0}"', associationId);
		var callWhere = 'SELECT CallId FROM SyncLog WHERE LogType IS NULL';
		return new Promise(function (resolve, reject) {
			if (status === common.syncLogStatus.pending) {
				var query = String.format('DELETE FROM [SyncLog] WHERE {0}', where);
				me.execute(query).then(function (result) {
					var query = String.format('INSERT INTO [SyncLog] (CustomerId, CallId, Type, SyncDate, Status, AssociationId) VALUES ("{0}","{1}", "{2}", datetime("now", "localtime"), "{3}", "{4}")', customerId, callId, surveyType, status, associationId);
					me.execute(query).then(function (result) {
						//console.log('Sync log created ' + query);
						resolve();
					});

				});
				return;
			}

			if (callId) {
				callWhere = String.format('"{0}"', callId);
			}
			var query = 'SELECT Id, ebMobile__GUID__c FROM [ebMobile__call__c] WHERE ebMobile__GUID__c IN (' + callWhere + ')';
			me.execute(query).then(function (result) {
				var data = me.getResultAsArray(result[1].rows);
				var i = -1, len = data.length;
				me.promiseFor(function () {
					i += 1;
					return i < len;
				}, function () {
					return new Promise(function (resolve, reject) {
						var newId = data[i].Id, guid = data[i].ebMobile__GUID__c;
						query = String.format('UPDATE [SyncLog] SET CallId = "{0}" WHERE CallId = "{1}"', newId, guid);
						me.execute(query).then(function (result) {
							if (callId && callId === guid)
								callId = newId;
							resolve();
						});
					});

				}).then(function () {
					var query = String.format('UPDATE [SyncLog] SET SyncDate = datetime("now", "localtime"), Status = "{0}" WHERE Status <> "{1}" AND LogType IS NULL ', status, common.syncLogStatus.success);
					if (isCallSync && callId)
						query = String.format('UPDATE [SyncLog] SET SyncDate = datetime("now", "localtime"), Status = "{0}" WHERE CallId = "{1}" AND LogType IS NULL ', status, callId);

					me.execute(query).then(function (result) {
						//console.log('Sync log updated ' + query);				
						//$rootScope.$broadcast('updatedSyncLog');
						resolve();
					});
				});
			});

		});

	},
	/* Upload Test function */
	updateUploadRecords: function () {
		return new Promise(function (resolve, reject) {
			var me = this;
			var data = common.appInfo.modifiableTables;

			var i = -1, len = data.length;
			me.promiseFor(function () {
				i += 1;
				return i < len;
			}, function () {
				return new Promise(function (resolve, reject) {
					var table = data[i];
					if (table == "Account" || table == "Contact") {
						var query = String.format('UPDATE [{0}] SET ebMobile__RecordAction__c = 1', table);
						me.execute(query).then(function (result) {
							//console.log("Updating records to upload " + query);
							resolve();
						});
					}
					else
						resolve();

				});
			}).then(function () {
				resolve();
			});

		});

	},
	/**
	 * downloadAttachament - function to downlaod attachment
	 * */
	downloadAttachament: function () {
		var me = this;
		if (me.isNativeApp()) {
			me.syncStatus.state = common.syncState.end;
			return;
		}


		//console.log("Started to downloading attachment");
		var query = 'SELECT Id FROM Attachment WHERE ParentId IN (select Id from ebMobile__AccountGroup__c)';
		me.execute(query).then(function (result) {
			common.downloadAttachementData = me.getResultAsArray(result[1].rows);
			common.activeDownloadIndex = 0;
			me.callDownladService(common.activeDownloadIndex);
		});
	},
	/**
	 * callNextDownload - function to call next download
	 * */
	callNextDownload: function () {
		var me = this;
		if (common.downloadAttachementData && common.downloadAttachementData.length - 1 > common.activeDownloadIndex && common.downloadAttachementData.length > 0) {
			common.activeDownloadIndex += 1;
			me.callDownladService(common.activeDownloadIndex);
		}
		else {
			me.updateSyncStatus(String.format("Attachement download completed."), new Date(), common.syncState.end);
			common.setFileDownloadStatus(common.fileFolders.accountGroup, true);
			console.log("Data synchronization process completed with download attachment");
		}

	},
	/**
	 * getSavedAttachmentData - function to get saved attachment data
	 * */
	getSavedAttachmentData: function () {
		var image = window.localStorage.getItem("AttachmentData");
		return image ? JSON.parse(image) : common.attachmentBase64;
	},
	postAttachmentData: function (data) {
		window.localStorage.setItem("AttachmentData", JSON.parse(data));
	},
	isFoundAttachementKey: function (id) {
		var me = this;
		var oldData = me.getSavedAttachmentData();
		var found = $.grep(oldData, function (e) { return e.Id == id; });
		return found.length !== 0;
	},
	/**
	 * callDownladService - function to call download service
	 * @param {String} index - index of the downlaod attachment
	 * */
	callDownladService: function (index) {
		var me = this;
		if (!common.downloadAttachementData || common.downloadAttachementData.length === 0) {
			me.callNextDownload();
			return;
		}

		var id = common.downloadAttachementData[index].Id;
		if (!id || me.isFoundAttachementKey(id)) {
			me.callNextDownload();
			return;
		}

		var param = me.getCommonParams();
		param['AttachmentId'] = id;
		param['apiVersion'] = common.getSfdcApiVersion();
		param['isbase64'] = true;

		this.ajax({
			controller: 'DownloadAttachment',
			params: param,
			method: 'POST',
			dataType: 'json',
		}).then(function (response) {
			if (response.success) {
				var id = common.downloadAttachementData[index].Id;

				var data = me.getSavedAttachmentData();
				data.push({ Id: id, Body: response.result }); //Only  for browser testing, because of local storage limitaion.
				me.postAttachmentData(data);

				//console.log(String.format("Attachement download success for Id {0} and index {1}", id, index));
				me.callNextDownload();
			}
			else {
				//me.updateSyncError(String.format("Error while downloading attachment - {0}", response.Error || response.result));
				me.callNextDownload();
			}
		}, function (result) {
			//me.updateSyncError(String.format("Error while downloading attachment - {0}", error));
			me.callNextDownload();
		});

	},
	/**
	 * deleteRecords - function to delete records from table
	 * @param {Object} table - table information
	 * */
	deleteRecords: function (table) {
		var me = this;
		var promise = new Promise(function (resolve, reject) {
			var days = Math.round(Number(table.ebMobile__KeepRecords__c));
			if (!isNaN(days) && days !== 0) {
				var date = new Date(common.serverDateTime);
				//date.setDate(date.getDate() - days);
				//Check if column exist query,need touse if required
				//SELECT name, sql FROM sqlite_master WHERE type="table" and name="ebMobile__Call__c" and sql like "%LastModifiedDate%" ORDER BY name
				//var query = String.format("DELETE FROM [{0}] WHERE LastModifiedDate < datetime('now', '-{1} day', 'localtime')", table.Name.trim(), days);
				var query = String.format("DELETE FROM [{0}] WHERE LastModifiedDate < datetime('now', '-{1} day')", table.Name.trim(), days); //The datetime should be GMT 0 only, because even in SFDC the value saving with GMT 0 format only
				me.execute(query).then(function (result) {
					//console.log("Deleted record " + query);
					resolve();
				});
			}
			else
				resolve();

		});

		return promise;
	},
	/**
	 * deleteEventData - function to delete event data
	 * */
	deleteEventData: function () {
		var me = this;
		return new Promise(function (resolve, reject) {
			var query = String.format("DELETE FROM [Event] WHERE date(ActivityDate) >= date('now','localtime') AND ebMobile__RecordTypeName__c = 'Route'");
			me.execute(query).then(function (result) {
				//console.log("Deleted event data " + query);
				resolve();
			});

		});
	},
	/**
	 * deleteExistingRecords - function to delete existing records
	 * */
	deleteExistingRecords: function () {
		var me = this;
		return new Promise(function (resolve, reject) {
			var data = common.keepTableRecordsConfig || [], i = -1, len = data.length;
			me.promiseFor(function () {
				i += 1;
				return i < len;
			}, function () {
				return new Promise(function (resolve, reject) {
					me.deleteRecords(data[i]).then(function () {
						resolve();
					});
				});
			}).then(function () {
				resolve();
			});
		});

	},
	/**
	 * deleteTempRecords - function to delete temporary records
	 * @param {Boolean} isCallSync - boolean value to check the call sync or not
	 * @param {String} callId - value of the call ID
	 * */
	deleteTempRecords: function (isCallSync, callId) {
		var util = this;
		return new Promise(function (resolve, reject) {
			var data = common.appInfo.modifiableTables;
			if (isCallSync && callId)
				data = util.callDataUploadConfig;

			var i = -1, len = data.length;
			util.promiseFor(function () {
				i += 1;
				return i < len;
			}, function () {
				return new Promise(function (resolve, reject) {
					var table = data[i].trim(), query = '';

					if (isCallSync && callId) {
						table = table.replace("SELECT * FROM", "DELETE FROM") + ' AND Id LIKE "GUID%"';
						query = String.format(table, callId);
					}
					else
						query = String.format('DELETE FROM [{0}] WHERE {3} IN ({1}) OR (Id LIKE "GUID%" AND {3} = {2})', table, common.recordActionValues, common.recordAction.holdRec, util.getRecordActionField(table));

					util.execute(query).then(function (result) {
						//console.log("Deleted temp records " + query);
						resolve();
					});

				});
			}).then(function () {
				resolve();
			});
		});

	},
	/**
	 * updateSyncError - function to update the sync error 
	 * @param {String} message - message that is used to define sync error
	 * @param {String} syncType - type of the sync
	 * */
	updateSyncError: function (message, syncType) {
		var me = this;
		me.hideLoadingMask(true);
		me.updateSyncStatus(message, new Date(), common.syncState.end);
		//console.log(message);
		if (syncType == common.syncType.initialSync) {
			msg.data('messageBox').default(common.translateText('COMMON.ERROR_OCCURED'), message);
		}
	},
	/**
	 * getConfigInfo - function to get the configuration info
	 * @param {Object} data - data information about table
	 * @param {String} tableName - name of the table
	 * */
	getConfigInfo: function (data, tableName) {
		var result = [], me = this;
		_.forEach(data, function (table, key) {
			var currentFields = table.fields.split(','), fieldIndex = 0, currentTableName = table.name, records = table.values;
			if (tableName === currentTableName) {
				for (var j = 0; j < records.length; j++) {
					var value = {};
					for (var i = 0; i < currentFields.length; i++) {
						var val = records[j].split(me.dataSplitCharacter)[i];
						value[currentFields[i]] = typeof val === "string" ? val.trim() : val;
					}
					result.push(value);
				}

			}
		});
		return result.length > 1 ? result : result[0];
	},
	/**
	 * getEventFlagStatus - function to get event flag status
	 * @param {String} syncType - type of the sync
	 * */
	getEventFlagStatus: function (syncType) {
		var me = this;
		var existingInfo = me.getAppInfo();

		if (common.syncType.initialSync == syncType)
			return 0;
		if (!existingInfo.lastEventUpdate)
			return 1;

		return existingInfo.lastEventUpdate && common.daysBetween(new Date(existingInfo.lastEventUpdate), new Date()) > 0 ? 1 : 0;
	},
	/**
	 * callPriceEngineSync - function to call price engine sync
	 * @param {String} syncMode - define the sync mode of the JSON sync
	 * */
	callPriceEngineSync: function (syncMode) {
		var me = this;
		return new Promise(function (resolve, reject) {
			//Sync mode	1 Incremental sync and	2 Initial sync
			//Exmple user 02002645 (string)		
			var syncJson = common.priceEngineSyncConfig;
			syncJson.SyncMode = syncMode;
			syncJson.User = me.getAppInfo().userCode;
			action.updateAppStatus({ isSpinner: true, progressValue: 0, progressText: 'Downloading price data...' });
			PricingInterface.syncPriceData([syncJson], {
				error: function (e) {
					console.log(e);
					resolve(e);
				},
				success: function (s) {
					console.log(s);
					var data = JSON.parse(s);
					if (data.Result == 0 || Object.getOwnPropertyNames(data).length === 0 || s === '{}') {
						msg.data('messageBox').default(common.translateText('LOGIN.PRICE_ENGINE_SYNC_FAILED'), common.translateText("COMMON.PLEASE_TRY_AFTER_SOMETIME"));
						resolve(s);
						return;
					}
					if (data && typeof data.Result !== "undefined") {
						$action.updateAppStatus({ isSpinner: true, progressValue: 100, progressText: 'Downloading price data...' });
						resolve(s);
						return;
					}
					action.updateAppStatus({ isSpinner: true, disableClear: true, progressValue: data.DownloadPercentage || 0, progressText: data.Progress || 'Downloading price data...' });
				}
			});
		});
	},
	/**
	 * syncPriceEngine - function to syncronize the price engine
	 * @param {String} syncMode - sync mode of the price engine
	 * @param {Object} user - user information
	 * */
	syncPriceEngine: function (syncMode) {
		var me = this;
		return new Promise(function (resolve, reject) {
			//Sync mode	1 Incremental sync and	2 Initial sync
			//Exmple user 02002645 (string)	
			common.priceEngineStartTime = new Date();
			var successResult = { result: "Success", success: true, data: null }, failedResult = { result: "Error", success: false, data: null, errorCode: 0 };
			setTimeout(function () {
				if (!common.priceEngineStartTime)
					return;

				failedResult.errorCode = common.offlinePriceSyncTimeoutCode;
				failedResult.result = "Connection timed out";
				console.log(failedResult);
				resolve(failedResult);

			}, common.offlinePricingSyncTimeout, me);

			common.connectOfflinePricing().then(function (e) {
				if (e === "connected") {
					me.callPriceEngineSync(syncMode).then(function (response) {
						var isJson = response && response.startsWith("{");
						if (isJson) {
							successResult.data = JSON.parse(response);
							successResult.result = successResult.data.Result === 1 ? "Success" : "Error";
							successResult.success = successResult.data.Result === 1;
							common.priceEngineStartTime = null;
							resolve(successResult);
							return;
						}
						common.priceEngineStartTime = null;
						failedResult.data = response;
						resolve(failedResult);
					});
					return;
				}
				failedResult.result = "Connection error, " + e;
				resolve(failedResult);
			});
		});
	},
	/**
	 * syncDatabse - function to sync database before get logging in to application
	 * @param {String} type - type of the sync
	 * @param {Boolean} showMain - boolean value to check main will show or not
	 * @param {Boolean} isCallSync - boolean value to check the call sync flag
	 * @param {String} callId - value of the Call ID
	 * */
	syncDatabse: function (type, showMain, isCallSync, callId) {
		var me = this;
		// var allTables = db.exec("select name from sqlite_master where type='table'");
		//var tableNames = allTables[0].values.join(',');      

		me.updateSyncStatus(String.format("Downloading data - Type {0}", type), new Date(), common.syncState.running);


		if (common.isOnProgress())
			action.updateAppStatus({ isSpinner: false, progressText: common.translateText('COMMON.SYNCHRONIZING_DATA') });
		else
			me.showLoadingMask(common.translateText('COMMON.SYNCHRONIZING_DATA'));

		var param = me.getCommonParams(), controller = 'DownloadData';

		//downloadparams = {"syncType": "1","deviceId": "", "groupNumber": "1","objectNames":"", "userId": ""}
		//All params are optional we can pass the required params only for example downloadparams = {"objectNames":"Account, Attachment" }
		var downloadParam = { syncType: type, deviceId: common.getClientId(), eventFlag: me.getEventFlagStatus(type), username: me.getAppInfo().username };
		if (common.syncType.initialSync === type)
			downloadParam = { eventFlag: 0, syncType: type, deviceId: common.getClientId(), username: me.getAppInfo().username, isBatchDownload: common.isBatchDownload, maxDownloadGroupNumber: common.maxDownloadGroupNumber };

		param["downloadParams"] = JSON.stringify(downloadParam);

		param["role"] = common.getRole();

		if (common.syncType.initialSync !== type) {
			//Just for testing
			/*
			me.updateUploadRecords().then(function () {
				me.getUploadData().then(function (modifiedRecords) {						
					if (modifiedRecords.length > 0) {
						controller = 'UploadData';
						var rec = { records: modifiedRecords };
						param["modifiedData"] = JSON.parse(rec);
						me.updateSyncStatus(String.format("Uploading data - Type {0}", type), new Date(), common.syncState.running);
						console.log("Uploading and downloading data.");
						me.processUploadDownload(controller, param, type, showMain);
					}
				});
			});
			*/
			//Actual code

			me.getUploadData(me, isCallSync, callId).then(function (modifiedRecords) {
				if (modifiedRecords.length > 0) {
					controller = 'UploadData';
					var rec = { records: modifiedRecords };
					param["modifiedData"] = JSON.stringify(rec);
					me.updateSyncStatus(String.format("Uploading data - Type {0}", type), new Date(), common.syncState.running);
					//console.log("Uploading and downloading data.");

				}
				me.processUploadDownload(controller, param, type, showMain, isCallSync, callId);
			});

		}
		else
			me.processUploadDownload(controller, param, type, showMain);

	},
	/**
	 * processUploadDownload - function to download the uploaded data
	 * @param {String} controller - name of the controller
	 * @param {Object} param - parameters that passed on server call
	 * @param {String} type - type of the sync
	 * @param {Boolean} showMain - boolean value to check main will show or not
	 * @param {Boolean} isCallSync - boolean value to check the call sync flag
	 * @param {String} callId - value of the Call ID
	 * */
	processUploadDownload: function (controller, param, type, showMain, isCallSync, callId) {

		var message = "Error while downloading data - {0}", me = this;
		if (param["modifiedData"])
			message = "Error while uploading/ downloading data - {0}";

		this.ajax({
			controller: controller,
			params: param,
			timeout: type === common.syncType.initialSync ? common.initialSyncNetworkTimeout : common.networkTimout,
			method: 'POST',
		}).then(function (response) {
			if (response.success) {
				var data = JSON.parse(response.result);
				var inputParam = JSON.parse(param.downloadParams);
				me.manipulateData(data, type, showMain, inputParam, isCallSync, callId).then(function () {
					me.afterSync(data);
				});
			}
			else {
				var error = String.format(message, response.result);
				me.updateSyncError(error, type);
				me.updateSyncLog(isCallSync, common.syncLogStatus.failed, callId).then(function () {
					if (type == common.syncType.initialSync) {
						msg.onClose = function (ret) {
							if (ret === "-1") {
								me.startIntialSync(false);
							}
						}
						msg.data('messageBox').exclamation(common.translateText('COMMON.ERROR'), common.translateText('COMMON.SYNC_FAILED_ALERT'), [{ text: 'OK', return: "-1" }]);
					}
					me.hideLoadingMask();
					//if (common.isSyncFromLogin && type !== common.syncType.initialSync)
					//me.showMainFromLogin(showMain);
				});
			}
		}, function (result) {
			var request = result[0], error = result[1];
			me.updateSyncError(String.format(message, error), type);
			me.updateSyncLog(isCallSync, common.syncLogStatus.failed, callId).then(function () {
				if (type == common.syncType.initialSync) {
					msg.onClose = function (ret) {
						if (ret === "-1") {
							me.startIntialSync(false);
						}
					}
					msg.data('messageBox').exclamation(common.translateText('COMMON.ERROR'), common.translateText('COMMON.SYNC_FAILED_ALERT'), [{ text: 'OK', return: "-1" }]);
				}
				me.hideLoadingMask();
				//if (common.isSyncFromLogin && type !== common.syncType.initialSync)
				//me.showMainFromLogin(showMain);
			});
		});
	},
	/**
	 * createLocalDb - function to create local database in machine
	 * */
	createLocalDb: function () {
		var contentType, me = this;
		if (!contentType) contentType = 'application/octet-stream';
		var a = document.createElement('a');
		var db = me.exportDb;
		var data = db.export();
		var blob = new Blob([data.buffer], { 'type': contentType });
		a.href = window.URL.createObjectURL(blob);
		a.download = 'ebest.db';
		a.click();
	},
	/**
	 * getResultAsJson - function to get results in JSON format
	 * @param {Object} res - result value
	 * */
	getResultAsJson: function (res) {
		if (res.length === 0)
			return [];

		var jsonData = [], values = res[0].values, columns = res[0].columns;
		for (var i = 0, len = values.length; i < len; i++) {
			var row = {};
			for (var j = 0, collen = columns.length; j < collen; j++) {
				row[columns[j]] = values[i][j];
			}
			jsonData.push(row);
		}
		return jsonData;
	},
	/**
	 * getResultBySchema - function to get result by schema
	 * @param {Object} res - result value
	 * @param {Object} table - table information
	 * @param {Object} scope - scope value
	 * */
	getResultBySchema: function (res, table, scope) {
		var me = scope || this;
		return new Promise(function (resolve, reject) {
			if (res.length === 0) {
				resolve([]);
				return;
			}
			var jsonData = [];
			me.getFieldsFromTable(table, scope).then(function (result) {
				var isPhoneGap = me.isPhoneGap();
				var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
				for (var i = 0, len = res.length; i < len; i++) {
					var item = (isPhoneGap || isSafari) ? res.item(i) : res[i];
					var r = result, resultData = [];
					for (var v = 0; v < r.length; v++) {
						for (var s in item) {
							if (r[v] == s) {
								var val = (item[s] === 'undefined' || item[s] === 'null' || item[s] === null) ? '' : item[s];
								var obj = {};
								obj[r[v]] = val;
								resultData.push(obj);
								break;
							}
						}
					}
					jsonData.push({ row: resultData });
				}
				resolve(jsonData);
			});
		});
	},
	/**
	 * getResultAsArray - function to get result value in to array format
	 * @param {Object} res - result values
	 * */
	getResultAsArray: function (res) {
		if (res.length === 0)
			return [];

		var jsonData = [], me = this;
		var isPhoneGap = me.isPhoneGap();
		var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
		for (var i = 0, len = res.length; i < len; i++) {
			var item = (isPhoneGap || isSafari) ? res.item(i) : res[i];
			for (var o in item) {
				item[o] = (item[o] === 'undefined' || item[o] === 'null') ? null : item[o];
			}
			jsonData.push(item);
		}
		return jsonData;
	},
	/**
	 * updateRecord - function to update record to table
	 * @param {Object} records - modified records
	 * @param {Object} table - table values
	 * @param {Object} fields - based on this fields record will update
	 * @param {String} idField - value of the ID field
	 * */
	updateRecord: function (records, table, fields, idField) {
		_.forEach(records, function (recrod) {
			var updateValue;
			_.forEach(fields, function (field) {
				if (typeof field === 'object') {
					updateValue += String.format()
				}
			});
		});
	},
	/**
	 * getAttachmentData - function to get attachment data based on ID
	 * @param {String} Id - ID value
	 * */
	getAttachmentData: function (Id) {
		var val = this.getSavedAttachmentData();
		for (var i = 0; i < val.length; i++) {
			var data = val[i];
			if (data.Id === Id) {
				return data.Body;
			}
		}
	},
	/**
	 * isNativeApp - function to check the working application is native app or not
	 * */
	isNativeApp: function () {
		return this.isPhoneGap();
	},

	afterSyncUpdateConfig: [
		{
			table: 'ebMobile__AssetOrder__c',
			updateQuery: "UPDATE ebMobile__File__c SET ebMobile__AssetOrder__c = '{0}', ebMobile__RecordAction__c = 1 WHERE ebMobile__AssetOrder__c = '{1}' "
		},
		{
			table: 'ebMobile__AssetTrackingTransaction__c',
			updateQuery: "UPDATE ebMobile__File__c SET ebMobile__AssetTracking__c = '{0}', ebMobile__RecordAction__c = 1 WHERE ebMobile__AssetTracking__c = '{1}' "
		}
	],

	updateDataAfterSync: function (rec, updateObj) {
		var me = this;
		return new Promise(function (resolve, reject) {
			var fields = rec.fields.split(',');
			var guidIndex = fields.indexOf('ebMobile__GUID__c');
			var idIndex = fields.indexOf('Id');
			var i = -1, len = rec.values.length;
			me.promiseFor(function () {
				i += 1;
				return i < len;
			}, function () {
				return new Promise(function (resolve, reject) {
					var values = rec.values[i].split(' ▏');
					var query = String.format(updateObj.updateQuery, values[idIndex], values[guidIndex]);
					me.execute(query).then(function () {
						resolve();
					});
				});

			}).then(function () {
				resolve();
			});
		})
	},

	afterSync: function (result) {
		//Call File upload immediatly sync
		var me = this;
		/*
		var records = result.records;
		var i = -1, len = me.afterSyncUpdateConfig.length;
		me.promiseFor(function () {
			i += 1;
			return i < len;
		}, function () {
			return new Promise(function (resolve, reject) {
				var updateObj = me.afterSyncUpdateConfig[i];
				var data = $.grep(records, function (obj) { return obj.name == updateObj.table });
				if (data.length == 0) {
					resolve();
					return;
				}
				me.updateDataAfterSync(data[0], updateObj).then(function () {
					$rootScope.$broadcast('syncSuccessCompleted');
					resolve();
				});
			});

		}).then(function () {
			
		});*/
		//$rootScope.$broadcast('syncSuccessCompleted');
		me.deleteOldCdeAttachments();
	},

	deleteOldCdeAttachments: function () {
		var query = "DELETE FROM ebMobile__File__c WHERE ebMobile__FileType__c = 'CDE_Document' AND CreatedDate < date('now', '-7 days','localtime')";
		this.execute(query);
	},

	startIntialSync: function (isFromProfile) {
		var me = this;
		common.canShowLoadingMask = true;
		common.isWelcomeVisited = false;
		common.appInfo.isSchemaCreated = false;
		common.appInfo.deleteExistingRecords = false;
		common.appInfo.isInitialDataDownloaded = false;
		if (common.isNativeApp() && common.enableOfflinePricing && !me.getAppInfo().isPriceEngineInitSyncDone && !isFromProfile) {
			common.showCommonLoading(common.translateText('COMMON.SYNCHRONIZING_PRICE_ENGINE'));
			this.syncPriceEngine(common.priceEngineSyncType.initialSync).then(function (res) {
				if (!res.success) {
					common.appInfo.isPriceEngineInitSyncDone = false;
					me.updateAppInfo();
					me.hideLoadingMask(true);
					return;
				}
				common.appInfo.isPriceEngineInitSyncDone = true;
				me.updateAppInfo();
				me.downloadSchema();
			});
		}
		else {
			me.downloadSchema();
		}
	}

}