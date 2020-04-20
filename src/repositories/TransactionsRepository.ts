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

  constructor() {
    this.transactions = [];
    this.incomeValues = [];
    this.outcomeValues = [];
  }

  public all(): Transaction[] {
    if (!this.transactions) {
      throw Error('Something went wrong');
    }

    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTransactions = this.transactions.filter(transaction => {
      return transaction.type === 'income';
    });
    incomeTransactions.forEach(item => this.incomeValues.push(item.value));
    const incomeTotal = this.incomeValues.reduce((acc, tot) => acc + tot);

    const outcomeTransactions = this.transactions.filter(transaction => {
      return transaction.type === 'outcome';
    });
    outcomeTransactions.forEach(item => this.outcomeValues.push(item.value));
    const outcomeTotal = this.outcomeValues.reduce((acc, tot) => acc + tot);

    const total = incomeTotal - outcomeTotal;

    const balance: Balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
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
