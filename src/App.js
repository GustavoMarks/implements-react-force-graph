import React, { useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './App.css';

function App() {
	const [scope, setScope] = useState(0);
	const [graphData, setGraphData] = useState({});
	const [randomGraphValue, setRandomGraphValue] = useState(null);
	const [visibileInput, setVisibleInput] = useState(false);

	const [enableZoom, setEnableZoom] = useState(false);

	function genRandomTree(N = 10, reverse = false) {
		return {
			nodes: [...Array(N).keys()].map(i => ({ id: i })),
			links: [...Array(N).keys()]
				.filter(id => id)
				.map(id => ({
					[reverse ? 'target' : 'source']: id,
					[reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
					color: '#888888'
				}))
		};
	}

	function newRamdomGraph() {
		setGraphData(randomGraphValue ? genRandomTree(parseInt(randomGraphValue)) : genRandomTree());
		setScope(1);
	}

	if (scope === 1) return (
		<div className="App">
			<header className="App-header">
				<ForceGraph2D
					graphData={graphData}
					linkWidth={3}
					enableZoomInteraction={enableZoom}
					height='700'
				/>

				<section>
					<h4> Options: </h4>
					<form>
						<span>
							<input type='checkbox' onChange={() => setEnableZoom(!enableZoom)} /> <label> Enable zoom </label>
						</span>
						<br />
						<button onClick={() => setScope(0)} > Go back </button>
					</form>
				</section>
			</header>
		</div>
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
