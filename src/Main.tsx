import { Router, Route, Link, hashHistory, Redirect, RouterState } from "react-router";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TabStrip, TabComponent as Header } from "./Header";
import { NamedContentRef, ApplicationState } from "./AppState";
import RenderPassEditorView from "./RenderPassEditorView";

const AppName = "Rendering Designator[@Postludium]";
export let currentApplicationState = new ApplicationState();

function updateWindowTitle(nextState?: RouterState)
{
	document.title = AppName + " - " + currentApplicationState.fileName + (nextState ? "::" + nextState.params["targetName"] : "");
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
