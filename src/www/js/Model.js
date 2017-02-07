Sfa = {};
Sfa.Model = function (config) {
	for (var o in config) {
		this[o] = config[o];
	}
};

Sfa.Model.defineFields = function(model, fields) {
	model.prototype.fields = fields;
	for(var i=0, len=fields.length; i<len; i++) {
		var field = fields[i];
		var fieldName = typeof field === 'string' ? field : field.name;
		model.prototype['get' + fieldName] = function() {
			return this[fieldName];
		};
		model.prototype['set' + fieldName] = function(value) {
			this[fieldName] = value;
			return this;
		};
	}
};
/*
Sfa.Model.prototype.save = function() {
	var fields = this.fields, sql = 'INSERT INTO ' + this.modelName + ' (' + fields.join(',') + ') VALUES (';
	var arguments = [];
	for(var i=0, len=fields.length; i<len; i++) {
		arguments[i] = this[fields[i]];
		sql += (i == 0 ? '' : ',') + '?';
	}
	sql += ')';
	return this.execute(sql, arguments);
};
*/
Sfa.Model.prototype.getResultAsArray = function (res) {
	if (res.length === 0)
		return [];

	var jsonData = [], me = this;
	var isPhoneGap = !!window.cordova;
	var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
	for (var i = 0, len = res.length; i < len; i++) {
		var item = (isPhoneGap || isSafari) ? res.item(i) : res[i];
		for(var o in item){
			item[o] = (item[o] === 'undefined' || item[o] === 'null') ? null : item[o];
		}
		jsonData.push(item);
	}
	return jsonData;
};
Sfa.Model.prototype.getDatabase = function () {
	var me = this, database;

	if (me.database)
		return me.database;

	var databaseOptions = {
		fileName: "eBestDBnew",
		version: "1.0",
		displayName: "ebestDB",
		maxSize: 1024 * 4
	};

	if (!!window.cordova && device.platform.toLowerCase() === 'windows') {
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
}
Sfa.Model.prototype.execute = function (query, params) {	
	var me = this;
	return new Promise(function (resolve, reject) {
		var db = me.getDatabase();		
		db.transaction(
			function (transaction) {
				transaction.executeSql((query),
                        params,
                        function (transaction, results) {
                        	resolve(arguments);
                        },
						function (transaction, error) {							
							reject(error);
						});
			},
			function (error) {
				console.error('Transaction error');
				reject(error);
			}
		);
	}).catch(function (args) {
		Sfa.Model.prototype.errorHandler(args[1]);		
	});
};

Sfa.Model.prototype.errorHandler = function (error) {
	console.error('Query Error ' + error);
}

Sfa.command = new Sfa.Model();