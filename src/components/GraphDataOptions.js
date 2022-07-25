import React, { useState } from 'react';

const GrapDataOptions = ({ controls }) => {
	const [action, setAction] = useState(false);

	const {
		activeRemoving,
		inactiveRemoving,
		activeLinkRemoving,
		activeLinking,
		nodeName, setNodeName, nodeValue, setNodeValue, nodeColor, setNodeColor, addNode,
		nodeToLink, linkName, setLinkName, linkColor, setLinkColor,
	} = controls

	return <>
		<form>
			<h4> Data options: </h4>
			{
				action === 'new_node' &&
				<>
					<h4> New node </h4>
					<input placeholder='name' value={nodeName} onChange={(e) => setNodeName(e.target.value)} />
					<input placeholder='value' type='number' value={nodeValue} onChange={(e) => setNodeValue(e.target.value)} />
					<span>
						<label>Color:</label>
						<input placeholder='color' type='color' value={nodeColor} onChange={(e) => setNodeColor(e.target.value)} />
						<button type='button' onClick={() => { setAction(false); addNode(); }}> Salve </button>
						<button type='button' onClick={() => setAction(false)} > Cancel </button>
					</span>
				</>
			}

			{
				action === 'remove_nodes' &&
				<>
					<h4> Click on node to remove </h4>
					<span>
						<button type='button' onClick={() => { inactiveRemoving(false); setAction(false) }} > Save changes </button>
						<button type='button' onClick={() => { setAction(false); inactiveRemoving(true) }} > cancel </button>
					</span>
				</>
			}

			{
				action === 'linking' &&
				<>
					<h4> Inserting links </h4>
					<span>
						<b> Source: </b>
						{nodeToLink ? nodeToLink.name : '-- (click on a node to select)'}
					</span>
					<input placeholder='link label' value={linkName} onChange={(e) => setLinkName(e.target.value)} />
					<span>
						<label>Color:</label>
						<input placeholder='color' type='color' value={linkColor} onChange={(e) => setLinkColor(e.target.value)} />
						<button type='button' onClick={() => { inactiveRemoving(false); setAction(false) }} > Save changes </button>
						<button type='button' onClick={() => { inactiveRemoving(true); setAction(false) }} > cancel </button>
					</span>
				</>
			}

			{
				action === 'remove_links' &&
				<>
					<h4> Removing links </h4>
					<b> Clik on link to remove </b>
					<span>
						<button type='button' onClick={() => { inactiveRemoving(false); setAction(false) }} > Save changes </button>
						<button type='button' onClick={() => { inactiveRemoving(true); setAction(false) }} > cancel </button>
					</span>
				</>
			}

		</form>
		{
			!action && <>
				<span>
					<button onClick={() => setAction('new_node')} > Insert new node </button>
					<button onClick={() => { setAction('remove_nodes'); activeRemoving() }} > Remove node </button>
				</span>
				<span id="action-btns" >
					<button onClick={() => { setAction('linking'); activeLinking() }} > Insert links </button>
					<button onClick={() => { setAction('remove_links'); activeLinkRemoving() }} > Remove links </button>
				</span>
			</>
		}

		<br />

	</>
};

export default GrapDataOptions;