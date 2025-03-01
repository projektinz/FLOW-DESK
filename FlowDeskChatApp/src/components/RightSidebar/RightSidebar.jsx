import React, { useContext, useEffect, useState } from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

const RightSidebar = () => {
	const { chatUser, messages } = useContext(AppContext)
	const [msgImages, setMsgImages] = useState([])

	useEffect(() => {
		const tempVar = messages.filter(msg => msg.image).map(msg => msg.image)
		setMsgImages(tempVar)
	}, [messages])

	const formatLastSeen = lastSeen => {
		const timeDifference = Date.now() - lastSeen
		if (timeDifference < 100000) return <span>Aktywny</span>

		const lastSeenDate = new Date(lastSeen)
		const today = new Date()

		if (
			lastSeenDate.getDate() === today.getDate() &&
			lastSeenDate.getMonth() === today.getMonth() &&
			lastSeenDate.getFullYear() === today.getFullYear()
		) {
			// Wyświetl godzinę dla dzisiejszej daty
			return `Widziano dziś o ${lastSeenDate.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			})}`
		}

		return `Widziano ${lastSeenDate.toLocaleDateString()} o ${lastSeenDate.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})}`
	}

	return chatUser ? (
		<div className='rs'>
			<div className='rs-profile'>
				<img src={chatUser.userData.avatar} alt='' />
				<h3>
					{Date.now() - chatUser.userData.lastSeen <= 100000 ? (
						<img className='dot' src={assets.green_dot} alt='' />
					) : null}
					{chatUser.userData.name}
				</h3>
				<p>{chatUser.userData.bio}</p>
			</div>
			<hr />
			<div className='rs-activity'>
				<p>Ostatnia aktywność</p>
				<div>
					<p>{formatLastSeen(chatUser.userData.lastSeen)}</p>
				</div>
			</div>
			<hr />
			<div className='rs-media'>
				<p>Media</p>
				<div>
					{msgImages.map((url, index) => (
						<img onClick={() => window.open(url)} key={index} src={url} alt='' />
					))}
				</div>
			</div>
			<button onClick={() => logout()}>Wyloguj</button>
		</div>
	) : (
		<div className='rs'>
			<button onClick={() => logout()}>Wyloguj</button>
		</div>
	)
}

export default RightSidebar
