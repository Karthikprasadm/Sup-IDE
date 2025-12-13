/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { localize2 } from '../../../../nls.js';
import { VOID_AI_COMMAND_PALETTE_ACTION_ID } from './actionIDs.js';

// AI Command Palette: opens the command palette (with AI-related suggestions built-in),
// bound to Ctrl/Cmd+K globally.
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: VOID_AI_COMMAND_PALETTE_ACTION_ID,
			f1: true,
			title: localize2('voidAiCommandPalette', 'Sup: AI Command Palette'),
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyCode.KeyK,
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.deserialize('!terminalFocus'),
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		// Open the standard commands quick access (AI suggestions are provided by the provider itself).
		quickInputService.quickAccess.show('>');
	}
});

