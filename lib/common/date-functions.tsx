import { differenceInSeconds } from "date-fns";
export const differenceInTime = (to: Date, from: Date) => {
  const inSeconds = differenceInSeconds(to, from);
  const inMinutes = Math.floor(inSeconds / 60);
  const inHours = Math.floor(inMinutes / 60);
  const inDays = Math.floor(inHours / 24);
  const inMonths = Math.floor(inDays / 30);
  const inYears = Math.floor(inMonths / 12);
  if (inYears > 0) return `${inYears} year${inYears > 1 ? "s" : ""} ago`;
  else if (inMonths > 0)
    return `${inMonths} month${inMonths > 1 ? "s" : ""} ago`;
  else if (inDays > 0) return `${inDays} day${inDays > 1 ? "s" : ""} ago`;
  else if (inHours > 0) return `${inHours} hour${inHours > 1 ? "s" : ""} ago`;
  else if (inMinutes > 0)
    return `${inMinutes} minute${inMinutes > 1 ? "s" : ""} ago`;
  else if (inSeconds > 0)
    return `${inSeconds} second${inSeconds > 1 ? "s" : ""} ago`;

  return "Just now";
};
