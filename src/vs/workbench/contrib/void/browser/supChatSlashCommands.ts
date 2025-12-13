/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Range } from '../../../../editor/common/core/range.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IChatSlashCommandService } from '../../chat/common/chatSlashCommands.js';
import { ChatAgentLocation } from '../../chat/common/constants.js';
import { CHAT_OPEN_ACTION_ID } from '../../chat/browser/actions/chatActions.js';
import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { localize2 } from '../../../../nls.js';
import { SUP_CHAT_EXPLAIN_ACTION_ID, SUP_CHAT_FIX_ACTION_ID, SUP_CHAT_OPTIMIZE_ACTION_ID } from './actionIDs.js';

const CONTEXT_RADIUS_LINES = 20;
const CONTEXT_CHAR_CAP = 4000;

type PromptKind = 'explain' | 'fix' | 'optimize';

function buildPrompt(kind: PromptKind, code: string, diagnostics?: string): string {
	const headers: Record<PromptKind, string> = {
		explain: 'Explain this code:',
		fix: 'Fix this code and explain the changes:',
		optimize: 'Optimize this code for performance and readability, and explain:',
	};
	const parts = [
		headers[kind],
		code,
	];
	if (diagnostics) {
		parts.push('', 'Diagnostics:', diagnostics);
	}
	return parts.join('\n');
}

function gatherContext(accessor: ServicesAccessor) {
	const editorService = accessor.get(ICodeEditorService);
	const markerService = accessor.get(IMarkerService);

	const editor = editorService.getActiveCodeEditor();
	if (!editor) {
		return undefined;
	}
	const model = editor.getModel();
	if (!model) {
		return undefined;
	}

	const selection = editor.getSelection();
	const line = selection ? selection.startLineNumber : editor.getPosition()?.lineNumber;
	if (!line) {
		return undefined;
	}

	const range = selection && !selection.isEmpty()
		? selection
		: new Range(line, 1, line, model.getLineMaxColumn(line));

	let code = model.getValueInRange(range);

	// Surrounding context
	const startLine = Math.max(1, range.startLineNumber - CONTEXT_RADIUS_LINES);
	const endLine = Math.min(model.getLineCount(), range.endLineNumber + CONTEXT_RADIUS_LINES);
	let contextBlock = model.getValueInRange(new Range(startLine, 1, endLine, model.getLineMaxColumn(endLine)));
	if (contextBlock.length > CONTEXT_CHAR_CAP) {
		contextBlock = contextBlock.slice(0, CONTEXT_CHAR_CAP) + '\n...';
	}

	// Diagnostics on selection lines
	const markers = markerService.read({ resource: model.uri });
	const lineDiagnostics = markers.filter(m =>
		m.startLineNumber <= range.endLineNumber && m.endLineNumber >= range.startLineNumber);
	const diagnosticsText = lineDiagnostics.length
		? lineDiagnostics.map(m => {
			const loc = `[${m.startLineNumber}:${m.startColumn}-${m.endLineNumber}:${m.endColumn}]`;
			return `- ${loc} ${m.severity} ${m.message}`;
		}).join('\n')
		: '';

	if (contextBlock && contextBlock !== code) {
		code = `${code}\n\nContext:\n${contextBlock}`;
	}

	return { promptContext: code.trim(), diagnosticsText };
}

async function runChatCommand(accessor: ServicesAccessor, kind: PromptKind) {
	const commandService = accessor.get(ICommandService);
	const context = gatherContext(accessor);
	if (!context) {
		return;
	}
	const prompt = buildPrompt(kind, context.promptContext, context.diagnosticsText);
	await commandService.executeCommand(CHAT_OPEN_ACTION_ID, { query: prompt });
}

// Register slash commands for the chat input suggest UI and execution.
function registerSlashCommands(accessor: ServicesAccessor) {
	const slashService = accessor.get(IChatSlashCommandService);
	const commands: Array<{ id: PromptKind; title: string; detail: string }> = [
		{ id: 'explain', title: 'Explain Code', detail: 'Explain the selected code or current line.' },
		{ id: 'fix', title: 'Fix Code', detail: 'Fix issues in the selected code using AI.' },
		{ id: 'optimize', title: 'Optimize Code', detail: 'Optimize code for performance/readability.' },
	];

	for (const cmd of commands) {
		if (slashService.hasCommand(cmd.id)) {
			continue;
		}
		slashService.registerSlashCommand({
			command: cmd.id,
			detail: cmd.detail,
			locations: [ChatAgentLocation.Panel, ChatAgentLocation.EditingSession],
			sortText: cmd.id,
			executeImmediately: false,
		}, async (prompt, _progress, _history, _location, _token) => {
			// Defer to the corresponding Sup chat command to gather editor context and open chat.
			const idMap: Record<PromptKind, string> = {
				explain: SUP_CHAT_EXPLAIN_ACTION_ID,
				fix: SUP_CHAT_FIX_ACTION_ID,
				optimize: SUP_CHAT_OPTIMIZE_ACTION_ID,
			};
			await accessor.get(ICommandService).executeCommand(idMap[cmd.id], prompt);
			return;
		});
	}
}

// Concrete command registrations (callable from palette or programmatically)
registerAction2(class SupChatExplainAction extends Action2 {
	constructor() {
		super({
			id: SUP_CHAT_EXPLAIN_ACTION_ID,
			title: localize2('sup.chat.explain', 'Sup: Explain Code'),
			f1: true,
			keybinding: { weight: KeybindingWeight.WorkbenchContrib }
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		await runChatCommand(accessor, 'explain');
	}
});

registerAction2(class SupChatFixAction extends Action2 {
	constructor() {
		super({
			id: SUP_CHAT_FIX_ACTION_ID,
			title: localize2('sup.chat.fix', 'Sup: Fix Code'),
			f1: true,
			keybinding: { weight: KeybindingWeight.WorkbenchContrib }
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		await runChatCommand(accessor, 'fix');
	}
});

registerAction2(class SupChatOptimizeAction extends Action2 {
	constructor() {
		super({
			id: SUP_CHAT_OPTIMIZE_ACTION_ID,
			title: localize2('sup.chat.optimize', 'Sup: Optimize Code'),
			f1: true,
			keybinding: { weight: KeybindingWeight.WorkbenchContrib }
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		await runChatCommand(accessor, 'optimize');
	}
});

// Workbench contribution to register slash commands after services are ready.
registerAction2(class SupChatSlashCommandsContribution extends Action2 {
	constructor() {
		super({
			id: 'sup.chat.registerSlashCommands',
			title: localize2('sup.chat.registerSlashCommands', 'Sup: Register Slash Commands'),
			f1: false,
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		registerSlashCommands(accessor);
	}
});

