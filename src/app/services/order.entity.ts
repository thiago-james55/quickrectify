import { Consumer } from "./consumer.entity";
import { OrderPart } from "./part.entity";

export interface Order {
    id?: number;
    date?: Date;
    consumer?: Consumer;
    orderParts: OrderPart[];
    discountPercent?: number;
    discountCash?: number;
    priceSubTotal?: number;
    priceTotal?: number;
}