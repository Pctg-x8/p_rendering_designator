// Application State and Data Models

import * as GPUCommands from "./GPUCommands";
import * as Events from "events";

export const GlobalEvents = new Events.EventEmitter();
export const OpenedTabsChangedEvent = "OpenedTabsChanged";

export enum DataFormatBits
{
	R8G8B8A8, R16G16B16A16, R8, R16, R32, R64, R8G8, R16G16, BC4, BC5
}
export interface DataFormatRepresentation { signed: boolean, normalized: boolean }
export interface DataFormat { bits: DataFormatBits, representation: DataFormatRepresentation }
export interface AttachmentModeOpts { load: "None" | "Load" | "Clear", store_pixels: boolean }

export type NamedContents<T> = { [key: string]: T };
export type NamedContentRef = string;
export interface TabStripData
{
	readonly category: "App" | "RenderPass" | "CommandBlock", readonly name: string;
}
export class OpenedTabs
{
	data: TabStripData[] = [];
	push(data: TabStripData): number
	{
		const ret = this.data.push(data);
		GlobalEvents.emit(OpenedTabsChangedEvent);
		return ret;
	}
}
export class ApplicationState
{
	fileName = "untitled.pdc";
	renderPasses: NamedContents<RenderPassEditData> =
	{
		"RenderPass1": new RenderPassEditData()
	};
	commandBlocks: NamedContents<CommandBlock> = {};
	openedTabs = new OpenedTabs();
	constructor() { this.openedTabs.push({ category: "RenderPass", name: "RenderPass1" }); }
}
export class RenderPassEditData
{
	attachments: NamedContents<RenderPassAttachmentData> = {};
	subpasses: NamedContents<RenderPassSubProcess> = {};
}
export class RenderPassAttachmentData
{
	format: DataFormat;
	mode: AttachmentModeOpts;
	constructor(format: DataFormat, mode: AttachmentModeOpts)
	{
		this.format = format;
		this.mode = mode;
	}
}
export class RenderPassSubProcess
{
	inputAttachments: NamedContentRef[] = [];
	colorWrittenAttachments: NamedContentRef[] = [];

	processCommandBlockRefs: NamedContentRef[] = [];
}

/** Partially set of gpu commands */
export class CommandBlock
{
	drawstates: NamedContents<GPUCommands.DrawState> = {};
	commands: GPUCommands.AnyCommand[] = [];
}
