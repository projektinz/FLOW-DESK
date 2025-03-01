import React, { useState } from 'react'
import './MessageReaction.css'

const MessageReaction = ({ onReact, reactions }) => {
	const [showReactions, setShowReactions] = useState(false)

	const emojiList = ['❤️', '😂', '👍', '😢', '😮']

	return (
		<div className='reaction-container'>
			<div
				className='reaction-toggle'
				onClick={e => {
					e.stopPropagation()
					setShowReactions(!showReactions)
				}}>
				😊
			</div>
			{showReactions && (
				<div className='reaction-options'>
					{emojiList.map((emoji, index) => (
						<span
							key={index}
							className='reaction-emoji'
							onClick={() => {
								onReact(emoji)
								setShowReactions(false)
							}}>
							{emoji}
						</span>
					))}
				</div>
			)}
			<div className='reaction-display'>
				{reactions &&
					reactions.map((reaction, index) => (
						<span key={index} className='reaction-count'>
							{reaction.emoji} {reaction.count}
						</span>
					))}
			</div>
		</div>
	)
}

export default MessageReaction
