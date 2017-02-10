import util from '../Utils/util'
import common from '../Utils/common'

export default {
    monthlyQuery: "DATE ('Now','localtime') >= DATE(ebMobile__Period__c) ",
    adjustDay: moment().day() === 6 ? '' : ", '-7 days'",
    weeklyQuery: String.format("DATE(ebMobile__Period__c) BETWEEN  DATE('now', 'localtime', 'weekday 6'{0}) AND DATE('now', 'localtime', 'weekday 5')", moment().day() === 6 ? '' : ", '-7 days'"),
    dailyQuery: " DATE(ebMobile__Period__c) = Date('Now','localtime') ",
    user: { Name: '', Id: common.appInfo.userId },
    period: 'Daily',
    disabledKpiBlocks: [],

    setPeriod: function (period) {
        this.period = period;
    },

    getPeriod: function () {
        return this.period;
    },

    setUser: function (user) {
        this.user = user;
    },

    getUser: function () {
        return this.user;
    },

    isLoggedInUser: function (userId) {
        return common.appInfo.userId === userId;
    },
	/**
	 * getMessages - service call to get messages from message table
	 * */
    getKpiData: function (period) {
        var me = this;
        return new Promise(function (resolve, reject) {
            var criteria = "AND ";

            if (period == 'Monthly' || period == 'Yearly') criteria += me.monthlyQuery;
            else if (period == 'Weekly') criteria += me.weeklyQuery;
            else if (period == 'Daily') criteria += me.dailyQuery;
            else criteria = "";

            var isSuperVisor = common.getRole() === common.roles.SuperVisor;
            var iMentorFilter = "", targetField = 'ebMobile__Target__c', achievedField = 'ebMobile__Achieved__c';
            var disabledKpi = String.format('AND Main.ebMobile__MetricType__c NOT IN ( {0} )', me.disabledKpiBlocks.join(','));

            if (isSuperVisor) {
                userMetricFilter = 'AND ebMobile__UserMetrics__c.ebMobile__IsSupervisor__c = 1 ';
                iMentorFilter = 'AND ebMobile__UserID__c = "{1}" ' + (me.isLoggedInUser(me.getUser().Id) ? userMetricFilter : '');
                //Removed As Per - 546
                //targetField = 'ebMobile__XTDTarget__c AS ebMobile__Target__c';
                //achievedField = 'ebMobile__XTDAchieved__c AS ebMobile__Achieved__c';
            }

            var kpiQuery = String.format('SELECT * FROM ebMobile__RoleMetrics__c Main ' +
                'LEFT OUTER JOIN ' +
                '   ( ' +
                '   SELECT ebMobile__MetricsType__c, ' + achievedField + ', ' + targetField + ', ebMobile__Value__c, ebMobile__PYValue__c, ebMobile__Period__c  FROM ' +
                '       (' +
                '           SELECT *,ebMobile__UserMetrics__c.Id AS UserMetricsId  FROM ' +
                '           ebMobile__RoleMetrics__c LEFT OUTER JOIN ebMobile__UserMetrics__c ' +
                '           ON ebMobile__RoleMetrics__c.[ebMobile__MetricsID__c] = ebMobile__UserMetrics__c.[ebMobile__MetricsType__c] AND ebMobile__UserMetrics__c.ebMobile__IsActive__c = 1' +
                '       ) T1 WHERE T1.[UserMetricsId] IN ( ' +
                '           SELECT T2.UserMetricsId FROM ( ' +
                '               SELECT *,ebMobile__UserMetrics__c.Id AS UserMetricsId  FROM ' +
                '               ebMobile__RoleMetrics__c LEFT OUTER JOIN ebMobile__UserMetrics__c ' +
                '               ON ebMobile__RoleMetrics__c.[ebMobile__MetricsID__c] = ebMobile__UserMetrics__c.[ebMobile__MetricsType__c] AND ebMobile__UserMetrics__c.ebMobile__IsActive__c = 1 ' +
                iMentorFilter +
                '       ) T2 ' +
                '       WHERE T2.ebMobile__MetricsType__c = T1.ebMobile__MetricsType__c ' +
                '       AND  T2.ebMobile__PeriodType__c LIKE "{0}" ' +
                '       AND CAST(ebMobile__UMSequence__c AS INT) > 0 ' + criteria +
                '       ORDER BY T2.ebMobile__Period__c DESC ' +
                '       LIMIT 1' +
                '   ) ' +
                ') T3 ' +
                'ON  Main.[ebMobile__MetricsID__c] = T3.[ebMobile__MetricsType__c]' +
                'WHERE   Main.ebMobile__PeriodType__c LIKE "{0}" ' +
                'AND CAST(Main.ebMobile__UMSequence__c AS INT) > 0 AND Main.ebMobile__IsActive__c = 1  {2}' +
                'ORDER BY Main.ebMobile__UMSequence__c ', period, me.getUser().Id, disabledKpi);

            util.execute(kpiQuery).then(function (result) {
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