import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IRailAdapter } from '../domain/ports/rail-adapter.interface';
import { PawaPayAdapter } from './adapters/pawapay.adapter';
import { TnmAdapter } from './adapters/tnm.adapter';
import { AirtelAdapter } from './adapters/airtel.adapter';
import { RailUnavailableError } from '@shared/errors/rail-errors';

/**
 * @description Registry-based rail router. Maps railId strings to IRailAdapter instances.
 * To add a new rail: create adapter, inject it, call this.registry.set('RAIL_ID', adapter).
 * Nothing else changes.
 */
@Injectable()
export class RailRouterService implements OnModuleInit {
  private readonly logger = new Logger(RailRouterService.name);
  private readonly registry = new Map<string, IRailAdapter>();

  constructor(
    private readonly pawaPayAdapter: PawaPayAdapter,
    private readonly tnmAdapter: TnmAdapter,
    private readonly airtelAdapter: AirtelAdapter,
  ) {}

  onModuleInit(): void {
    this.registry.set('PAWAPAY', this.pawaPayAdapter);
    this.registry.set('TNM', this.tnmAdapter);
    this.registry.set('AIRTEL', this.airtelAdapter);
    this.logger.log(`Rail registry: [${[...this.registry.keys()].join(', ')}]`);
  }

  /**
   * @description Get adapter for a given railId.
   * @throws RailUnavailableError if rail not registered
   */
  getAdapter(railId: string): IRailAdapter {
    const adapter = this.registry.get(railId);
    if (!adapter)
      throw new RailUnavailableError(`Rail not registered: ${railId}`, railId);
    return adapter;
  }

  getDefaultAdapter(): IRailAdapter {
    return this.getAdapter('PAWAPAY');
  }
}
