/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { localize2 } from '../../../../nls.js';
import { SUP_CHAT_ASK_SELECTION_ACTION_ID } from './actionIDs.js';
import { CHAT_OPEN_ACTION_ID } from '../../chat/browser/actions/chatActions.js';
import { Range } from '../../../../editor/common/core/range.js';

registerAction2(class AskAiSelectionAction extends Action2 {
	constructor() {
		super({
			id: SUP_CHAT_ASK_SELECTION_ACTION_ID,
			title: localize2('sup.askAiSelection', 'Ask AI About Selection…'),
			f1: false,
			menu: {
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 100,
				when: ContextKeyExpr.deserialize('editorTextFocus'),
			},
			keybinding: {
				// No default keybinding requested; reserve weight for consistency if added later.
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(ICodeEditorService);
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
		const hasSelection = selection && !selection.isEmpty();

		let text: string | undefined;
		if (hasSelection && selection) {
			text = model.getValueInRange(selection);
		} else {
			const lineNumber = selection ? selection.startLineNumber : editor.getPosition()?.lineNumber;
			if (lineNumber) {
				text = model.getValueInRange(new Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber)));
			}
		}

		if (!text || !text.trim()) {
			return;
		}

		const prompt = `Explain this code: ${text.trim()}`;

		// Reuse existing chat open command to show the chat view and prefill the query.
		await commandService.executeCommand(CHAT_OPEN_ACTION_ID, { query: prompt });
	}
});

