const format_date= (strDate, withHour) => {
    date = new Date(strDate);
    year = date.getFullYear();
    day = date.getUTCDate();
    day = day < 10?`0${day}`: String(day);
    month = date.getMonth() + 1;
    month = month < 10?`0${month}`: String(month);
    if(withHour){
        hours = date.getHours()
        hours = hours < 10?`0${hours}`: String(hours);
        minutes = date.getMinutes();
        minutes = minutes < 10?`0${minutes}`: String(minutes);
        formatted_date = `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    else{
        formatted_date = `${year}-${month}-${day}`;
    }
    return formatted_date;
}