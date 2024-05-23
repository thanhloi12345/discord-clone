import moment from "moment";

export function shortenFileName(fileName: string, maxLength: number) {
  if (fileName.length <= maxLength) {
    return fileName;
  }

  var firstPartLength = Math.ceil((maxLength - 6) / 2);
  var lastPartLength = Math.floor((maxLength - 6) / 2);

  return (
    fileName.substring(0, firstPartLength) +
    "..." +
    fileName.substring(fileName.length - lastPartLength - 5)
  );
}

export function formatTimeAgo(createdTime: string) {
  const currentTime = moment();
  const timeDiff = currentTime.diff(createdTime, "seconds");

  if (timeDiff >= 86400 * 2) {
    // Nếu thời gian đã trôi qua hơn 2 ngày
    return moment(createdTime).format("DD/MM/YYYY HH:mm");
  } else if (timeDiff >= 86400 && timeDiff < 86400 * 2) {
    // Nếu thời gian đã trôi qua từ 1 đến 2 ngày
    return "hôm qua lúc " + moment(createdTime).format("HH:mm");
  } else {
    return moment.duration(timeDiff, "seconds").humanize(true);
  }
}

export function dB_to_mappedValue(dB: number) {
  // Tính linear từ dB
  let linear = Math.pow(10, dB / 20);

  // Phạm vi tuyến tính tương ứng với dB
  let minLinear = Math.pow(10, -160 / 20);
  let maxLinear = Math.pow(10, -1 / 20);

  // Phạm vi mong muốn
  let minMapped = 3;
  let maxMapped = 25;

  // Ánh xạ giá trị tuyến tính vào phạm vi mong muốn
  let mappedValue =
    ((linear - minLinear) * (maxMapped - minMapped)) / (maxLinear - minLinear) +
    minMapped;

  return mappedValue;
}

export function getDurationFormatted(milliseconds: number) {
  const minutes = milliseconds / 1000 / 60;
  const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
  return seconds < 10
    ? `${Math.floor(minutes)}:0${seconds}`
    : `${Math.floor(minutes)}:${seconds}`;
}

export function isValidString(input: string) {
  const regex = /^myapp:\/\/server\/invite\?serverId=.+&secretKey=.+$/;
  return regex.test(input);
}
