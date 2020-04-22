import { response } from 'express';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  private incomeValues: number[];

  private outcomeValues: number[];

  private incomeTotal: number;

  private outcomeTotal: number;

  constructor() {
    this.transactions = [];
    this.incomeValues = [];
    this.outcomeValues = [];
    this.incomeTotal = 0;
    this.outcomeTotal = 0;
  }

  public all(): Transaction[] {
    if (!this.transactions) {
      throw Error('Something went wrong');
    }

    return this.transactions;
  }

  public getBalance(): Balance {
    this.transactions.map(transaction => {
      if (transaction.type === 'income') {
        this.incomeValues.push(transaction.value);
      } else {
        this.outcomeValues.push(transaction.value);
      }
    });

    if (this.incomeValues.length > 0) {
      this.incomeTotal = this.incomeValues.reduce((acc, val) => acc + val);
    }

    if (this.outcomeValues.length > 0) {
      this.outcomeTotal = this.outcomeValues.reduce((acc, val) => acc + val);
    }

    const total = this.incomeTotal - this.outcomeTotal;

    const balance: Balance = {
      income: this.incomeTotal,
      outcome: this.outcomeTotal,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
