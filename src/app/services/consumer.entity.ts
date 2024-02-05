export interface Consumer {
    id?: number;
    name?: string;
    document?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    phone3?: string;
}


export function getConsumers() : Consumer[] {

    const consumers: Consumer[] = [];

    for (let i = 0; i < 51; i++) {
        consumers.push(
            { 
                id: i,
                name :`Consumer${i}` , 
                document: "1234567",
                address: "Rua Random",
                phone1: "9-9875-4321" 
            }
        )        
    }

    return consumers;
}