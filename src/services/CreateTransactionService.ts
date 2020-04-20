import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const balanceTotal = this.transactionsRepository.getBalance().total;

    if (type !== 'income' && type !== 'outcome') {
      throw Error('Invalid type of transaction');
    }

    if (value < 1) {
      throw Error('The amount should be more than 0');
    }

    if (type === 'outcome' && value > balanceTotal) {
      throw Error('Not enough balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
