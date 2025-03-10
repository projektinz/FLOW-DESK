import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db, markUserForDeletion } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import upload from '../../lib/upload'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const ProfileUpdate = () => {
	const [image, setImage] = useState(false)
	const [name, setName] = useState('')
	const [bio, setBio] = useState('')
	const [uid, setUid] = useState('')
	const navigate = useNavigate()
	const [prevImage, setPrevImage] = useState('')
	const { setUserData } = useContext(AppContext)

	const profileUpdate = async event => {
		event.preventDefault()
		try {
			if (!prevImage && !image) {
				toast.error('Prześlij zdjęcie profilowe')
				return 0
			}
			const docRef = doc(db, 'users', uid)
			if (image) {
				const imgUrl = await upload(image)
				setPrevImage(imgUrl)
				await updateDoc(docRef, {
					avatar: imgUrl,
					bio: bio,
					name: name,
				})
			} else {
				await updateDoc(docRef, {
					bio: bio,
					name: name,
				})
			}
			const snap = await getDoc(docRef)
			setUserData(snap.data())
			navigate('/chat')
		} catch (error) {
			console.error(error)
			toast.error(error.message)
		}
	}

	const handleDeleteAccount = async () => {
		if (window.confirm('⚠️ Czy na pewno chcesz usunąć konto? Będzie ono trwale usunięte za 7 dni!')) {
			await markUserForDeletion()
			navigate('/') // Po oznaczeniu do usunięcia - wyloguj i przenieś do strony głównej
		}
	}

	useEffect(() => {
		onAuthStateChanged(auth, async user => {
			if (user) {
				setUid(user.uid)
				const docRef = doc(db, 'users', user.uid)
				const docSnap = await getDoc(docRef)
				if (docSnap.data().name) setName(docSnap.data().name)
				if (docSnap.data().bio) setBio(docSnap.data().bio)
				if (docSnap.data().avatar) setPrevImage(docSnap.data().avatar)
			} else {
				navigate('/')
			}
		})
	}, [])

	return (
		<div className='profile'>
			<div className='profile-container'>
				<form onSubmit={profileUpdate}>
					<h3>Szczegóły profilu</h3>
					<label htmlFor='avatar'>
						<input
							onChange={e => setImage(e.target.files[0])}
							id='avatar'
							type='file'
							accept='.png, .jpg, .jpeg'
							hidden
						/>
						<img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt='' />
						Prześlij zdjęcie profilowe
					</label>
					<input onChange={e => setName(e.target.value)} value={name} placeholder='Your name' type='text' required />
					<textarea onChange={e => setBio(e.target.value)} value={bio} placeholder='Write profile bio' required />
					<button type='submit'> Zapisz</button>
					{/*  Dodany przycisk do usuwania konta */}
					<button className='delete-account-btn' type='button' onClick={handleDeleteAccount}>
						Usuń konto
					</button>
				</form>

				<img
					className='profile-pic'
					src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon}
					alt=''
				/>
			</div>
		</div>
	)
}

export default ProfileUpdate
