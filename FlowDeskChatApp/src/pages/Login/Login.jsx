import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup, login, resetPass } from '../../config/firebase'

const Login = () => {
	const [currState, setCurrState] = useState('Zarejestruj się')
	const [userName, setUserName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [darkMode, setDarkMode] = useState(false)
	const [showTerms, setShowTerms] = useState(false)
	const [termsAccepted, setTermsAccepted] = useState(false)

	const toggleDarkMode = () => setDarkMode(!darkMode)
	const toggleTerms = e => {
		e.preventDefault()
		setShowTerms(!showTerms)
	}
	const switchState = state => {
		setCurrState(state)
		setShowTerms(false)
	}

	const onSubmitHandler = event => {
		event.preventDefault()
		setError('')
		if (currState === 'Zarejestruj się') {
			if (password !== confirmPassword) {
				setError('Hasła nie są zgodne!')
				return
			}
			signup(userName, email, password, termsAccepted)
		} else {
			login(email, password)
		}
	}

	return (
		<div className={`login ${darkMode ? 'dark' : 'light'}`}>
			<img className='logo' src={assets.logo_big1} alt='Logo' />
			<div className='dark-mode-toggle-container' onClick={toggleDarkMode}>
				<span className='icon-sun'>☀️</span>
				<div className={`toggle-wrapper ${darkMode ? 'dark' : 'light'}`}>
					<div className={`toggle-ball ${darkMode ? 'move-right' : ''}`}></div>
				</div>
				<span className='icon-moon'>🌙</span>
			</div>

			<form onSubmit={onSubmitHandler} className='login-form'>
				<h2>{currState}</h2>
				{currState === 'Zarejestruj się' && (
					<input
						onChange={e => setUserName(e.target.value)}
						value={userName}
						className='form-input'
						type='text'
						placeholder='Nazwa użytkownika'
						required
					/>
				)}
				<input
					onChange={e => setEmail(e.target.value)}
					value={email}
					className='form-input'
					type='email'
					placeholder='Adres e-mail'
					required
				/>
				<input
					onChange={e => setPassword(e.target.value)}
					value={password}
					className='form-input'
					type='password'
					placeholder='Hasło'
					required
				/>
				{currState === 'Zarejestruj się' && (
					<input
						onChange={e => setConfirmPassword(e.target.value)}
						value={confirmPassword}
						className='form-input'
						type='password'
						placeholder='Potwierdź hasło'
						required
					/>
				)}

				{currState === 'Zarejestruj się' && (
					<div className='login-term'>
						<input
							type='checkbox'
							checked={termsAccepted}
							onChange={e => setTermsAccepted(e.target.checked)}
							required
						/>
						<p>
							Akceptuję{' '}
							<a href='#' className='hyperlink' onClick={toggleTerms}>
								Pokaż regulamin
							</a>
						</p>
					</div>
				)}

				{error && <p className='error-message'>{error}</p>}
				<button type='submit'>{currState === 'Zarejestruj się' ? 'Utwórz konto' : 'Zaloguj się'}</button>
				<div className='login-forgot'>
					{currState === 'Zarejestruj się' ? (
						<p className='login-toggle'>
							Masz już konto?{' '}
							<a href='#' onClick={() => switchState('Zaloguj się')} className='hyperlink'>
								Zaloguj się tutaj
							</a>
						</p>
					) : (
						<p className='login-toggle'>
							Nie masz konta?{' '}
							<a href='#' onClick={() => switchState('Zarejestruj się')} className='hyperlink'>
								Zarejestruj się tutaj
							</a>
						</p>
					)}
					{currState === 'Zaloguj się' && (
						<p className='login-toggle'>
							Zapomniałeś hasła?{' '}
							<a href='#' onClick={() => resetPass(email)} className='hyperlink'>
								Kliknij tutaj
							</a>
						</p>
					)}
				</div>
			</form>

			{showTerms && (
				<div className='terms-modal'>
					<div className='terms-content'>
						<h3>📜 Warunki użytkowania i polityka prywatności</h3>
						<div className='terms-scrollable'>
							<p>
								<strong>1. Postanowienia ogólne</strong>
								<br />
								1.1. Niniejsze Warunki użytkowania określają zasady korzystania z aplikacji Chat Flow-Desk, stworzonej w
								celach edukacyjnych jako projekt inżynierski.
								<br />
								1.2. Aplikacja Chat Flow-Desk jest dostępna jako oprogramowanie open-source i może być modyfikowana oraz
								rozwijana przez społeczność.
								<br />
								1.3. Korzystanie z aplikacji oznacza akceptację niniejszych Warunków użytkowania oraz Polityki
								prywatności.
								<br />
								1.4. Aplikacja nie jest przeznaczona do komercyjnego użytku ani do przechowywania wrażliwych danych.
								<br />
								<br />
								<strong>2. Rejestracja i konto użytkownika</strong>
								<br />
								- Rejestracja wymaga podania nazwy użytkownika, adresu e-mail oraz hasła.
								<br />
								- Hasło musi spełniać wymagania bezpieczeństwa (min. 8 znaków, wielka litera, cyfra i znak specjalny).
								<br />
								- Możliwość resetowania hasła przez e-mail.
								<br />
								<br />
								<strong>3. Korzystanie z aplikacji</strong>
								<br />
								- Użytkownik zobowiązuje się do przestrzegania prawa.
								<br />
								- Zabronione jest przesyłanie treści niezgodnych z prawem.
								<br />
								- Twórcy aplikacji mogą usunąć konto w razie naruszenia regulaminu.
								<br />
								<br />
								<strong>4. Prywatność i ochrona danych osobowych</strong>
								<br />
								- Dane są przechowywane w Firebase Firestore.
								<br />
								- Użytkownik ma prawo do edycji i usunięcia swoich danych.
								<br />
								<br />
								<strong>5. Odpowiedzialność i ograniczenia</strong>
								<br />
								- Aplikacja dostarczana jest "as is" bez gwarancji.
								<br />
								- Twórcy nie ponoszą odpowiedzialności za utratę danych.
								<br />
								<br />
								<strong>6. Licencja i modyfikacje kodu źródłowego</strong>
								<br />
								- Aplikacja udostępniona na licencji MIT License.
								<br />
								- Możliwość modyfikacji i redystrybucji z zachowaniem oryginalnej licencji.
								<br />
								<br />
								<strong>7. Postanowienia końcowe</strong>
								<br />
								- Twórcy mogą wprowadzać zmiany w regulaminie.
								<br />
								- Kontakt przez repozytorium GitHub.
								<br />
							</p>
						</div>
						<button onClick={toggleTerms} className='close-modal'>
							✖ Zamknij
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Login
