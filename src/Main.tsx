import { Router, Route, Link, hashHistory, Redirect, RouterState } from "react-router";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TabStrip, TabComponent as Header } from "./Header";
import { NamedContentRef, ApplicationState } from "./AppState";

const AppName = "Rendering Designator[@Postludium]";
export let currentApplicationState = new ApplicationState();

function updateWindowTitle(nextState?: RouterState)
{
	document.title = AppName + " - " + currentApplicationState.fileName + (nextState ? "::" + nextState.params["targetName"] : "");
}

class VertLineDesc
{
	readonly x: number; readonly top: number; readonly bottom: number; readonly isArrow: boolean

	constructor(x: number, t: number, b: number, arrow: boolean)
	{
		this.x = x; this.top = t; this.bottom = b; this.isArrow = arrow;
	}
}
interface RenderPassEditorLineState { lines: VertLineDesc[], width: number, height: number }
class RenderPassEditorLines extends React.Component<{}, RenderPassEditorLineState>
{
	constructor()
	{
		super();
		this.state = { lines: [], width: 0, height: 0 };
	}
	render()
	{
		return <svg height={this.state.height}>
			<g stroke="black">{this.state.lines.map(ld => !ld.isArrow
				? <line x1={ld.x} y1={ld.top} x2={ld.x} y2={ld.bottom} />
				: <g>
					<line x1={ld.x} y1={ld.top} x2={ld.x} y2={ld.bottom} />
					<line x1={ld.x - 5.0} y1={ld.bottom - 8.0} x2={ld.x} y2={ld.bottom} />
					<line x1={ld.x + 5.0} y1={ld.bottom - 8.0} x2={ld.x} y2={ld.bottom} />
				</g>)}</g>
		</svg>;
	}
}
interface RenderPassEditorParams { targetName: NamedContentRef }
class RenderPassEditorView extends React.Component<{ params: RenderPassEditorParams }, {}>
{
	componentDidMount()
	{
		window.addEventListener("resize", () => this.updateNodeConnectionsVisual());
		this.updateNodeConnectionsVisual();
	}
	componentWillUnmount()
	{
		window.removeEventListener("resize", () => this.updateNodeConnectionsVisual());
	}
	private updateNodeConnectionsVisual()
	{
		let nodes = ReactDOM.findDOMNode<HTMLDivElement>(this.refs["container"]);
		let container_top = nodes.getBoundingClientRect().top;
		let height_offset = (nodes.childNodes[0].childNodes[0] as HTMLDivElement).getBoundingClientRect().top - container_top;
		let noderows = nodes.getElementsByClassName("AttachmentRow");
		let lines = [];
		for(var i = 0; i < noderows.length; i++)
		{
			for(var k = 0; k < noderows[i].childNodes.length; k++)
			{
				let node = noderows[i].childNodes[k] as HTMLDivElement;
				let noderect = node.getBoundingClientRect();
				let noderect_local_top = noderect.top - container_top;
				let noderect_local_bottom = noderect.bottom - container_top;
				lines.push(new VertLineDesc(noderect.left + noderect.width / 2.0, noderect_local_top - height_offset, noderect_local_top, true));
				lines.push(new VertLineDesc(noderect.left + noderect.width / 2.0, noderect_local_bottom, noderect_local_bottom + height_offset, false));
				// console.log("Attachment Node Location: ", noderect);
			}
		}
		let processes = nodes.getElementsByClassName("ProcessRow");
		for(var i = 0; i < processes.length; i++)
		{
			let process = processes[i] as HTMLDivElement;
			let noderect = process.getBoundingClientRect();
			let noderect_local_top = noderect.top - container_top;
			let noderect_local_bottom = noderect.bottom - container_top;
			lines.push(new VertLineDesc(noderect.left + noderect.width / 2.0, noderect_local_top - height_offset, noderect_local_top, true));
			lines.push(new VertLineDesc(noderect.left + noderect.width / 2.0, noderect_local_bottom, noderect_local_bottom + height_offset, false));
		}
		let nodes_bbox = nodes.getBoundingClientRect();
		(this.refs["canvas"] as RenderPassEditorLines).setState({
			width: nodes_bbox.width, height: nodes_bbox.height, lines: lines
		});
	}
	render()
	{
		return <div id="RenderPassEditor">
			<div id="NodeContainer" ref="container">
				<div className="AttachmentRow">
					<div className="Attachment">Attachment1</div>
				</div>
				<div className="ProcessRow"><ul>
					<li>CommandBlock1</li>
					<li>CommandBlock2</li>
				</ul></div>
				<div className="AttachmentRow">
					<div className="Attachment">Attachment2</div>
					<div className="Attachment">Attachment3</div>
				</div>
			</div>
			<RenderPassEditorLines ref="canvas" />
		</div>;
	}
}
interface CommandBlockEditorParams { targetName: NamedContentRef }
class CommandBlockEditorView extends React.Component<{ params: CommandBlockEditorParams }, {}>
{
	render()
	{
		return <h2>CommandBlockEditor - {this.props.params.targetName}</h2>;
	}
}
class NotFoundHandler extends React.Component<{ location: string }, {}>
{
	render() { return <div><h2>404 Not Found - {this.props.location}</h2><a href="javascript:window.history.back(-1);">back</a></div>; }
}
updateWindowTitle(null);
ReactDOM.render((
	<Router history={hashHistory}>
		<Redirect from="/EntryRedirect" to="/RenderPass/RenderPass1" />
		<Route path="/" component={Header}>
			<Route path="RenderPass/:targetName" component={RenderPassEditorView} onEnter={updateWindowTitle} />
			<Route path="CommandBlock/:targetName" component={CommandBlockEditorView} onEnter={updateWindowTitle} />
			<Route path="*" component={NotFoundHandler} />
		</Route>
		<Route path="*" component={NotFoundHandler} />
	</Router>
), document.getElementById("app"));
