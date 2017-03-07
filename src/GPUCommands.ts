// GPU Commands and Draw States

import { NamedContentRef } from "./AppState";

export interface AnyCommand {}
export interface MultiDispatchable extends AnyCommand {}

export const Draw: AnyCommand = {};
export const DrawIndexed: AnyCommand = {};
export const DrawIndirect: AnyCommand = {};
export const DrawIndexedIndirect: AnyCommand = {};
export const MemoryBarrier: MultiDispatchable = {};
export const CopyBuffer: MultiDispatchable = {};
export const CopyImage: MultiDispatchable = {};
export class UpdateDrawState implements AnyCommand
{
	stateRef: NamedContentRef;
	constructor(state: NamedContentRef) { this.stateRef = state; }
}

type DrawStateObjectRef = string | number | ExternalU32Ref | ExternalF32Ref;
export class ExternalU32Ref { ref: DrawStateObjectRef; constructor(ref: DrawStateObjectRef) { this.ref = ref; } }
export class ExternalF32Ref { ref: DrawStateObjectRef; constructor(ref: DrawStateObjectRef) { this.ref = ref; } }
export class DrawState
{
	pipelineStateRef?: DrawStateObjectRef = null;
	descriptorSetRefs: DrawStateObjectRef[] = [];
	pushConstants: { [key: number]: PushConstantUpdateData } = {};
	vertexBufferRefs: DrawStateObjectRef[] = [];
	indexBufferRef?: DrawStateObjectRef = null;
}
export interface PushConstantUpdateData { value: number | ExternalU32Ref | ExternalF32Ref }
