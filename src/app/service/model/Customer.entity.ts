export interface Customer {
    
    id?: number;
    name?: string;
    document?: string;
    address?: string;
    phone1?: string;
    phone2?: string;
    phone3?: string;
}


export function getCustomers() : Customer[] {

    const customers: Customer[] = [];

    for (let i = 0; i < 51; i++) {
        customers.push(
            { 
                name :`Customer${i}` , 
                document: "1234567",
                address: "Rua Random",
                phone1: "9-9875-4321" 
            }
        )        
    }

    return customers;
}