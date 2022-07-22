import React from 'react';
import { useState } from 'react'

const AsideMenu = ({ children, show }) => {
	const [showing, setShowing] = useState(show)

	if(!showing) return <div onClick={() => setShowing(true)} className='aside-menu'>
		<div className='menu-marker'></div>
		<div className='menu-marker'></div>
		<div className='menu-marker'></div>
	</div>

	return <aside className='aside-menu'>
		<div className='close-menu' onClick={() => setShowing(false)} ></div>
		{children}
	</aside>
};

export default AsideMenu