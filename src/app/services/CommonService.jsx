import util from '../Utils/util'
import common from '../Utils/common'

export default {
    getConfigurationData: function (codeCategory) {
        return new Promise(function (resolve, reject) {
            var query = "SELECT Name, ebMobile__CodeValue__c, ebMobile__CodeCategory__c, ebMobile__CodeDescription__c FROM ebMobile__Configuration__c WHERE ebMobile__IsActive__c = 1";
            if (codeCategory) {
                query += " AND ebMobile__CodeCategory__c = '{0}'";
            }
            util.execute(String.format(query, codeCategory)).then(function (result) {
                resolve(util.getResultAsArray(result[1].rows));
            });
        });
    }
}