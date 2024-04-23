# Projekt Aplikacji Liternik - gry logicznej nawiązującej do Scrabble

## 06.03.2024 - 13.03.2024 <br />
    * Utworzenie projektu w oparciu o react-vite 
    * Dodano zależności: 
        - react 
        - react-dom 
        - react-router-dom 
    * Utworzenie podstawowych komponentów gry: 
        - Board.jsx 
        - ChatBlock.jsx 
        - ScoreBoard.jsx 
        - Header.jsx 
        - UserPanel.jsx 
        - WordsBlock.jsx 

## 13.03.2024 - 20.03.2024 <br />
    * Utworzenie komponentu (LoginRegister.jsx) dla widoku logowania/rejestracji
        - Dodanie pliku modułowego ze stylami LoginRegister.module.css i aktualizacja komponentu.
    * Utworzenie komponentu (UserProfile.jsx) dla widoku związanego z wyświetlaniem użytkownikowi       statystyk i możliwością utworzenia gry
        - Dodanie pliku modułowego ze stylami UserProfile.module.css i aktualizacja komponentu.

## 21.03.2024 - 27.03.2024 <br />
    * Utworzenie komponentu widoku ExtendedRules.jsx do wyświetlania szczegółowych zasad gry.
        - Dodanie pliku modułowego ze stylami ExtendedRules.module.css
    * Dodanie stylowania dla utworzonych wcześniej komponentów gry:
        - chat_block.module.css
        - header.module.css
        - score_board.module.css
        - style_main_view.module.css
        - user_panel.module.css
        - word_block.module.css
        
## 28.03.2024 - 03.04.2024 <br />
    * Utworzenie komponentów umożliwiających rejestrację użytkownika po stronie backendu, zgodnie z architekturą MVC.
    * Edycja komponentu login-register po stronie klienta, umożliwiając logowanie i rejestrację.
    * Dodano modele:
        - userModel.js
    * Dodano routing:
        - usersRoutes.js
    * Dodano kontroler:
        - userController.js

## 04.04.2024 - 10.04.2024 <br />
    * Kontynuacja pracy nad back-endem.
    * Walidacja formularzy po stronie klienta.
    * Dodanie mechanizmu tokenów przechowywanych w ciasteczkach przeglądarki.
    * Dodanie mechanizmu logowania użytkowników w oparciu o token.
    * Mechanizm wylogowywania w oparciu o usuwanie tokenu z ciasteczek przeglądarki.
    * Operacje po stronie backendu w oparciu o sprawdzenie poprawności tokenu.

## 11.04.2024 - 16.04.2024 <br />
    * Rozpoczęcie pracy nad częścią projektu poświęconą logice gry.
        - Realizacja umieszczania liter na planszy i ściągania ich.
        - Dodanie funkcjonalności przesuwania liter po planszy.
    * Wprowadzenie mechanizmu wymiany liter:
        - Przydzielenie graczowi na początku rozgrywki 7 liter wybranych losowo.
        - Obsługa wymiany liter poprzez naciśnięcie przycisku, a następnie określenie
        przez gracza liter do wymiany i potwierdzenie decyzji drugim przyciskiem.
    * Wstępne dodanie Timera ograniczającego czas trwania rozgrywki.

## 17.04.2024 - 23.04.2024 <br />
    * Utworzenie funkcjonalności po stronie backendu realizujące możliwość sprawdzenia poprawności słów w bazie danych.
        - Stworzenie nowego modelu, routingu i kontrolera dla Board.jsx
    * Możliwość zatwierdzania utworzonych słów przez użytkowników na planszy.
    * Naprawa funkcjonalności wymiany liter.
    * Naprawa funkcjonalności przeciągania liter, gdy użytkownik wylosuje dwie te same litery.

    TO DO:
    * Blank
        - Wybór litery
    * Pojedyncze litery na planszę
        - Funkcja z sąsiedztwa nie wykrywa pojedynczych liter na planszy
    * Punktacja (całość)
    * Ściągnięcie liter po tym, jak utworzone słowo nie znajduje się w bazie.