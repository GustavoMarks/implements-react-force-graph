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
		const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

		ctx.fillStyle = '#222222';
		ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = node.color || '#2373AA';
		ctx.fillText(label, node.x, node.y);

		node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
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
			fx: 10,
			fy: 10,
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
		if (!isRemoving) {
			setIsRemoving(true);
			const backup = { ...graphData };
			setBackupData(backup);

			return toast('Select nodes to remove', { toastId: 'removing-node', autoClose: false, closeButton: false, closeOnClick: false })
		}
	}

	const inactiveRemoving = (cancel = false) => {
		if (cancel) setGraphData(backupData);
		setIsRemoving(false);
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
						nodeCanvasObject={showLabels ? setNodesLabels : null}
						onNodeClick={handleNodeClick}
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
								: <> <button onClick={() => inactiveRemoving(false)} > Salve changes </button>
									<button onClick={() => inactiveRemoving(true)} > cancel </button>
								</>
						}
					</span>
					<span>
						<button onClick={() => setShowModal(true)} > Insert links </button>
						<button onClick={() => setShowModal(true)} > Remove links </button>
					</span>
					<br />
					<button onClick={() => setScope(0)} > Go back </button>

				</header>
			</div>
			<ToastContainer />
		</>
	)

	else return (
		<div className="App">
			<header onMouseLeave={() => setVisibleInput(false)} className="App-header">
				<button onClick={() => setScope(1)} > New empty force graph </button>
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
						placeholder='Node number'
						type='number'
						onChange={(e) => setRandomGraphValue(e.target.value)} />
				}
				<button> Upload json </button>
			</header>
		</div>
	);
}

export default App;
