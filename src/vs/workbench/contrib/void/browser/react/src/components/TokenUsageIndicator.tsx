import React from 'react';
import { useTokenUsage } from '../hooks/useTokenUsage.js';
import { useTokenUsageSetting } from '../hooks/useTokenUsageSetting.js';

export const TokenUsageIndicator: React.FC = () => {
	const usage = useTokenUsage();
	const { enabled } = useTokenUsageSetting();

	if (!enabled) return null;

	const total = usage.totalTokens ?? 0;
	const prompt = usage.promptTokens ?? 0;
	const completion = usage.completionTokens ?? 0;

	const title = `Prompt: ${prompt.toLocaleString()} • Completion: ${completion.toLocaleString()}`;

	return (
		<div
			className="flex items-center gap-1 text-void-fg-3 text-xs px-2 py-1 rounded bg-void-bg-3 border border-zinc-300/10"
			title={title}
		>
			<span className="opacity-80">Tokens:</span>
			<span className="font-medium">{total.toLocaleString()}</span>
		</div>
	);
};

