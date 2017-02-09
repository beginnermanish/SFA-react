import util from '../Utils/util'

export default {
	/**
	 * getMessages - service call to get messages from message table
	 * */
	getMessages: function () {
		return new Promise(function (resolve, reject) {
			var query = "SELECT  ebMobile__Sender__c AS Name, ebMobile__Content__c as Content, LastModifiedDate FROM ebMobile__Message__c WHERE ebMobile__isActive__c = 1 AND DateTime('Now','localtime') BETWEEN date(ebMobile__StartDate__c) AND date(ebMobile__EndDate__c,'+1 day') ORDER BY LastModifiedDate DESC";
			util.execute(query).then(function (result) {
				resolve(util.getResultAsArray(result[1].rows));
			});
		});
	},
	/**
	 * getEvents - service call to get events based on given date
	 * @param {String} date - based on this date events will filter
	 * */
	getEvents: function (date) {
		return new Promise(function (resolve, reject) {
			var query = "SELECT ebMobile__UserName__c AS OwnerName, StartDateTime, EndDateTime, Subject, Description, ebMobile__IsPriority__c AS IsPriority FROM Event WHERE ebMobile__RecordTypeName__c LIKE '%Calendar%' AND ebMobile__IsActive__c = 1 AND datetime(StartDateTime) BETWEEN datetime('" + date + "') AND datetime('" + date + "','+1 day','-1 second') ORDER BY StartDateTime";
			query = "SELECT Id, ebMobile__UserName__c AS OwnerName, StartDateTime, EndDateTime, Subject, Description, ebMobile__IsPriority__c AS IsPriority FROM Event";
			util.execute(query).then(function (result) {
				resolve(util.getResultAsArray(result[1].rows));
			});
		});
	}
}