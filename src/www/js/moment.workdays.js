(function (undefined) {
    /**
     * moment.isWorkday
     */
    moment.fn.isWorkday = function() {
        /* Exclude constrant holidays */
        return !(this.isoWeekday() === 6)                       // exclude Saturday (Weekend)
            && !(this.isoWeekday() === 7);                       // exclude Sunday (Weekend)
        ;
    };

    /**
     * moment.add/subtract workdays
     * Comment: Uses moment.isWorkday to determine if 
     * License: MIT
     */
    var oldAdd      = moment.fn.add;
    var oldSubtract = moment.fn.subtract;
    moment.fn.add = function (input, val) {
        if (val === 'workdays') {
            var increment = input / Math.abs(input);
            var date = this.clone().add(Math.floor(Math.abs(input) / 5) * 7 * increment, 'days');
            var remaining = input % 5;
            while (remaining != 0) {
            	date.add(increment, 'days');
            	if (date.isWorkday()) {
            		remaining -= increment;
            	}
            }
            return date;
        }

        return oldAdd.call(this, input, val);
    };

    moment.fn.subtract = function (input, val) {
        if (val === 'workdays') {
            var decrement = input / Math.abs(input);
            var date = this.clone().subtract(Math.floor(Math.abs(input) / 5) * 7 * decrement, 'days');
            var remaining = input % 5;
            while(remaining != 0) {
                date.subtract(decrement, 'days');
                if(date.isWorkday()) {
                    remaining -= decrement;
                }
            }
            return date;
        }

        return oldSubtract.call(this, input, val);
    };
}).call(this);