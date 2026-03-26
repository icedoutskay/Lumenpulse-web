import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionDto, TransactionType, TransactionStatus } from './dto/transaction.dto';
import { getMockTransactions } from './mocks/mock-transactions';

interface HorizonOperation {
  id: string;
  type: string;
  created_at: string;
  transaction_hash: string;
  source_account: string;
  [key: string]: any;
}

interface HorizonTransaction {
  id: string;
  created_at: string;
  successful: boolean;
  memo?: string;
  fee_charged?: string;
  operations: HorizonOperation[];
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private readonly horizonUrl: string;
  private readonly useMockData: boolean;

  constructor(private configService: ConfigService) {
    const network = this.configService.get('STELLAR_NETWORK', 'testnet');
    this.horizonUrl = network === 'testnet' 
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';
    
    // Check if we should use mock data (can be set via environment variable)
    this.useMockData = this.configService.get('USE_MOCK_TRANSACTIONS', 'true') === 'true';
    if (this.useMockData) {
      this.logger.log('Using mock transaction data for testing');
    }
  }

  async getTransactionHistory(
    publicKey: string,
    limit: number = 50,
    cursor?: string,
  ): Promise<{ transactions: TransactionDto[]; nextPage?: string }> {
    this.logger.log(`Fetching transaction history for ${publicKey}`);
    
    // Use mock data if enabled
    if (this.useMockData) {
      this.logger.log('Returning mock transaction data');
      return getMockTransactions(limit, cursor);
    }

    try {
      // Build URL for account transactions
      let url = `${this.horizonUrl}/accounts/${publicKey}/transactions?order=desc&limit=${limit}`;
      if (cursor) {
        url += `&cursor=${cursor}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch transactions');
      }

      const transactions = await this.processTransactions(data._embedded.records);
      let nextPage: string | undefined;
      
      if (data._links?.next?.href) {
        const nextUrl = new URL(data._links.next.href);
        nextPage = nextUrl.searchParams.get('cursor') || undefined;
      }

      return { transactions, nextPage };
    } catch (error) {
      this.logger.error(`Failed to fetch transactions: ${error.message}`);
      return { transactions: [] };
    }
  }

  private async processTransactions(records: HorizonTransaction[]): Promise<TransactionDto[]> {
    const transactions: TransactionDto[] = [];

    for (const record of records) {
      // Fetch operations for this transaction
      const operations = await this.getTransactionOperations(record.id);
      
      for (const operation of operations) {
        const transaction = this.mapToTransactionDto(operation, record);
        if (transaction) {
          transactions.push(transaction);
        }
      }
    }

    return transactions;
  }

  private async getTransactionOperations(transactionId: string): Promise<HorizonOperation[]> {
    try {
      const url = `${this.horizonUrl}/transactions/${transactionId}/operations`;
      const response = await fetch(url);
      const data = await response.json();
      return data._embedded?.records || [];
    } catch (error) {
      this.logger.error(`Failed to fetch operations for ${transactionId}: ${error.message}`);
      return [];
    }
  }

  private mapToTransactionDto(
    operation: HorizonOperation,
    transaction: HorizonTransaction,
  ): TransactionDto | null {
    const type = this.mapTransactionType(operation.type);
    if (!type) return null;

    const dto: TransactionDto = {
      id: operation.id,
      type,
      amount: this.getAmountFromOperation(operation),
      assetCode: this.getAssetCode(operation),
      assetIssuer: this.getAssetIssuer(operation),
      from: operation.source_account || operation.from || '',
      to: operation.to || operation.into || '',
      date: operation.created_at,
      status: transaction.successful ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
      transactionHash: transaction.id,
      memo: transaction.memo,
      fee: transaction.fee_charged,
    };

    return dto;
  }

  private mapTransactionType(horizonType: string): TransactionType | null {
    switch (horizonType) {
      case 'payment':
      case 'path_payment':
      case 'path_payment_strict_send':
      case 'path_payment_strict_receive':
        return TransactionType.PAYMENT;
      case 'manage_offer':
      case 'create_passive_offer':
        return TransactionType.SWAP;
      case 'change_trust':
        return TransactionType.TRUSTLINE;
      case 'create_account':
        return TransactionType.CREATE_ACCOUNT;
      case 'account_merge':
        return TransactionType.ACCOUNT_MERGE;
      default:
        return null;
    }
  }

  private getAmountFromOperation(operation: HorizonOperation): string {
    return operation.amount || operation.amount_charged || '0';
  }

  private getAssetCode(operation: HorizonOperation): string {
    if (operation.asset_type === 'native') return 'XLM';
    return operation.asset_code || operation.asset_issuer ? 'Custom' : 'XLM';
  }

  private getAssetIssuer(operation: HorizonOperation): string | null {
    return operation.asset_issuer || null;
  }
}