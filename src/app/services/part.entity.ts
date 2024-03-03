
export interface DefaultPart {
    name: string;
    services: string[];
}

export interface Part {
    name: string;
    service?: string;
    description?: string;
    quantity?: number;
    pricePerQuantity?: number;
    priceTotal?: number;
}
