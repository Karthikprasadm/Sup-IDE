/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ViewContainerLocation, IViewContainersRegistry, Extensions as ViewContainerExtensions, IViewsRegistry, Extensions as ViewExtensions } from '../../../common/views.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { localize2 } from '../../../../nls.js';
import { ChatViewPane } from '../../chat/browser/chatViewPane.js';
import { ChatAgentLocation } from '../../chat/common/constants.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { SUP_CHAT_TOGGLE_SIDEBAR_ACTION_ID } from './actionIDs.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';

export const SUP_CHAT_VIEW_CONTAINER_ID = 'sup.chatViewContainer';
export const SUP_CHAT_VIEW_ID = 'sup.chatView';

// Register view container (Activity Bar) for Sup AI Chat
const viewContainerRegistry = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry);
const supChatContainer = viewContainerRegistry.registerViewContainer({
	id: SUP_CHAT_VIEW_CONTAINER_ID,
	title: localize2('sup.chat.container.title', 'AI Chat'),
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [SUP_CHAT_VIEW_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	icon: ThemeIcon.fromId(Codicon.commentDiscussion.id),
	order: 2,
	hideIfEmpty: false,
}, ViewContainerLocation.Sidebar, { isDefault: false, doNotRegisterOpenCommand: true });

// Register the Sup Chat view inside the container, reusing the existing ChatViewPane.
const viewsRegistry = Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry);
viewsRegistry.registerViews([{
	id: SUP_CHAT_VIEW_ID,
	name: localize2('sup.chat.view.title', 'AI Chat'),
	ctorDescriptor: new SyncDescriptor(ChatViewPane, [{ location: ChatAgentLocation.Panel }]),
	hideByDefault: false,
	canMoveView: false,
	canToggleVisibility: true,
	order: 1,
}], supChatContainer);

// Command to toggle the AI Chat sidebar visibility.
registerAction2(class SupChatToggleSidebarAction extends Action2 {
	constructor() {
		super({
			id: SUP_CHAT_TOGGLE_SIDEBAR_ACTION_ID,
			title: localize2('sup.chat.toggleSidebar', 'Sup: Toggle AI Chat Sidebar'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);

		const visible = viewsService.isViewContainerVisible(SUP_CHAT_VIEW_CONTAINER_ID);
		if (visible) {
			viewsService.closeViewContainer(SUP_CHAT_VIEW_CONTAINER_ID);
		} else {
			await viewsService.openViewContainer(SUP_CHAT_VIEW_CONTAINER_ID, true);
		}
	}
});

