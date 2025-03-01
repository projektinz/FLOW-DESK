import { initializeApp } from 'firebase/app'
import {
	createUserWithEmailAndPassword,
	getAuth,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	deleteUser,
	EmailAuthProvider,
	reauthenticateWithCredential,
} from 'firebase/auth'
import {
	collection,
	doc,
	getDocs,
	getFirestore,
	query,
	setDoc,
	where,
	updateDoc,
	deleteDoc,
	getDoc,
} from 'firebase/firestore'
import { toast } from 'react-toastify'

//  Konfiguracja Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyDu7AA5RI9Ei9B4H0vPWex97-gyuQ3xWrw',
	authDomain: 'flow-desk-4a841.firebaseapp.com',
	projectId: 'flow-desk-4a841',
	storageBucket: 'flow-desk-4a841.firebasestorage.app',
	messagingSenderId: '300392971003',
	appId: '1:300392971003:web:93148fdf54e8aea91b8e5e',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validatePassword = password => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)

const signup = async (username, email, password, termsAccepted) => {
	if (!termsAccepted) {
		toast.error('Musisz zaakceptować regulamin, aby utworzyć konto.')
		return
	}

	if (!validatePassword(password)) {
		toast.error('Hasło musi zawierać co najmniej 8 znaków, wielką literę, cyfrę i znak specjalny.')
		return
	}

	try {
		const usersRef = collection(db, 'users')
		const q = query(usersRef, where('username', '==', username.toLowerCase()))
		const querySnapshot = await getDocs(q)

		if (querySnapshot.docs.length > 0) {
			toast.error('Nazwa użytkownika jest już zajęta')
			return
		}

		const res = await createUserWithEmailAndPassword(auth, email, password)
		const user = res.user

		await setDoc(doc(db, 'users', user.uid), {
			id: user.uid,
			username: username.toLowerCase(),
			email,
			name: '',
			avatar: '',
			bio: 'Cześć, używam aplikacji czatu',
			lastSeen: Date.now(),
			deleteAt: null,
		})

		await setDoc(doc(db, 'chats', user.uid), {
			chatsData: [],
		})
	} catch (error) {
		console.error(error)
		toast.error(error.code.split('/')[1].split('-').join(' '))
	}
}

const login = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password)
		toast.success('Zalogowano pomyślnie')
		await checkAccountDeletionStatus(auth.currentUser.uid)
	} catch (error) {
		console.error(error)
		switch (error.code) {
			case 'auth/user-not-found':
				toast.error('Użytkownik o podanym adresie e-mail nie istnieje')
				break
			case 'auth/wrong-password':
				toast.error('Nieprawidłowe hasło')
				break
			case 'auth/invalid-email':
				toast.error('Podano niepoprawny format adresu e-mail')
				break
			case 'auth/invalid-credential':
				toast.error('Podano nieprawidłowe dane logowania')
				break
			case 'auth/too-many-requests':
				toast.error('Zbyt wiele prób logowania. Spróbuj ponownie później.')
				break
			default:
				toast.error(`Wystąpił błąd: ${error.message}`)
		}
	}
}

const logout = () => signOut(auth)

const resetPass = async email => {
	if (!email) {
		toast.error('Wprowadź swój adres e-mail')
		return null
	}

	if (!validateEmail(email)) {
		toast.error('Podaj poprawny adres e-mail')
		return null
	}

	try {
		const userRef = collection(db, 'users')
		const q = query(userRef, where('email', '==', email))
		const querySnap = await getDocs(q)

		if (!querySnap.empty) {
			await sendPasswordResetEmail(auth, email)
			toast.success('E-mail resetujący został wysłany')
		} else {
			toast.error('Podany adres e-mail nie istnieje w naszej bazie danych')
		}
	} catch (error) {
		console.error(error)
		toast.error('Wystąpił błąd podczas wysyłania e-maila resetującego')
	}
}

const markUserForDeletion = async () => {
	try {
		const user = auth.currentUser
		if (!user) {
			toast.error('Brak zalogowanego użytkownika.')
			return
		}
		//	usuwanie konta, permametnie po 7 dniach
		const deleteAt = new Date()
		deleteAt.setDate(deleteAt.getDate() + 7) /
			(await updateDoc(doc(db, 'users', user.uid), {
				deleteAt: deleteAt.toISOString(),
			}))

		toast.info('Twoje konto zostanie usunięte za 7 dni. Zaloguj się ponownie w tym czasie, aby anulować.')
		await signOut(auth)
	} catch (error) {
		console.error(error)
		toast.error('Wystąpił błąd podczas oznaczania konta do usunięcia.')
	}
}

const checkAccountDeletionStatus = async userId => {
	try {
		const userDoc = await getDoc(doc(db, 'users', userId))
		if (userDoc.exists()) {
			const userData = userDoc.data()
			if (userData.deleteAt) {
				const deleteDate = new Date(userData.deleteAt)
				if (deleteDate > new Date()) {
					await updateDoc(doc(db, 'users', userId), { deleteAt: null })
					toast.success('Usunięcie konta zostało anulowane.')
				} else {
					await deleteUser(auth.currentUser)
					await deleteUserData(userId)
					toast.success('Konto zostało trwale usunięte.')
				}
			}
		}
	} catch (error) {
		console.error(error)
		toast.error('Wystąpił błąd podczas sprawdzania statusu konta.')
	}
}

const deleteUserData = async userId => {
	try {
		await deleteDoc(doc(db, 'users', userId))

		const messagesRef = collection(db, 'messages')
		const querySnapshot = await getDocs(messagesRef)

		querySnapshot.forEach(async msgDoc => {
			const msgData = msgDoc.data()
			if (msgData.senderId === userId) {
				await updateDoc(doc(db, 'messages', msgDoc.id), {
					senderId: null,
					senderName: 'Użytkownik usunięty',
				})
			}
		})
	} catch (error) {
		console.error(error)
		toast.error('Wystąpił błąd podczas usuwania danych użytkownika.')
	}
}

export { auth, db, login, signup, logout, resetPass, markUserForDeletion, checkAccountDeletionStatus }
