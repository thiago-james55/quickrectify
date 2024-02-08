//DefaultParts
export interface Part {
    name: string;
    services: string[];
}

export interface OrderPart {
    name: string;
    service?: string;
    description?: string;
    quantity?: number;
    pricePerQuantity?: number;
    priceTotal?: number;
}
