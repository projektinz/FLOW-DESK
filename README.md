# 📚 Chat Flow-Desk

**Chat Flow-Desk** to nowoczesna, responsywna aplikacja czatowa typu **Open-Source**, stworzona w oparciu o **React** i **Firebase**. Zapewnia użytkownikom możliwość prowadzenia rozmów w czasie rzeczywistym, przesyłania multimediów oraz personalizacji profilu. Projekt został stworzony z myślą o prostocie wdrożenia, intuicyjnej obsłudze i dalszej rozbudowie.

---

## 🚀 Funkcje aplikacji

- 🔐 **Rejestracja i logowanie użytkownika** (z potwierdzeniem hasła)
- 💬 **Tworzenie czatów** oraz **rozmowy w czasie rzeczywistym**
- 🖼️ **Wysyłanie i odbieranie multimediów** (obrazy)
- 🔄 **Podgląd aktywności użytkownika** (status online, ostatnia aktywność)
- 📝 **Edycja profilu użytkownika** (awatar, biogram,usunięcie konta)
- 🔔 **Powiadomienia o nowych wiadomościach** (Toastify)
- 🌙 **Tryb ciemny/jasny** z przełącznikiem
- 📱 **Pełna responsywność** – aplikacja działa na komputerach

---

## 🛠️ Technologie

- **Frontend:** React, CSS Modules, React Router, React Toastify
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **Dodatkowe biblioteki:** Vite, Emoji Picker

---

## 💡 Jak uruchomić projekt?

### 📦 **Kroki do uruchomienia lokalnie**

1️⃣ **Sklonuj repozytorium:**

git clone https://github.com/projektinz/FLOW-DESK.git

2️⃣ Przejdź do folderu projektu:

cd chat-flow-desk

3️⃣ Zainstaluj zależności:

npm install

4️⃣ Uruchom aplikację:

npm run dev

📌 Aplikacja będzie dostępna pod adresem http://localhost:5173/.

---

⚡ Konfiguracja Firebase

1️⃣ Utwórz projekt w Firebase na Firebase Console.

2️⃣ Skonfiguruj Firebase Authentication:

Wybierz metodę logowania: Email/Hasło.

3️⃣ Skonfiguruj Firestore Database:

Stwórz bazę danych Firestore w trybie produkcyjnym lub testowym.

4️⃣ Skonfiguruj Storage:

W sekcji Storage utwórz przestrzeń do przechowywania plików (np. obrazów).

5️⃣ Dodaj plik firebase.js w folderze config:
```plaintext

import { initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

import { getStorage } from 'firebase/storage';

const firebaseConfig = {

  apiKey: "TWOJE_API_KEY",
  
  authDomain: "TWOJA_AUTH_DOMAIN",
  
  projectId: "TWOJ_PROJECT_ID",
  
  storageBucket: "TWOJ_STORAGE_BUCKET",
  
  messagingSenderId: "TWOJ_SENDER_ID",
  
  appId: "TWOJ_APP_ID"
  
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
```
---

🔒 Reguły bezpieczeństwa Firestore

```plaintext
service cloud.firestore {

  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```


## 🎨 Struktura projektu

```plaintext
├── src
│   ├── assets           # Zasoby (obrazy, ikony)
│   ├── components       # Komponenty React
│   │   ├── ChatBox
│   │   ├── LeftSidebar
│   │   └── RightSidebar
│   ├── context          # Kontekst aplikacji
│   ├── pages            # Widoki strony (Login, Chat, ProfileUpdate)
│   ├── config           # Konfiguracja Firebase
│   ├── App.jsx          # Główny komponent aplikacji
│   └── main.jsx         # Punkt wejścia aplikacji
├── public               # Pliki statyczne
├── package.json         # Plik konfiguracyjny npm
└── vite.config.js       # Konfiguracja Vite

```

---


## 🔔 Walidacja danych

✅ Hasło musi zawierać:

Min. 8 znaków

Wielką literę

Znak specjalny i cyfrę

---

🔄 Pole do potwierdzenia hasła w formularzu rejestracji.

✉️ Walidacja poprawności adresu e-mail.

🧪 Funkcje bezpieczeństwa

🔒 Firebase Authentication do uwierzytelniania użytkowników

🛡️ Firestore Rules kontrolujące dostęp do danych

💾 Firebase Storage do bezpiecznego przechowywania multimediów

🔔 Informacje o błędach i sukcesach wyświetlane w powiadomieniach (Toastify)

🌍 Wsparcie dla RODO

📄 Wymagana akceptacja regulaminu podczas rejestracji.

🔐 Użytkownik może edytować i usuwać swoje dane.

🔒 Dane w Firebase są szyfrowane podczas przesyłania i przechowywania.

🌟 Przykładowe funkcjonalności (kody źródłowe)

---

💬 Wysyłanie wiadomości:
```plaintext

const sendMessage = async () => {
  if (input && messagesId) 
  {
    await updateDoc(doc(db, 'messages', messagesId), 
    {
      messages: arrayUnion(
      {
        sId: userData.id,
        text: input,
        createdAt: new Date(),
      }),
    });
    setInput('');
  }
};
```
🖼️ Przesyłanie zdjęć:
```plaintext
const sendImage = async (e) => {
  const fileUrl = await upload(e.target.files[0]);
  if (fileUrl && messagesId) {
    await updateDoc(doc(db, 'messages', messagesId), {
      messages: arrayUnion({
        sId: userData.id,
        image: fileUrl,
        createdAt: new Date(),
      }),
    });
  }
};
```
---

## 🤝 Autorzy projektu

👨‍💻 Krzysztof Małek – 57251

👨‍💻 Kacper Żurawik – 57119

🎓 Szkoła Wyższa im. Pawła Włodkowica w Płocku

📅 Płock, 2025

---

📜 Licencja
Projekt udostępniony na licencji MIT. Więcej informacji w pliku LICENSE.

✨ Dziękujemy za skorzystanie z Chat Flow-Desk! 🚀
