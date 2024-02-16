import { Consumer } from "./consumer.entity";
import { Part } from "./part.entity";

export interface Order {
    id?: number;
    date?: Date;
    consumer?: Consumer;
    parts: Part[];
    discountPercent?: number;
    discountCash?: number;
    priceSubTotal?: number;
    priceTotal?: number;
}