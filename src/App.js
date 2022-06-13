import React, { useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { ToastContainer, toast } from "react-toastify";
import './App.css';

function App() {
	const [scope, setScope] = useState(0);
	const [graphData, setGraphData] = useState({});
	const [randomGraphValue, setRandomGraphValue] = useState(null);
	const [visibileInput, setVisibleInput] = useState(false);

	const [enableZoom, setEnableZoom] = useState(false);
	const [moving, setMoving] = useState(false);
	const [nodeDrag, setNodeDrag] = useState(false);
	const [showLabels, setShowLabels] = useState(false);

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

	function openNewNodeForm() {
		toast(<NewNodeForm />, { autoClose: false, closeOnClick: false })
	}

	const NewNodeForm = ({ closeToast }) => {
		return <section>
			<h4> New node </h4>
			<form>
				<input placeholder='name' type='text' />
				<input placeholder='value' type='number' />
				<br />
				<label>Color:</label> <input placeholder='color' type='color' />
				<br />
				<button type='button' > Salve </button>
				<button onClick={closeToast} type='button'> Cancel </button>
			</form>
		</section>
	}

	const Options = () => {
		return <section>
			<h4> Options: </h4>
			<form>
				<button onClick={openNewNodeForm} type='button' > New node </button>
				<span>
					<input type='checkbox' onChange={() => setShowLabels(!showLabels)} /> <label> Show labels </label>
				</span>
				<span>
					<input type='checkbox' onChange={() => setEnableZoom(!enableZoom)} /> <label> Enable zoom </label>
				</span>
				<span>
					<input type='checkbox' onChange={() => setMoving(!moving)} /> <label> Enable moving </label>
				</span>
				<span>
					<input type='checkbox' onChange={() => setNodeDrag(!nodeDrag)} /> <label> Enable node drag </label>
				</span>
				<br />
				<button onClick={() => setScope(0)} type='button' > Go back </button>
			</form>
		</section>
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
					/>

					<Options />

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
