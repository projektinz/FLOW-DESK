import React, { useContext, useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, arrayRemove, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
import upload from '../../lib/upload'
import EmojiPicker from 'emoji-picker-react'

const ChatBox = () => {
	const { userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible } = useContext(AppContext)
	const [input, setInput] = useState('')
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [editingMessage, setEditingMessage] = useState(null)
	const [selectedMessage, setSelectedMessage] = useState(null)
	const scrollEnd = useRef()

	const sendMessage = async () => {
		try {
			if (editingMessage) {
				const messageRef = doc(db, 'messages', messagesId)
				const messagesSnap = await getDoc(messageRef)
				const allMessages = messagesSnap.data().messages

				const updatedMessages = allMessages.map(msg =>
					msg.createdAt.seconds === editingMessage.createdAt.seconds ? { ...msg, text: input } : msg
				)

				await updateDoc(messageRef, { messages: updatedMessages })
				setEditingMessage(null)
			} else if (input && messagesId) {
				await updateDoc(doc(db, 'messages', messagesId), {
					messages: arrayUnion({
						sId: userData.id,
						text: input,
						createdAt: new Date(),
					}),
				})
			}
		} catch (error) {
			toast.error(error.message)
		}

		setInput('')
	}

	const deleteMessage = async message => {
		try {
			const messageRef = doc(db, 'messages', messagesId)
			await updateDoc(messageRef, {
				messages: arrayRemove(message),
			})
		} catch (error) {
			toast.error(error.message)
		}
	}

	const sendImage = async e => {
		const fileUrl = await upload(e.target.files[0])

		if (fileUrl && messagesId) {
			await updateDoc(doc(db, 'messages', messagesId), {
				messages: arrayUnion({
					sId: userData.id,
					image: fileUrl,
					createdAt: new Date(),
				}),
			})
		}
	}

	useEffect(() => {
		scrollEnd.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	useEffect(() => {
		if (messagesId) {
			const unSub = onSnapshot(doc(db, 'messages', messagesId), res => {
				setMessages(res.data().messages.reverse())
			})
			return () => {
				unSub()
			}
		}
	}, [messagesId])

	const addEmoji = emoji => {
		setInput(prevInput => prevInput + emoji.emoji)
		setShowEmojiPicker(false)
	}

	return chatUser ? (
		<div className={`chat-box ${chatVisible ? '' : 'hidden'}`}>
			<div className='chat-user'>
				<img src={chatUser ? chatUser.userData.avatar : assets.profile_img} alt='' />
				<p>
					{chatUser ? chatUser.userData.name : 'User'}{' '}
					{Date.now() - chatUser.userData.lastSeen <= 100000 ? (
						<img className='dot' src={assets.green_dot} alt='Aktywny' />
					) : null}
				</p>
				<img onClick={() => setChatVisible(false)} className='arrow' src={assets.arrow_icon} alt='' />
			</div>
			<div className='chat-msg'>
				<div ref={scrollEnd}></div>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={msg.sId === userData.id ? 's-msg' : 'r-msg'}
						onMouseEnter={() => setSelectedMessage(msg)}
						onMouseLeave={() => setSelectedMessage(null)}>
						{msg.image ? <img className='msg-img' src={msg.image} alt='' /> : <p className='msg'>{msg.text}</p>}
						<div>
							<img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt='' />
							<p>{new Date(msg.createdAt.seconds * 1000).toLocaleTimeString()}</p>
						</div>
						{selectedMessage === msg && msg.sId === userData.id && (
							<div className='msg-menu'>
								<img
									src={assets.menu_icon}
									alt='Menu'
									onClick={e => {
										e.stopPropagation()
										setSelectedMessage(null)
									}}
								/>
								<div className='msg-options'>
									<button onClick={() => setEditingMessage(msg)}>Edytuj</button>
									<button onClick={() => deleteMessage(msg)}>Usuń</button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
			<div className={`chat-input ${editingMessage ? 'editing' : ''}`}>
				{editingMessage && (
					<button className='cancel-edit' onClick={() => setEditingMessage(null)}>
						❌
					</button>
				)}
				<input
					type='text'
					placeholder={editingMessage ? 'Edytuj swoją wiadomość' : 'Wyślij wiadomość'}
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && sendMessage()}
				/>
				<input type='file' id='image' hidden onChange={sendImage} />
				<label htmlFor='image'>
					<img src={assets.gallery_icon} alt='Gallery' />
				</label>
				<div className='emoji-picker-wrapper'>
					<img src={assets.emoji_icon} alt='emoji-picker' onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
					{showEmojiPicker && (
						<div className='emoji-picker'>
							<EmojiPicker onEmojiClick={addEmoji} />
						</div>
					)}
				</div>
				<img src={assets.send_button} alt='Send' onClick={sendMessage} />
			</div>
		</div>
	) : (
		<div className='chat-welcome'>
			<p>Wybierz czat, aby rozpocząć wysyłanie wiadomości!</p>
		</div>
	)
}

export default ChatBox
