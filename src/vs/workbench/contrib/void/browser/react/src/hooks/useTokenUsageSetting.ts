import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sup_token_usage_indicator_enabled';

const readEnabled = (): boolean => {
	if (typeof window === 'undefined') return true;
	const raw = window.localStorage.getItem(STORAGE_KEY);
	if (raw === null) return true;
	return raw === 'true';
};

export function useTokenUsageSetting() {
	const [enabled, setEnabled] = useState<boolean>(readEnabled());

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
	}, [enabled]);

	return {
		enabled,
		setEnabled,
	};
}

