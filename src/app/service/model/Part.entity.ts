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
 
 export const parts: Part[] = [
    { name : "Biela" , services : ["Banho","Completa","Só Ferro","Só Bucha","Montar Pistão"] },
    { name : "Bloco" , services : ["Banho","Abrir","Encamisar","Plainar","Soldar","Mandrilhar","Trocar Bucha"] },
    { name : "Cabeçote" , services : ["Banho","Plainar","Soldar","Mandrilhar","Completo","Regular"] },
    { name : "Virabrequim" , services : ["Banho","Retificar","Encher Lateral","Polir"] },
    { name : "Volante" , services : ["Banho","Retificar","Virar Gremalheira"] },
    { name : "Outros" , services : ["Solda Ferro","Solda Aluminio","Solda Cart"] },
];

export function getParts() : Part[] {

    parts.forEach(e => {
        e.services.sort();
    });

    return parts;
}