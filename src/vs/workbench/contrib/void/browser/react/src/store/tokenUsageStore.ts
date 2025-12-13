import { EventEmitter } from 'events';

export type TokenUsageState = {
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
	modelName?: string;
	isLocal?: boolean;
};

const defaultState: TokenUsageState = {
	promptTokens: 0,
	completionTokens: 0,
	totalTokens: 0,
	modelName: undefined,
	isLocal: undefined,
};

let state: TokenUsageState = defaultState;
const emitter = new EventEmitter();
const EVENT = 'usage';

export const tokenUsageStore = {
	get: () => state,
	set: (next: TokenUsageState) => {
		state = next;
		emitter.emit(EVENT, state);
	},
	subscribe: (listener: (s: TokenUsageState) => void) => {
		emitter.on(EVENT, listener);
		return () => emitter.off(EVENT, listener);
	}
};

