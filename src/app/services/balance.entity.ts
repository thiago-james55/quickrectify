import { Consumer } from "./consumer.entity";

export interface Balance {
    id?: number;
    date?: Date;
    dateOfPayment?: Date;
    initialOrder?: number;
    finalOrder?: number;
    excludedOrders?: number[];
    description?: string;
    consumer?: Consumer;
    consumerId?: number;
    priceTotal?: number;
    isPaid?: boolean;
}