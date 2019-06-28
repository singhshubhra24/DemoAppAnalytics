;(function(globals) {
    function populateCohortData (data, filter, startDate, endDate, moment) {
        var cohortData = [];
        if (filter == 'monthly') {
            var currentYear = moment(startDate).format('YYYY');
            var currentDay = moment(startDate).format('D');
            currentYear = parseInt(currentYear);
            var yearsDiff = moment(endDate).diff(moment(startDate), 'years', true);
            yearsDiff = Math.ceil(yearsDiff);

            var currentMonth = moment(startDate).format('MM');
            currentMonth = parseInt(currentMonth);
            var monthsDiff = moment(endDate).diff(moment(startDate), 'months', true);
            var endMonth = moment(endDate).format('MM');
            var endYear = moment(endDate).format('YYYY');

            monthsDiff = Math.ceil(monthsDiff);
            var monthsArray = [];
            var yearsArray = [];
            //console.log("monthsDiff:"+monthsDiff);
            for (var i = 0; i <= yearsDiff; i++) {
                yearsArray.push(currentYear);
                for (var j = i; j < monthsDiff; j++) {
                    monthsArray.push(currentYear + "." + currentMonth);
                    if (currentMonth == 12) {
                        currentMonth = 1;
                        break;
                    } else {
                        currentMonth++;
                    }
                }
                currentYear++;
            }

            var daysDiff = moment(endDate).diff(moment(startDate), 'days', true);
            daysDiff = Math.ceil(daysDiff);

            //var yearKeys = Object.keys(data);
            yearsArray.forEach(function (year) {
                if (data[year]) {
                    //var monthKeys = Object.keys(data[year]);
                    monthsArray.forEach(function (yearMonth) {
                        var arg = yearMonth.split('.');
                        var month = parseInt(arg[1]);
                        arg[0] = parseInt(arg[0]);
                        //console.log(year, month);
                        if (data[year][month] && year == arg[0]) {
                            var tempArray = [];
                            var installs = 0;
                            var uninstalls = 0;
                            var daysKeys = Object.keys(data[year][month]);
                            daysKeys.forEach(function (day) {
                                var Keys = Object.keys(data[year][month][day]);
                                Keys.forEach(function (key) {
                                    if (key == 'in') {
                                        installs += data[year][month][day][key];
                                    }
                                    else if (key == 'un') {
                                        uninstalls += data[year][month][day][key];
                                    }
                                });
                            });

                            tempArray.push(installs);
                            if (installs > 0) {
                                // get remain installs
                                var tempDays = 1;
                                var totalDays = 0;
                                for (var i = 1; i <= monthsDiff; i++) {
                                    var tmp_ins = tempArray[tempArray.length - 1];
                                    var daysInMonth = (moment(year + "-" + i + '-' + currentDay, "YYYY-MM-D").daysInMonth()) + 1; //new Date(year,month,1,-1).getDate();
                                    totalDays += daysInMonth;
                                    //console.log(tempDays+" :: "+totalDays);
                                    for (j = tempDays; j <= totalDays; j++) {
                                        daysKeys.forEach(function (day) {
                                            if (data[year][month][day][j]) {
                                                uninstalls += data[year][month][day][j];
                                            }
                                        });
                                    }

                                    currentDay = 1;
                                    tempDays = totalDays;
                                    //console.log(tmp_ins+" :: "+uninstalls);
                                    var remainTotal = (tmp_ins >= uninstalls) ? tmp_ins - uninstalls : 0;
                                    tempArray.push(remainTotal);
                                    uninstalls = 0;
                                }

                            } else {
                                for (var i = 1; i <= monthsDiff; i++) {
                                    tempArray.push(0);
                                }
                            }
                            if (tempArray.length > 0) {
                                monthsDiff--;
                                cohortData.push(tempArray);
                            }
                        } else {
                            if (year == arg[0] && month) {
                                var tempArray = [];
                                for (var i = 0; i <= monthsDiff; i++) {
                                    tempArray.push(0);
                                }
                                if (tempArray.length > 0) {
                                    monthsDiff--;
                                    cohortData.push(tempArray);
                                }
                            }
                        }
                    });
                }
                else {
                    for (var j = 0; j < 12; j++) {
                        var tempArray = [];
                        for (var i = 0; i < monthsDiff; i++) {
                            tempArray.push(0);
                        }
                        if (tempArray.length > 0) {
                            monthsDiff--;
                            cohortData.push(tempArray);
                        }
                    }
                }
            });
        }
        else if (filter == 'daily') {
            var currentDay = moment(startDate).format('DD');
            currentDay = parseInt(currentDay);
            var currentMonth = moment(startDate).format('MM');
            currentMonth = parseInt(currentMonth);
            var currentYear = moment(startDate).format('YYYY');
            currentYear = parseInt(currentYear);
            var daysDiff = moment(endDate).diff(moment(startDate), 'days', true);
            daysDiff = Math.round(daysDiff);
            var daysArray = [];

            for (var i = 0; i <= daysDiff; i++) {
                daysArray.push(currentYear + "_" + currentMonth + "_" + currentDay);
                var mdays = new Date(currentYear, currentMonth, 0).getDate();
                currentDay++;
                if (currentDay > mdays) {
                    currentDay = 1;
                    currentMonth++;
                    if (currentMonth > 12) {
                        currentMonth = 1;
                        currentYear++;
                    }
                }
            }

            daysArray.forEach(function (value) {
                var argsData = value.split("_");
                var year = argsData[0];
                var month = argsData[1];
                var day = argsData[2];

                if (data[year]) {
                    if (data[year][month]) {
                        if (daysDiff > 0) {
                            if (data[year][month][day]) {
                                var tempArray = [];
                                var installs = 0;
                                var uninstalls = 0;
                                var Keys = Object.keys(data[year][month][day]);
                                Keys.forEach(function (key) {
                                    if (key == 'in') {
                                        installs += data[year][month][day][key];
                                    }
                                    else if (key == 'un') {
                                        uninstalls += data[year][month][day][key];
                                    }
                                });

                                tempArray.push(installs);
                                if (installs > 0) {
                                    uninstalls = (uninstalls > installs) ? installs : uninstalls;
                                    tempArray.push(installs - uninstalls);
                                    // get remain installs
                                    for (var i = 1; i < daysDiff; i++) {
                                        var tmp_ins = tempArray[tempArray.length - 1];
                                        var uninstalls = 0;
                                        if (data[year][month][day][i]) {
                                            uninstalls = data[year][month][day][i]
                                        }
                                        var insVal = (tmp_ins - uninstalls < 0) ? 0 : tmp_ins - uninstalls;
                                        tempArray.push(insVal);
                                    }
                                } else {
                                    for (var i = 1; i < daysDiff; i++) {
                                        tempArray.push(0);
                                    }
                                }
                                daysDiff--;
                                cohortData.push(tempArray);
                            } else {
                                var tempArray = [];
                                for (var i = 0; i <= daysDiff; i++) {
                                    tempArray.push(0);
                                }
                                if (tempArray.length > 0) {
                                    daysDiff--;
                                    cohortData.push(tempArray);
                                }
                            }
                        }
                    }
                    else {
                        var tempArray = [];
                        for (var i = 0; i <= daysDiff; i++) {
                            tempArray.push(0);
                        }
                        if (tempArray.length > 0) {
                            daysDiff--;
                            cohortData.push(tempArray);
                        }
                    }
                }
                else {
                    var tempArray = [];
                    for (var i = 0; i <= daysDiff; i++) {
                        tempArray.push(0);
                    }
                    if (tempArray.length > 0) {
                        daysDiff--;
                        cohortData.push(tempArray);
                    }
                }
            })
        }
        else if (filter == 'yearly') {
            var currentYear = moment(startDate).format('YYYY');
            currentYear = parseInt(currentYear);
            var yearDiff = moment(endDate).diff(moment(startDate), 'years', true);
            yearDiff = Math.ceil(yearDiff);
            var yearArray = [];

            for (var i = 0; i <= yearDiff; i++) {
                yearArray.push(currentYear);
                currentYear++;
            }

            yearArray.forEach(function (year) {
                if (yearDiff >= 0) {
                    if (data[year]) {
                        var tempArray = [];
                        var installs = 0;
                        var uninstalls = 0;

                        var monthKeys = Object.keys(data[year]);
                        monthKeys.forEach(function (month) {
                            var daysKeys = Object.keys(data[year][month]);
                            daysKeys.forEach(function (day) {
                                var Keys = Object.keys(data[year][month][day]);
                                Keys.forEach(function (key) {
                                    if (key == 'in') {
                                        installs += data[year][month][day][key];
                                    } else if (key == 'un') {
                                        uninstalls += data[year][month][day][key];
                                    }

                                    else if (!isNaN(key)) {
                                        //console.log('key::'+key)
                                        uninstalls += data[year][month][day][key];
                                    }
                                });
                            });
                        });

                        tempArray.push(installs);
                        if (installs > 0) {
                            tempArray.push(installs - uninstalls);
                            // get remain installs
                        } else {
                            for (var i = 1; i < yearDiff; i++) {
                                tempArray.push(0);
                            }
                        }
                        yearDiff--;
                        cohortData.push(tempArray);

                    } else {
                        var tempArray = [];
                        for (var i = 0; i < yearDiff; i++) {
                            tempArray.push(0);
                        }
                        yearDiff--;
                        cohortData.push(tempArray);
                    }
                }
            });
        }
        else if (filter == 'weekly') {

            var currentYear = moment(startDate).format('YYYY');
            currentYear = parseInt(currentYear);
            var yearsDiff = moment(endDate).diff(moment(startDate), 'years', true);
            yearsDiff = Math.ceil(yearsDiff);
            var yearsArray = [];

            var currentWeek = moment(startDate).week();
            currentWeek = parseInt(currentWeek);
            var weeksDiff = moment(endDate).diff(moment(startDate), 'weeks', true);
            weeksDiff = Math.round(weeksDiff);
            var weeksArray = [];
            var reset = false;

            var eYear = moment(endDate).format('YYYY');

            //console.log('yearsDiff:'+yearsDiff)
            for (var i = 0; i <= yearsDiff; i++) {
                if (eYear < currentYear) {
                    break;
                }

                yearsArray.push(currentYear);
                for (var j = 0; j <= weeksDiff; j++) {
                    var cYear = parseInt(moment(currentYear, 'YYYY').week(currentWeek).format('YYYY'));
                    if (cYear == currentYear) {
                        weeksArray.push(currentYear + "_" + currentWeek);
                        if (reset) {
                            if (currentWeek == parseInt(moment(endDate).week())) {
                                break;
                            }
                        }
                        currentWeek++;
                    }
                    else {
                        currentWeek = 1;
                        reset = true;
                        break;
                    }
                }
                currentYear++;
            }

            /*var currentWeek = moment(startDate).week();
            currentWeek = parseInt(currentWeek);
            var weeksDiff = moment(endDate).diff(moment(startDate), 'weeks', true);
            weeksDiff = Math.ceil(weeksDiff);
            var weeksArray = [];*/
            //weeksDiff = weeksDiff;
            /*console.log('yearsArray:'+yearsArray);
            console.log('weeksArray:'+weeksArray);*/

            /*for(var i=0; i<=weeksDiff; i++){
                weeksArray.push(currentWeek);
                currentWeek++;
            }*/
            //console.log('weeksArray:'+weeksArray);

            yearsArray.forEach(function (year) {
                //var monthKeys = Object.keys(data[year]);
                if (data[year]) {
                    weeksArray.forEach(function (week) {
                        //var monthKeys = Object.keys(data[year]);
                        var arg = week.split("_");
                        week = parseInt(arg[1]);
                        if (data[year][week] && year == parseInt(arg[0])) {
                            //console.log(year+' if:'+week);
                            var tempArray = [];
                            var installs = 0;
                            var uninstalls = 0;
                            var Keys = Object.keys(data[year][week]);
                            Keys.forEach(function (key) {
                                if (key == 'in') {
                                    installs += data[year][week][key];
                                }
                                else if (key == 'un') {
                                    uninstalls += data[year][week][key];
                                }
                            });
                            tempArray.push(installs);
                            if (installs > 0) {
                                uninstalls = (uninstalls > installs) ? installs : uninstalls;
                                tempArray.push(installs - uninstalls);
                                // get remain installs

                                for (var i = 1; i <= weeksDiff; i++) {
                                    var tmp_ins = tempArray[tempArray.length - 1];
                                    var uninstalls = 0;
                                    /*weeksArray.forEach(function(day){
                                         if(week == 15){
                                             consolef.log(JSON.stringify(data[year][week]));
                                         }
                                        var diffDay = parseInt(day)+parseInt(i);
                                        if(data[year][week][i]){
                                           uninstalls += data[year][week][i];
                                        }
                                     });*/
                                    if (data[year][week][i]) {
                                        uninstalls += data[year][week][i];
                                    }

                                    uninstalls = (uninstalls > tmp_ins) ? tmp_ins : uninstalls;
                                    tempArray.push(tmp_ins - uninstalls);
                                    //console.log('tmp_ins')
                                    //console.log(tmp_ins)
                                }
                            } else {
                                for (var i = 1; i <= weeksDiff; i++) {
                                    tempArray.push(0);
                                }
                            }
                            weeksDiff--;
                            cohortData.push(tempArray);
                        }
                        else {
                            //console.log(year+'else:'+week);
                            if (year == parseInt(arg[0]) && week) {
                                var tempArray = [];
                                for (var i = 0; i <= weeksDiff + 1; i++) {
                                    tempArray.push(0);
                                }
                                if (tempArray.length > 0) {
                                    weeksDiff--;
                                    cohortData.push(tempArray);
                                }
                            }
                        }
                    });
                }
                else {
                    for (var k = 1; k <= 53; k++) {
                        var tempArray = [];
                        for (var i = 0; i <= weeksDiff; i++) {
                            tempArray.push(0);
                        }
                        if (tempArray.length > 0) {
                            weeksDiff--;
                            cohortData.push(tempArray);
                        }
                    }
                }
            });
        }

        return cohortData;
    }
    globals.populateCohortData = populateCohortData;
})(window);