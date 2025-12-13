import { useEffect, useState } from 'react';
// @ts-ignore JSX import
import { useAccessor } from '../util/services.js';
import { tokenUsageStore, TokenUsageState } from '../store/tokenUsageStore.js';
import { EventLLMMessageOnUsageParams } from '../../../../common/sendLLMMessageTypes.js';

export function useTokenUsage() {
	const accessor = useAccessor();
	const [usage, setUsage] = useState<TokenUsageState>(tokenUsageStore.get());

	useEffect(() => {
		const disposeStore = tokenUsageStore.subscribe(setUsage);

		const llmMessageService = accessor.get('ILLMMessageService');
		const disposeEvent = llmMessageService.onUsage((e: EventLLMMessageOnUsageParams) => {
			tokenUsageStore.set({
				promptTokens: e.promptTokens ?? 0,
				completionTokens: e.completionTokens ?? 0,
				totalTokens: e.totalTokens ?? 0,
				modelName: e.modelName,
				isLocal: e.isLocal,
			});
		});

		return () => {
			disposeStore?.();
			disposeEvent?.dispose?.();
		};
	}, [accessor]);

	return usage;
}

