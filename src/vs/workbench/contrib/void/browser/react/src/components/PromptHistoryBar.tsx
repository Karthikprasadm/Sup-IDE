import React, { useMemo } from 'react';
import { useChatThreadsState } from '../util/services.js';
import { usePromptHistorySetting } from '../hooks/usePromptHistorySetting.js';

type Props = {
	onSelectPrompt: (text: string) => void;
	onNewThread: () => void;
};

export const PromptHistoryBar: React.FC<Props> = ({ onSelectPrompt, onNewThread }) => {
	const { enabled } = usePromptHistorySetting();
	const chatThreadsState = useChatThreadsState();
	const currentThread = chatThreadsState.allThreads[chatThreadsState.currentThreadId];

	const prompts = useMemo(() => {
		if (!currentThread) return [];
		return currentThread.messages
			.filter(m => m.role === 'user' && typeof m.content === 'string')
			.map(m => (m.content as string).trim())
			.filter(Boolean);
	}, [currentThread]);

	if (!enabled || !currentThread || prompts.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-2 w-full px-2 py-1 text-xs text-void-fg-3">
			<div className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap flex-1">
				{prompts.map((p, idx) => (
					<button
						key={idx}
						type="button"
						className="px-2 py-1 rounded bg-void-bg-3 border border-zinc-300/10 hover:border-zinc-300/25 hover:brightness-110 transition text-left"
						onClick={() => onSelectPrompt(p)}
						title={p.length > 160 ? p.slice(0, 160) + '…' : p}
					>
						<span className="line-clamp-1">{p}</span>
					</button>
				))}
			</div>
			<button
				type="button"
				className="px-2 py-1 rounded bg-void-bg-3 border border-zinc-300/10 hover:border-zinc-300/25 hover:brightness-110 transition"
				title="Start new chat"
				onClick={onNewThread}
			>
				+
			</button>
		</div>
	);
};

