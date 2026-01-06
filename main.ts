export class Technician {
  private _name: string;
  private _averageRepairTime: number; // 1 minute ~ 1 second
  // you can add your own attribute

  constructor(name: string, averageRepairTime: number) {
    this._name = name;
    this._averageRepairTime = averageRepairTime;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set averageRepairTime(averageRepairTime: number) {
    this._averageRepairTime = averageRepairTime;
  }

  public get averageRepairTime() {
    return this._averageRepairTime;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async repairing(customer: Customer): Promise<void> {
    console.log(`>> Technician ${this._name} is repairing ${customer.name}'s phone. Customer phone is ${customer.phoneSeries} series <<`);
    await this.delay(this._averageRepairTime * 1000);
    console.log(`      REPAIRING DONE: ${this._name} FIXED ${customer.name}'s phone!`);
    customer.repairedBy = this._name;
  }
}

export class Customer {
  private _name: string;
  private _phoneSeries: string;
  // you can add your own attribute
  public repairedBy: string;

  constructor(name: string, phoneSeries: string) {
    this._name = name;
    this._phoneSeries = phoneSeries;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set phoneSeries(phoneSeries: string) {
    this._phoneSeries = phoneSeries;
  }

  public get phoneSeries() {
    return this._phoneSeries;
  }
}

export class ServiceCenter {
  private _name: string;
  private _address: string;
  private _technicians: Technician[];
  private _customers: Customer[];
  // you can add your own attribute

  constructor(name: string, address: string, technicians: Technician[], customers: Customer[]) {
    this._name = name;
    this._address = address;
    this._technicians = technicians;
    this._customers = customers;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public set address(address: string) {
    this._address = address;
  }

  public get address() {
    return this._address;
  }

  public async startOperating() {
    const startTime = Date.now();
    const queue = [...this._customers];
    const results: Customer[] = [];

    const worker = async (tech: Technician) => {
      while (queue.length > 0) {
        const customer = queue.shift();
        if (customer) {
          await tech.repairing(customer);
        }
      }
    };

    await Promise.all(this._technicians.map(tech => worker(tech)));

    console.log('\nService Center Log for today:');
    const tableData = this._customers.map((customer) => ({
      customerName: customer.name,
      phone: customer.phoneSeries,
      phoneRepairedBy: customer.repairedBy
    }));
    console.table(tableData);

    const endTime = Date.now();
    console.log(`Done in ${((endTime - startTime) / 1000).toFixed(2)}s.`);
  }
}

// ====================================================================================
// MAIN
// ====================================================================================

// Define Technician
const dalton = new Technician('Dalton', 10); // 10 seconds
const wapol = new Technician('Wapol', 20); // 20 seconds
const technicians = [dalton, wapol];

// Define Phone series
const PhoneSeries: string[] = ['Jaguar', 'Leopard', 'Lion'];

// Define Customer
// Generate 10 customers
const customers = new Array(10).fill(null).map((_, index) => {
  const randomSeries = PhoneSeries[Math.floor(Math.random() * PhoneSeries.length)];
  return new Customer(`Customer ${index}`, randomSeries);
});

// Define Service Center
const serviceCenter: ServiceCenter = new ServiceCenter('First Service Center', 'Long Ring Long Land Street', technicians, customers);
console.log('Customer on queue: ');
console.table(customers);
console.log('\n');

// Begin Operating
console.log(`${serviceCenter.name} start operating today: `);
serviceCenter.startOperating().catch(err => console.log(err));
