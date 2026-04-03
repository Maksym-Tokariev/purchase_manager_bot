import {StateManager} from "../StateManager";
import {PurchaseFlowService} from "../PurchaseFlowService";
import {IInputSource} from "../../models/IInputSource";
import {IEventListener} from "../interfaces/IEventListener";
import {EventManager} from "../event/EventManager";
import {Logger} from "../../utils/Logger";
import {IStrategy} from "../interfaces/IStrategy";

export class StrategyFactory implements IEventListener {
    private readonly logger = new Logger(StrategyFactory.name);

    constructor(
        private state: StateManager,
        private flow: PurchaseFlowService,
        private event: EventManager,
        private strategies: Set<IStrategy>
    ) {}

    async findStrategy(event: IInputSource) {
        this.logger.debug(`${event.text}`);
        if (event.userId && this.state.isInFlow(event.userId) && event.text) {
            this.logger.debug('Flow message');
            await this.flow.handleFlow(event.userId, event.chatId, event.text);
            return;
        }

        this.logger.debug('Search for a strategy');
        for (const strategy of this.strategies) {
            if (await strategy.canHandle(event)) {
                this.logger.debug('A strategy has been found');
                await strategy.handle(event);
                return;
            }
        }
        this.logger.warn('Strategy not found');
    }

    async update(event: IInputSource): Promise<void> {
        this.logger.debug('Update strategy factory');
        await this.findStrategy(event);
    }

    async subscribe() {
        await this.event.subscribe(this);
    }
}