import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { Technician, Customer, ServiceCenter } from './main.js';

describe('Service Center Unit Tests', () => {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(async () => {
        await jest.runOnlyPendingTimersAsync();
        jest.useRealTimers();
    });

    describe('Customer Randomization', () => {
        test('should assign a phone series from the allowed list', () => {
            const PhoneSeries = ['Jaguar', 'Leopard', 'Lion'];
            const customer = new Customer('Test Customer', PhoneSeries[Math.floor(Math.random() * PhoneSeries.length)]);

            expect(PhoneSeries).toContain(customer.phoneSeries);
        });
    });

    describe('Technician Class', () => {
        test('should complete a repair after the specified averageRepairTime', async () => {
            const tech = new Technician('Dalton', 10);
            const customer = new Customer('C1', 'Jaguar');

            const repairPromise = tech.repairing(customer);
            jest.advanceTimersByTime(10000);
            await Promise.resolve();
            await repairPromise;

            expect(customer.repairedBy).toBe('Dalton');
        });
    });

    describe('ServiceCenter Logic', () => {
        test('should process all customers in the queue', async () => {
            const tech = new Technician('FastTech', 1);
            const customers = [
                new Customer('C0', 'Lion'),
                new Customer('C1', 'Jaguar')
            ];
            const sc = new ServiceCenter('Test SC', 'Road 1', [tech], customers);

            const operatingPromise = sc.startOperating();
            await jest.advanceTimersByTimeAsync(2000);
            await operatingPromise;

            expect(customers[0].repairedBy).toBe('FastTech');
            expect(customers[1].repairedBy).toBe('FastTech');
        });

        test('should distribute work between two technicians', async () => {
            const dalton = new Technician('Dalton', 10);
            const wapol = new Technician('Wapol', 20);
            const customers = [
                new Customer('C0', 'Lion'),
                new Customer('C1', 'Jaguar'),
                new Customer('C2', 'Leopard')
            ];

            const sc = new ServiceCenter('Test SC', 'Road 1', [dalton, wapol], customers);
            const operatingPromise = sc.startOperating();
            await jest.runAllTimersAsync();
            await operatingPromise;

            const results = customers.map(c => c.repairedBy);
            expect(results).toContain('Dalton');
            expect(results).toContain('Wapol');
            expect(customers.every(c => c.repairedBy !== '')).toBe(true);
        });
    });
});