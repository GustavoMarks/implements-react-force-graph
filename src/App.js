import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import ForceGraph2D from 'react-force-graph-2d';
import Options from './ForceGraphOptions';
import NodeForm from './NodeForm';
import './App.css';

function App() {
	const [scope, setScope] = useState(0);
	const [graphData, setGraphData] = useState({ nodes: [], links: [] });
	const [randomGraphValue, setRandomGraphValue] = useState(null);
	const [visibileInput, setVisibleInput] = useState(false);

	const [enableZoom, setEnableZoom] = useState(false);
	const [moving, setMoving] = useState(false);
	const [nodeDrag, setNodeDrag] = useState(false);
	const [showLabels, setShowLabels] = useState(false);
	const [ticks, setTicks] = useState(100);

	const [showModal, setShowModal] = useState(false);

	const [nodeName, setNodeName] = useState('');
	const [nodeValue, setNodeValue] = useState('');
	const [nodeColor, setNodeColor] = useState('');

	const [backupData, setBackupData] = useState({ nodes: [], links: [] });
	const [isRemoving, setIsRemoving] = useState(false);
	const [isLinkRemoving, setIsLinkRemoving] = useState(false);
	const [isLinking, setIsLinking] = useState(false);
	const [nodeToLink, setNodeToLink] = useState(null);

	function genRandomTree(N = 10, reverse = false) {
		return {
			nodes: [...Array(N).keys()].map(i => ({ id: i, val: 1, name: `node${i}` })),
			links: [...Array(N).keys()]
				.filter(id => id)
				.map(id => ({
					[reverse ? 'target' : 'source']: id,
					[reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
					color: '#888888'
				}))
		};
	}

	function setNodesLabels(node, ctx, globalScale) {
		const label = node.name;
		const fontSize = 12 / globalScale;
		ctx.font = `${fontSize}px Sans-Serif`;
		const textWidth = ctx.measureText(label).width;
		const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

		ctx.fillStyle = node === nodeToLink ? 'red' : '#222222';
		ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = node.color || '#2373AA';
		ctx.fillText(label, node.x, node.y);

		node.__bckgDimensions = bckgDimensions;
	}

	function watchClickedNode(node, ctx) {
		ctx.beginPath();
		ctx.arc(node.x, node.y, 3 * node.val * 1.4, 0, 2 * Math.PI, false);
		if (node === nodeToLink) {
			ctx.arc(node.x, node.y, 4 * node.val * 1.4, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'red';
		}
		else ctx.fillStyle = node.color || '#2373AA';
		ctx.fill();
	}

	function newRamdomGraph() {
		setGraphData(randomGraphValue ? genRandomTree(parseInt(randomGraphValue)) : genRandomTree());
		setScope(1);
	}

	const addNode = () => {
		setTicks(1);
		const node = {
			id: graphData?.nodes?.length,
			val: nodeValue || 1,
			name: nodeName, color: nodeColor,
			fx: 0,
			fy: 40,
		};
		const newGraphData = { ...graphData };
		const nodesList = [...newGraphData.nodes] || [];
		nodesList.push(node);
		newGraphData.nodes = nodesList;

		setGraphData(newGraphData);
		setNodeName('');
		setNodeValue('');
		setNodeColor('');

		setShowModal(false);
	}

	const activeRemoving = () => {
		setTicks(1);
		if (!isRemoving && !isLinkRemoving && !isLinking) {
			setIsRemoving(true);
			const backup = { ...graphData };
			setBackupData(backup);

			return toast('Select nodes to remove', { toastId: 'removing-node', autoClose: false, closeButton: false, closeOnClick: false })
		}
	}

	const inactiveRemoving = (cancel) => {
		console.log(cancel)
		console.log(backupData);
		if (cancel) setGraphData(backupData);
		setIsRemoving(false);
		setIsLinkRemoving(false);
		setIsLinking(false);
		setNodeToLink(null)
		toast.dismiss();
	}

	const removeNode = (node) => {
		const updateNode = graphData.nodes.filter(item => item.id !== node.id);
		const updateLinks = graphData.links.filter(item => item.target?.id !== node.id && item.source?.id !== node.id);

		const dataToUpdate = { ...graphData };
		dataToUpdate.nodes = updateNode;
		dataToUpdate.links = updateLinks;

		setGraphData(dataToUpdate);
	}

	const handleNodeClick = (node) => {
		if (isRemoving) return removeNode(node);
		if (isLinking && !nodeToLink) {
			setNodeToLink(node);
			toast.dismiss('removing-node');
			toast.update('removing-node', { render: 'Select targets' });
			return toast('Select targets', { toastId: 'select-targets', autoClose: false, closeButton: false, closeOnClick: false })
		}

		else if (nodeToLink) {
			const newLink = { source: nodeToLink, target: node, color: '#888888' };
			const updateData = { ...graphData };
			if (!updateData.links.find(item => item === newLink)) {
				const updateLinks = [...updateData.links, newLink];
				const updateNode = [...updateData.nodes];
				updateData.links = updateLinks;
				updateData.nodes = updateNode;
				setGraphData(updateData);
			}
		}
	}

	const activeLinkRemoving = () => {
		setTicks(1);
		if (!isRemoving && !isLinkRemoving && !isLinking) {
			setIsLinkRemoving(true);
			const backup = { ...graphData };
			setBackupData(backup);

			return toast('Select links to remove', { toastId: 'removing-node', autoClose: false, closeButton: false, closeOnClick: false })
		}
	}

	const removeLink = (link) => {
		const updateLinks = graphData.links.filter(item => item !== link);

		const dataToUpdate = { ...graphData };
		dataToUpdate.links = updateLinks;

		setGraphData(dataToUpdate);
	}

	const activeLinking = () => {
		setTicks(1);
		if (!isRemoving && !isLinkRemoving && !isLinking) {
			setIsLinking(true);
			const backup = { ...graphData };
			setBackupData(backup);

			return toast('Select source node', { toastId: 'removing-node', autoClose: false, closeButton: false, closeOnClick: false })
		}
	}

	const handleLinkClick = (link) => {
		if (isLinkRemoving) return removeLink(link);
	}

	if (scope === 1) return (
		<>
			<div className="App">
				<header className="App-header">
					<ForceGraph2D
						graphData={graphData}
						linkWidth={2}
						enableZoomInteraction={enableZoom}
						enablePanInteraction={moving}
						enableNodeDrag={nodeDrag}
						height={500}
						nodeCanvasObject={showLabels ? setNodesLabels : watchClickedNode}
						nodeCanvasObjectMode={node => node === nodeToLink && !showLabels ? 'before' : showLabels ? 'replace' : undefined}
						onNodeClick={handleNodeClick}
						onLinkClick={handleLinkClick}
						cooldownTicks={ticks}
						onNodeDragEnd={node => {
							node.fx = node.x;
							node.fz = node.z;
						}}
					/>

					<Options controls={{ showLabels, setShowLabels, enableZoom, setEnableZoom, moving, setMoving, nodeDrag, setNodeDrag }} />

					<NodeForm
						onSubmit={addNode}
						states={{ showModal, setShowModal, nodeName, setNodeName, nodeValue, setNodeValue, nodeColor, setNodeColor }} />

					<span>
						<button onClick={() => setShowModal(true)} > Insert new node </button>
						{
							!isRemoving ?
								<button onClick={activeRemoving} > Remove node </button>
								: <> <button onClick={() => inactiveRemoving(false)} > Save changes </button>
									<button onClick={() => inactiveRemoving(true)} > cancel </button>
								</>
						}
					</span>
					<span>

						{
							!isLinking ?
								<button onClick={activeLinking} > Insert links on node </button>
								: <>
									<button onClick={() => inactiveRemoving(false)} > Save changes </button>
									<button onClick={() => inactiveRemoving(true)} > cancel </button>
								</>
						}
						{
							!isLinkRemoving ?
								<button onClick={activeLinkRemoving} > Remove links </button>
								: <>
									<button onClick={() => inactiveRemoving(false)} > Save changes </button>
									<button onClick={() => inactiveRemoving(true)} > cancel </button>
								</>
						}

					</span>
					<br />
					<button onClick={() => { setScope(0); setTicks(100) }} > Go back </button>

				</header>
			</div>
			<ToastContainer />
		</>
	)

	else return (
		<div className="App">
			<header onMouseLeave={() => setVisibleInput(false)} className="App-header">
				<button onClick={() => setScope(1)} > Show options </button>
				<button
					onClick={newRamdomGraph}
					onMouseOver={() => setVisibleInput(true)}
				>
					New random force graph
				</button>
				{
					visibileInput &&
					<input
						value={randomGraphValue}
						onMouseOver={() => setVisibleInput(true)}
						placeholder='nodes number'
						type='number'
						onChange={(e) => setRandomGraphValue(e.target.value)} />
				}
			</header>
		</div>
	);
}

export default App;
