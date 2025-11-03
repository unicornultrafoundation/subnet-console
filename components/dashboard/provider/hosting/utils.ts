import { Deployment, Service, Replica } from "./types";

export const getStatusColor = (
  status: Deployment["status"] | Service["status"] | Replica["status"],
) => {
  switch (status) {
    case "running":
      return "success";
    case "stopped":
    case "succeeded":
      return "default";
    case "starting":
    case "stopping":
    case "pending":
    case "terminating":
      return "warning";
    case "error":
    case "failed":
      return "danger";
    default:
      return "default";
  }
};

export const getRemainingTime = (leaseEndAt: string, nowTs: number) => {
  const end = new Date(leaseEndAt).getTime();
  const remaining = Math.max(0, end - nowTs);
  return remaining;
};

export const formatHMS = (totalMs: number) => {
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  if (days > 0) {
    return `${days}d ${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

export const formatRemainingTime = (leaseEndAt: string, nowTs: number) => {
  const remaining = getRemainingTime(leaseEndAt, nowTs);
  if (remaining === 0) {
    return "Expired";
  }
  return formatHMS(remaining);
};

