/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { localize2 } from '../../../../nls.js';
import { CHAT_OPEN_ACTION_ID } from '../../chat/browser/actions/chatActions.js';
import { SUP_CHAT_QUICKFIX_ACTION_ID } from './actionIDs.js';

const CONTEXT_RADIUS_LINES = 20;
const CONTEXT_CHAR_CAP = 4000;

registerAction2(class AskAiQuickFixAction extends Action2 {
	constructor() {
		super({
			id: SUP_CHAT_QUICKFIX_ACTION_ID,
			title: localize2('sup.quickfix.ai', 'Sup: AI QuickFix'),
			f1: false,
			menu: {
				id: MenuId.EditorTitle,
				group: 'navigation',
				order: 100,
				when: ContextKeyExpr.deserialize('editorHasCodeActionsProvider && editorTextFocus')
			},
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(ICodeEditorService);
		const markerService = accessor.get(IMarkerService);
		const commandService = accessor.get(ICommandService);

		const editor = editorService.getActiveCodeEditor();
		if (!editor) {
			return;
		}
		const model = editor.getModel();
		if (!model) {
			return;
		}

		const selection = editor.getSelection();
		const line = selection ? selection.startLineNumber : editor.getPosition()?.lineNumber;
		if (!line) {
			return;
		}

		const startLine = Math.max(1, line - CONTEXT_RADIUS_LINES);
		const endLine = Math.min(model.getLineCount(), line + CONTEXT_RADIUS_LINES);
		let contextText = model.getValueInRange(new Range(startLine, 1, endLine, model.getLineMaxColumn(endLine)));
		if (contextText.length > CONTEXT_CHAR_CAP) {
			contextText = contextText.slice(0, CONTEXT_CHAR_CAP) + '\n...';
		}

		// Collect diagnostics on the target line
		const resource = model.uri;
		const markers = markerService.read({ resource });
		const lineDiagnostics = markers.filter(m => m.startLineNumber <= line && m.endLineNumber >= line);

		let diagnosticsText = '';
		if (lineDiagnostics.length) {
			diagnosticsText = lineDiagnostics.map(m => {
				const rangeText = `[${m.startLineNumber}:${m.startColumn}-${m.endLineNumber}:${m.endColumn}]`;
				return `- ${rangeText} ${m.severity} ${m.message}`;
			}).join('\n');
		}

		const promptParts = [
			'Here is an issue in the code. Suggest a fix and explain why:',
			'',
			'Context:',
			contextText,
		];

		if (diagnosticsText) {
			promptParts.push('', 'Diagnostics:', diagnosticsText);
		}

		const prompt = promptParts.join('\n');

		await commandService.executeCommand(CHAT_OPEN_ACTION_ID, { query: prompt });
	}
});

