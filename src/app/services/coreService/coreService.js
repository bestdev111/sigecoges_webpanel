class CoreService {
  static getMyReport(geofence, date) {
    if (!geofence) {
      return null;
    }
    const tempReportArray = [];
    const tempActivityArray = [];
    for (const key in geofence) {
      if (Object.hasOwnProperty.call(geofence, key)) {
        const element = geofence[key];
        element._id = key;
        const bool = false;
        const from_date = this.getDateStringFromTimestamp(element.timestamp);
        for (const key1 in geofence) {
          if (Object.hasOwnProperty.call(geofence, key1)) {
            const element1 = geofence[key1];
            const to_date = this.getDateStringFromTimestamp(element1.timestamp);
            if (
              new Date(from_date).getMonth() === new Date(date).getMonth() &&
              new Date(from_date).getFullYear() === new Date(date).getFullYear()
            ) {
              if (from_date === to_date && element.status !== element1.status) {
                let start_time = '';
                let end_time = '';
                let hours = 0;

                if (element.timestamp < element1.timestamp) {
                  start_time = this.getTimeStringFromTimestamp(element.timestamp);
                  end_time = this.getTimeStringFromTimestamp(element1.timestamp);
                  hours = parseFloat((element1.timestamp - element.timestamp) / 1000 / 60 / 60);

                  hours = Math.round(hours * 100) / 100;
                  const geoActivity = {
                    _id: element._id,
                    geofence_id: element.geofence_id,
                    date: from_date,
                    start_time,
                    end_time,
                    hours,
                  };
                  tempActivityArray.push(geoActivity);
                }
                break;

                // if (element.timestamp > element1.timestamp) {
                //     start_time = this.getTimeStringFromTimestamp(element1.timestamp);
                //     end_time = this.getTimeStringFromTimestamp(element.timestamp);
                //     hours = parseFloat((element.timestamp - element1.timestamp) / 1000 / 60 / 60);
                //     console.log('hey!!!!=>2=>', hours);
                // } else {
                //     start_time = this.getTimeStringFromTimestamp(element.timestamp);
                //     end_time = this.getTimeStringFromTimestamp(element1.timestamp);
                //     hours = parseFloat((element1.timestamp - element.timestamp) / 1000 / 60 / 60);
                //     console.log('hey!!!!=>1=>', hours);
                // }
                // let geoActivity = {
                //     _id: element._id,
                //     geofence_id: element.geofence_id,
                //     date: from_date,
                //     start_time: start_time,
                //     end_time : end_time,
                //     hours : hours
                // };
                // tempActivityArray.push(geoActivity);
                // break;
              }
            }
          }
        }
        tempReportArray.push(element);
      }
    }
    const data = {
      report: tempReportArray,
      activity: tempActivityArray,
    };
    return data;
  }

  static getFullDateStringFromTimestamp(timestamp) {
    const date = new Date(timestamp).toLocaleString('en-US');
    return date;
  }

  static getDateStringFromTimestamp(timestamp) {
    const date = new Date(timestamp).toLocaleDateString('en-US');
    return date;
  }

  static getTimeStringFromTimestamp(timestamp) {
    const date = new Date(timestamp).toLocaleTimeString('en-US').replace(/(.*)\D\d+/, '$1');
    return date;
  }

  static getGroupList(userArray) {
    const tempGroups = [];
    if (userArray !== undefined && userArray.length > 0) {
      userArray.forEach((element) => {
        if (!tempGroups.includes(element.group_name)) {
          tempGroups.push(element.group_name);
        }
      });
    }
    return tempGroups;
  }
}

export default CoreService;
