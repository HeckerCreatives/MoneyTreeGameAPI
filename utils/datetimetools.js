exports.DateTimeServer = () => {
    const date = new Date();
    
    // Get the Unix timestamp in milliseconds
    const unixTimeMilliseconds = date.getTime();
        
    // Convert it to Unix timestamp in seconds
    const unixTimeSeconds = Math.floor(unixTimeMilliseconds / 1000);
    
    return unixTimeSeconds;
}

exports.DateTimeServerExpiration = (expiration) => {
    const date = new Date();

    // Get the Unix timestamp in milliseconds
    const unixTimeMilliseconds = date.getTime();

    // Convert it to Unix timestamp in seconds
    const unixTimeSeconds = Math.floor(unixTimeMilliseconds / 1000);

    // Add 30 days (30 * 24 * 60 * 60 seconds) to the current timestamp
    const unixTimeSecondsIn30Days = unixTimeSeconds + (expiration * 24 * 60 * 60);

    return unixTimeSecondsIn30Days;
}

exports.checktwentyfourhours = (datetimestamp) => {
    const moment = require('moment');

    // Assuming 'timestamp' is the stored timestamp
    const timestamp = new Date(datetimestamp); // Example timestamp

    // Calculate the difference in hours between the current time and the stored timestamp
    const hasPassed24Hours = moment().diff(moment(timestamp), 'hours') >= 24;

    if (hasPassed24Hours) {
        return false
    } else {
        return true
    }
}


exports.AddUnixtimeDay = (unixtime, daystoadd) => {

    //  FOR TESTING PURPOSES
    // return parseFloat(unixtime) + (daystoadd * 60);

    return parseFloat(unixtime) + (daystoadd * 24 * 60 * 60);
}

exports.RemainingTime = (startTime, claimDays) => {
    //  FOR TESTING PURPOSES
    // Convert the start time from Unix time (seconds) to milliseconds
    // const startTimeMilliseconds = parseFloat(startTime) * 1000;

    // // Convert claimDays to milliseconds, but scale 1 day to 1 minute for testing
    // const claimDaysMilliseconds = parseFloat(claimDays) * 60 * 1000;

    // // Calculate the target time by adding the claimDays to the startTime
    // const targetTimeMilliseconds = startTimeMilliseconds + claimDaysMilliseconds;

    // // Get the current time in milliseconds
    // const currentTimeMilliseconds = Date.now();

    // // Calculate the remaining time by subtracting the current time from the target time
    // const remainingTimeMilliseconds = targetTimeMilliseconds - currentTimeMilliseconds;

    // // If the remaining time is less than 0, it means the target time has passed
    // if (remainingTimeMilliseconds < 0) {
    //     return 0;
    // }

    // // Convert the remaining time to Unix timestamp in seconds
    // const remainingTimeSeconds = Math.floor(remainingTimeMilliseconds / 1000);

    // return remainingTimeSeconds;

    // Convert the start time from Unix time (seconds) to milliseconds
    const startTimeMilliseconds = parseFloat(startTime) * 1000;

    // Convert claimDays to milliseconds
    const claimDaysMilliseconds = parseFloat(claimDays) * 24 * 60 * 60 * 1000;

    // Calculate the target time by adding the claimDays to the startTime
    const targetTimeMilliseconds = startTimeMilliseconds + claimDaysMilliseconds;

    // Get the current time in milliseconds
    const currentTimeMilliseconds = Date.now();

    // Calculate the remaining time by subtracting the current time from the target time
    const remainingTimeMilliseconds = targetTimeMilliseconds - currentTimeMilliseconds;

    // If the remaining time is less than 0, it means the target time has passed
    if (remainingTimeMilliseconds < 0) {
        return 0;
    }

    // Convert the remaining time to Unix timestamp in seconds
    const remainingTimeSeconds = Math.floor(remainingTimeMilliseconds / 1000);

    return remainingTimeSeconds;
}
