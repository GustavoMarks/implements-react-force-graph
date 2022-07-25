import React from 'react';

const ForceGraphOptions = ({ controls }) => {

	const {
		showLabels,
		setShowLabels,
		enableZoom,
		setEnableZoom,
		moving,
		setMoving,
		nodeDrag,
		setNodeDrag,
		linkLabels,
		setLinkLabel,
		directed,
		setDirected } = controls;

	return <form>
		<h4> Layout options: </h4>
		<label class="container"> Directed graph
			<input type='checkbox' onChange={() => setDirected(!directed)} checked={directed} />
			<span class="checkmark"></span>
		</label>
		<label class="container"> Show node labels
			<input type='checkbox' onChange={() => setShowLabels(!showLabels)} checked={showLabels} />
			<span class="checkmark"></span>
		</label>
		<label class="container"> Show link labels
			<input type='checkbox' onChange={() => setLinkLabel(!linkLabels)} checked={linkLabels} />
			<span class="checkmark"></span>
		</label>
		<label class="container"> Enable zoom
			<input type='checkbox' onChange={() => setEnableZoom(!enableZoom)} checked={enableZoom} />
			<span class="checkmark"></span>
		</label>
		<label class="container">  Enable moving
			<input type='checkbox' onChange={() => setMoving(!moving)} checked={moving} />
			<span class="checkmark"></span>
		</label>
		<label class="container"> Enable node drag
			<input type='checkbox' onChange={() => setNodeDrag(!nodeDrag)} checked={nodeDrag} />
			<span class="checkmark"></span>
		</label>

		<br />
	</form>
}

export default ForceGraphOptions;