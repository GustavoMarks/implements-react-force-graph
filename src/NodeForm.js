import React from 'react';
import Modal from 'react-modal'

const NodeForm = ({ states, onSubmit }) => {

	const { showModal, setShowModal, nodeName, setNodeName, nodeValue, setNodeValue, nodeColor, setNodeColor } = states

	return <Modal isOpen={showModal} style={{ content: { bottom: '50%', left: '50%' } }} >
		<h4> New node </h4>
		<input placeholder='name' type='text' value={nodeName} onChange={(e) => setNodeName(e.target.value)} />
		<br />
		<input placeholder='value' type='number' value={nodeValue} onChange={(e) => setNodeValue(e.target.value)} />
		<br />
		<label>Color:</label> <input placeholder='color' type='color' value={nodeColor} onChange={(e) => setNodeColor(e.target.value)} />
		<br />
		<button type='button' onClick={() => onSubmit()} > Salve </button>
		<button onClick={() => setShowModal(false)} type='button'> Cancel </button>
	</Modal>

}

export default NodeForm