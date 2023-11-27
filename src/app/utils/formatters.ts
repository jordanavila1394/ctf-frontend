import * as moment from 'moment';

export default class Formatter {
    formatCheckins(data: any, locale) {
        let days = [];
        let foundDay: boolean;
        let arrayCountCheck = [];
        let arrayCountMissing = [];
        let arrayDates = [];
        moment.locale(locale);
        const usersNumber = parseInt(data?.usersNumber, 10);
        for (let dayCount = 0; dayCount < 5; dayCount++) {
            const today = moment();
            let day = today.subtract(dayCount, 'days');
            foundDay = false;
            for (let index = 0; index < data?.checkIns?.length; index++) {
                const date = moment(data?.checkIns[index].date);
                const countDay = parseInt(data?.checkIns[index].count, 10);
                if (day.isSame(date, 'day')) {
                    foundDay = true;
                    arrayCountCheck.push(countDay);
                    arrayCountMissing.push(usersNumber - countDay);
                    arrayDates.push(day.format('dddd , L'));
                }
            }
            if (!foundDay) {
                foundDay = true;
                arrayCountCheck.push(0);
                arrayCountMissing.push(usersNumber);
                arrayDates.push(day.format('dddd , L'));
            }
        }
        arrayCountCheck.reverse();
        arrayCountMissing.reverse();
        arrayDates.reverse();

        return {
            arrayCountCheck,
            arrayCountMissing,
            arrayDates,
        };
    }
}
