const moment = require('moment');

module.exports = {
    formatDate(date) {
        return moment(date).format('YYYY-MM-DD at HH:mm');
    }
}