// Header Components

import * as React from "react";
import { hashHistory, Link } from "react-router";
import { TabStripData, OpenedTabs, GlobalEvents, OpenedTabsChangedEvent } from "./AppState";
import { currentApplicationState } from "./Main";

function tabstrip_linkto(tsd: TabStripData): string
{
	if(tsd.category == "App") return "/" + tsd.name;
	else return "/" + tsd.category + "/" + tsd.name;
}
export interface TabStripProperties extends React.Props<TabStrip> { data: TabStripData }
export class TabStrip extends React.Component<TabStripProperties, {}>
{
	private styleClassName(): string { if(tabstrip_linkto(this.props.data) === hashHistory.getCurrentLocation().pathname) return "active"; else return "inactive"; }
	render() { return <li className={this.styleClassName()}><Link to={tabstrip_linkto(this.props.data)}>{this.props.data.name}</Link></li>; }
}

export class TabComponent extends React.Component<{}, OpenedTabs>
{
	constructor()
	{
		super();
		this.state = currentApplicationState.openedTabs;
		GlobalEvents.addListener(OpenedTabsChangedEvent, function()
		{
			this.setState(currentApplicationState.openedTabs);
		});
	}
	render()
	{
		return (
			<div>
				<header><ul>{this.state.data.map(x => <TabStrip data={x} />)}</ul></header>
				<div id="content">{this.props.children}</div>
			</div>
		);
	}
}
