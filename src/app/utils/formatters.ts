import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

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

    formatDifferenceHours(date2, date1) {
        let tempHours: number = 0;
        if (date2) {
            var difference = (date2.getTime() - date1.getTime()) / 1000;
            difference /= 60 * 60;
            tempHours = Math.abs(Math.round(difference));
            if (this.formatIsWeekendOrFestivo(date1)) {
                return 0;
            }
            if (tempHours < 6) {
                return 6;
            } else if (tempHours > 6) {
                return 8;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    formatDifferenceAccurateHours(date2, date1) {
        const checkIn = moment(date1);
        const checkOut = moment(date2);
        const duration = moment.duration(checkOut.diff(checkIn));

        const hours = Math.floor(duration.asHours());
        const minutes = Math.floor(duration.asMinutes()) % 60;

        return `${hours} ore e ${minutes} minuti`;
    }
    formatIsWeekendOrFestivo(date) {
        if (date.getDay() == 6 || date.getDay() == 0) return true;
        return false;
    }
    formatFullNameExcelSheet(name, surname) {
        return (
            surname.split(' ')[0].replace(/[^a-zA-Z0-9 ]/g, '') +
            '-' +
            name.split(' ')[0].replace(/[^a-zA-Z0-9 ]/g, '')
        ).toUpperCase();
    }
    formatAttendancesExcelSheet(attendances) {
        let formattedAttendances = [];
        for (let attendance of attendances) {
            console.log(attendance);
            const rowStyle = true
                ? { font: { color: { rgb: 'FF0000FF' } } }
                : {};

            formattedAttendances.push({
                Data: moment(attendance?.checkIn).format('DD-MM-YYYY'),
                Giorno: moment(attendance?.checkIn).format('dddd'),
                'Check In': moment(attendance?.checkIn).format('HH:mm'),
                'Check Out': moment(attendance?.checkOut).format('HH:mm'),
                'Ore precise': attendance?.workedAccurateHours,
                'Ore Totali': attendance?.workedHours,
                Stato: attendance?.status,
                _row: rowStyle, // Assign the style to _row property
            });
        }

        return formattedAttendances;
    }

    formatTotalWorkedHours(attendances) {
        let hours: number = 0;
        for (let attendance of attendances) {
            hours += attendance?.checkOut
                ? this.formatDifferenceHours(
                      new Date(attendance?.checkOut),
                      new Date(attendance?.checkIn),
                  )
                : 0;
        }
        return hours;
    }
}
