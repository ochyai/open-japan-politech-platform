import type { BillStatus, SessionType } from "@ojpp/db";

export function mapBillStatus(status: string): BillStatus {
  switch (status) {
    case "成立":
      return "ENACTED";
    case "衆議院で可決":
      return "PASSED_LOWER";
    case "参議院で可決":
      return "PASSED_UPPER";
    case "審議中":
    case "委員会":
      return "COMMITTEE";
    case "否決":
      return "REJECTED";
    case "撤回":
      return "WITHDRAWN";
    default:
      return "SUBMITTED";
  }
}

export function mapSessionType(type: string): SessionType {
  switch (type) {
    case "通常":
      return "ORDINARY";
    case "臨時":
      return "EXTRAORDINARY";
    case "特別":
      return "SPECIAL";
    default:
      return "ORDINARY";
  }
}
