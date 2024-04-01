const moment = require('moment');

module.exports = {
    formatDate(date) {
        return moment(date).format('Do MMM, YYYY [at] hh:mm a (Z)'); // 1st Apr, 2024 at 12:00 pm (+11:00)
    }
}