// To parse this data:
//
//   import { Convert, DashboardModel } from "./file";
//
//   const dashboardModel = Convert.toDashboardModel(json);

export interface DashboardModel {
    status: string;
    data:   Data;
}

export interface Data {
    users:                string;
    premiumSubscriptions: string;
    profileViews:         string;
    paidUsers:            number[];
    normalUsers:          number[];
}

// Converts JSON strings to/from your types
export class Convert {
    public static toDashboardModel(json: string): DashboardModel {
        return JSON.parse(json);
    }

    public static dashboardModelToJson(value: DashboardModel): string {
        return JSON.stringify(value);
    }
}
