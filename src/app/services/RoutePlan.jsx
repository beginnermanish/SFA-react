import util from '../Utils/util'

export default {
	/**
	 * getMessages - service call to get messages from message table
	 * */
getDayCustomers: function () {
        return new Promise(function (resolve, reject) {
            var sortfield = 'StartDateTime, allDayEvent';
            util.execute('SELECT * FROM  ebMobile__Configuration__c WHERE ebMobile__CodeCategory__c = "RouteSequenceSort"').then(function (result) {
                var codeValue = result[1].rows.length > 0 ? util.getResultAsArray(result[1].rows)[0].ebMobile__CodeValue__c : 'CustomerName';
                //$scope.checkSequence = 'DateTime';
                if (['Sequence', 'CustomerName'].indexOf(codeValue) > -1) {
                    sortfield = codeValue === 'CustomerName' ? 'ebMobile__Sequence__c, ebMobile__IsPlanned__c, Account.NAME' : 'ebMobile__Sequence__c';
                    //$scope.checkSequence = codeValue;
                }
                //Attachement table query modified for getting last one record for the customer.
                var query = 'SELECT [Account].ebMobile__ShippingCondition__c,[Account].AccountSource,[Account].ebMobile__MEPCustomerNumber__c,[Account].ebMobile__SalesRoute__c, Event.Id as EventId, Call.ebMobile__NoVisitReason__c, Call.ebMobile__NoOrderReason__c, IFNULL([RedSurvey].ebMobile__SurveyTotalScore__c, 0) as ebMobile__SurveyTotalScore__c, [Attachment].Id as AttachmentId, [Attachment].Name as AttachmentName, Account.ebMobile__AccountPhotoId__c, Account.Id,Account.Id AS AccountId, ebMobile__Sequence__c As SequenceNumber, IFNULL(ebMobile__Address__c,"") AS Address, ebMobile__TradeChannel__c As TradeChannel, ebMobile__SubTradeChannel__c AS Channel,' +
                    'ebMobile__GeoCode__Latitude__s As lat, ebMobile__GeoCode__Longitude__s AS long, ' +
                    'ebMobile__Segment__c AS Segment, Email AS Email, Type, [Account].[ebMobile__isActive__C], ' +
                    'IFNULL(Account.NAME,"") AS Name, Account.ebMobile__SalesOrg__c, Account.ebMobile__Division__c, Account.ebMobile__DistributionChannel__c, Account.ebMobile__SaleGroup__c, Account.ebMobile__SalesOffice__c, AccountNumber, IFNULL(Contact.Name,"") AS ContactName, IFNULL(Contact.FirstName,"") AS FirstName, IFNULL(Contact.LastName,"") AS LastName, IsAllDayEvent AS allDayEvent, Account.AccountSource, ' +
                    'IFNULL(Contact.Phone,"") AS Phone, IFNULL(Contact.MobilePhone,"") AS Mobile, ' +
                    'Contact.Title, StartDateTime AS start, EndDateTime AS end, ebMobile__Sequence__c, ebMobile__IsPlanned__c, [Call].[ebMobile__CallType__c] AS [CallType], [Call].[Id] AS [CallId], [Call].ebMobile__RecordAction__c, Account.ebMobile__BlockByCredit__c, Account.ebMobile__PaymentTerms__c, Account.ebMobile__OrderBlock__c, ebMobile__Configuration__c.[ebMobile__CodeDescription__c] AS ebMobile__CodeDescription__c, ebMobile__TradeGroup__c ' +
                    'FROM [Event]  ' +
                    'LEFT OUTER JOIN [Account] ON [Event].[AccountId] = [Account].[Id] ' +
                    'LEFT OUTER JOIN  [Contact] ON [Account].[Id] = [Contact].[AccountId] AND [Contact].[ebMobile__Primary__c] = 1 AND Contact.Id = (SELECT MIN(Id) FROM Contact con WHERE con.AccountId = [Account].[Id]  AND con.[ebMobile__Primary__c] = 1) ' +
                    'LEFT JOIN (SELECT [c1].* FROM   [ebMobile__Call__c] [c1] LEFT JOIN [ebMobile__Call__c] [c2] ON ([c1].[ebmobile__accountid__c] = [c2].[ebmobile__accountid__c]' +
                    'AND [c1].[ebMobile__CallDate__c] < [c2].[ebMobile__CallDate__c]) WHERE  [c2].[Id] IS NULL) Call ON [Account].[Id] = [Call].[ebmobile__accountid__c] AND DATE ([Call].[ebMobile__CallDate__c]) = DATE ("now", "localtime") AND [Call].ebMobile__RecordAction__c <> -1 ' +
                    'LEFT JOIN (SELECT a1.* FROM [Attachment] a1 LEFT JOIN [Attachment] a2	ON (a1.ParentId = a2.ParentId AND a1.LastModifiedDate < a2.LastModifiedDate) WHERE a2.Id IS NULL) Attachment ON [Attachment].[ParentId] = [Account].[Id] ' +
                    'LEFT JOIN (SELECT r1.* FROM [ebMobile__REDSurveys__c] r1 LEFT JOIN [ebMobile__REDSurveys__c] r2 ON (r1.ebMobile__AccountID__c = r2.ebMobile__AccountID__c AND r1.ebMobile__SurveyDate__c < r2.ebMobile__SurveyDate__c) WHERE r2.Id IS NULL GROUP BY r1.ebMobile__VisitID__c) RedSurvey ON [RedSurvey].[ebMobile__AccountID__c] = [Account].[Id] ' +
                    'LEFT OUTER JOIN ebMobile__Configuration__c ON ebMobile__Configuration__c.[ebMobile__CodeValue__c] = Account.[ebMobile__TradeGroup__c] AND ebMobile__Configuration__c.[ebMobile__CodeCategory__c] = "StillRoute" ' +
                    'WHERE [Event].[ebMobile__RecordTypeName__c] LIKE "%Route%" AND [Account].[ebMobile__isActive__C] = 1 AND [Event].[ebMobile__isActive__C] = 1 AND [Account].[Id] IS NOT NULL ' +
                    'AND date(ActivityDate) = date("now", "localtime") ORDER BY ' + sortfield;

                util.execute(query).then(function (result) {
                    resolve(util.getResultAsArray(result[1].rows));
                });
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