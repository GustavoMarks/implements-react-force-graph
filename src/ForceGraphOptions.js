import React from 'react';

const ForceGraphOptions = ({ controls }) => {

	const { showLabels, setShowLabels, enableZoom, setEnableZoom, moving, setMoving, nodeDrag, setNodeDrag } = controls;

	return <form>
		<h4> Options: </h4>
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
	</form>
}

export default ForceGraphOptions;