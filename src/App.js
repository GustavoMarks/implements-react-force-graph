import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './App.css';

function App() {
	// const [scope, setScope] = useState(0);
	const [teste, setTeste] = useState(false);

	function genRandomTree(N = 10, reverse = false) {
		return {
			nodes: [...Array(N).keys()].map(i => ({ id: i })),
			links: [...Array(N).keys()]
				.filter(id => id)
				.map(id => ({
					[reverse ? 'target' : 'source']: id,
					[reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
				}))
		};
	}

	useEffect(() => {
		if (!teste) setTeste(true);
	}, [teste])

	return (
		<div className="App">
			<header className="App-header">
				<ForceGraph2D
					graphData={genRandomTree()}
					linkWidth={5}
					linkColor='#ffffff'
				/>
			</header>
		</div>
	)


	// else return (
	// 	<div className="App">
	// 		<header className="App-header">
	// 			<button onClick={() => setScope(1)} > New force graph </button>
	// 			<button> Upload json </button>
	// 		</header>
	// 	</div>
	// );
}

export default App;
