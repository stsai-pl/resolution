# Specyfikacja Wizualna (UI/UX) i Opis Widoków

Dokument definiuje spójny wygląd, układ oraz elementy interfejsu dla Systemu Zgłoszeń Problemów z Dostawami. Zapewnia on wytyczne dotyczące stylu oraz struktury poszczególnych ekranów.

---

## 1. Design System i Założenia Ogólne

Celem interfejsu jest zapewnienie maksymalnej użyteczności niezależnie od urządzenia, z którego korzysta użytkownik. Cały system jest w pełni responsywny i działa zarówno na urządzeniach mobilnych, jak i na ekranach komputerów (Desktop). Interfejsy są jednak optymalizowane pod główne środowisko pracy dla danej roli.

### 1.1. Kolorystyka
- **Kolor główny (Primary):** Granatowy/Ciemnoniebieski (kojarzący się z logistyką, profesjonalny i czytelny).
- **Kolor tła (Background):** Bardzo jasny szary (off-white) dla całego widoku, czysta biel dla kart, paneli i tabel.
- **Kolory semantyczne (Statusy i Akcje):**
  - **Zielony (Sukces):** Status "Rozpatrzone", Rezultat "Uznane", komunikaty o pomyślnym zapisie.
  - **Pomarańczowy (Ostrzeżenie):** Status "W trakcie", informacje o konieczności zmiany hasła.
  - **Niebieski (Informacja):** Status "Nowe", linki, zaznaczenia.
  - **Czerwony (Błąd / Destrukcja):** Rezultat "Odrzucone", komunikaty błędów, dezaktywacja konta.
- **Tekst:** Ciemnoszary (prawie czarny) dla nagłówków i tekstu głównego; średnioszary dla metadanych (np. daty, dodatkowe opisy).

### 1.2. Typografia
- **Krój pisma:** Prosty, bezszeryfowy font (np. Inter, Roboto, lub systemowy).
- **Hierarchia:**
  - Nagłówki ekranów (H1): 24px (Mobile) / 32px (Desktop), pogrubione.
  - Tytuły sekcji (H2): 18px (Mobile) / 22px (Desktop), pogrubione.
  - Tekst główny: 16px (zapewnia czytelność bez powiększania ekranu).
  - Tekst pomocniczy: 14px (dla dat, małych etykiet).

### 1.3. Layout i Komponenty
- **Responsywność i Punkty Przegięcia (Breakpoints):**
  - Wszystkie ekrany adaptują się do szerokości okna przeglądarki.
  - **Mobile (do ~768px):** Układ jednokolumnowy. Tabele z danymi zamieniają się w pionowe listy kart. Duże obszary dotykowe (min. 44x44px dla przycisków i kafelków). Przyciski na stałe przytwierdzone do dolnej krawędzi (sticky bottom), gdy wymaga tego przepływ pracy w terenie.
  - **Tablet/Desktop (powyżej ~768px):** Wykorzystanie dostępnej przestrzeni poziomej. Układy wielokolumnowe (np. oddzielenie szczegółów zgłoszenia od osi czasu z notatkami). Tradycyjny widok tabelaryczny.
- **Przyciski:** 
  - Primary (Główne akcje): Wypełnione kolorem głównym, biały tekst.
  - Secondary (Anuluj, Powrót): Bez wypełnienia, obramowanie i tekst w kolorze głównym.
  - Destructive (Usuń, Dezaktywuj): Wypełnione kolorem czerwonym lub czerwone obramowanie.
- **Formularze:** Pola tekstowe z etykietami na górze (top-aligned), wyraźne obramowanie, stan skupienia (focus) zaznaczony grubszą ramką w kolorze primary. Czerwone ramki dla pól z błędem walidacji.
- **Odznaki (Badges):** Statusy zawsze prezentowane jako pigułki (pill shape) z kolorowym tłem i tekstem, co pozwala na natychmiastowe rozpoznanie stanu zgłoszenia na listach oraz w szczegółach.

---

## 2. Opis Widoków

Każdy z widoków systemu dziedziczy powyższe zasady, tworząc spójny ekosystem niezależnie od roli i urządzenia.

### 2.1. Panel Logowania (Wspólny)
Niezależnie od roli, punkt wejścia wygląda identycznie na każdym urządzeniu.

- **Formularz logowania – układ podstawowy**
  - **Układ:** Centralnie wyśrodkowana, biała karta (Modal-style) na jasnoszarym tle (na mobile na pełną szerokość ekranu).
  - **Zawartość:** Duże logo systemu/firmy na górze. Poniżej dwa standardowe pola tekstowe (Login, Hasło). Pod polami pełnej szerokości przycisk Primary "Zaloguj się".
- **Formularz logowania – ze stanem błędu**
  - **Układ:** Taki sam jak podstawowy.
  - **Zawartość:** Widoczny wzorzec dla całego systemu prezentujący błąd: wyraźny, czerwony pasek (alert) nad polami z odpowiednim komunikatem (np. "Nieprawidłowy login lub hasło"), a pole z błędną walidacją podświetlone czerwoną ramką.
- **Formularz zmiany hasła tymczasowego**
  - **Układ:** Karta centralna analogiczna do logowania.
  - **Zawartość:** Ikona ostrzeżenia/informacji obok tekstu na pomarańczowym/żółtym tle z komunikatem instrukcyjnym: „Logujesz się po raz pierwszy. Ustaw swoje hasło”. Poniżej dwa pola na nowe hasło i szeroki przycisk "Ustaw hasło i zaloguj się".

---

### 2.2. Interfejs Klienta
Interfejs optymalizowany przede wszystkim pod Mobile ze względu na ewentualne zgłoszenia ze smartfonów na hali, ale w pełni dostępny jako wygodny układ w przeglądarce Desktop.

- **Lista towarów / strona główna – układ z pozycjami**
  - **Układ:** Przyklejona belka (Header) u góry z Numerem Klienta. Poniżej lista. Na desktopie układ kafelkowy (Grid), na mobile lista pionowa.
  - **Zawartość:** Dwa wyraźne przyciski na górze ("Wyloguj" oraz wyróżniony "Moje zgłoszenia"). Lista elementów prezentowana w formie kart (każda z numerem towaru i ikoną nawigacji).
- **Lista towarów / strona główna – układ pusty**
  - **Układ:** Identyczny nagłówek, pusta przestrzeń robocza.
  - **Zawartość:** Zamiast listy komponent tzw. "Empty State" z centralną, przyjazną grafiką/ikoną i jasnym tekstem informującym o braku towarów przypisanych do konta.
- **Ekran błędu krytycznego API**
  - **Układ:** Zastępuje całkowicie widok listy. Wyśrodkowany obszar komunikatu.
  - **Zawartość:** Centralny komunikat o braku łączności z systemem logistycznym (np. ikona odłączonego kabla lub chmury) i duży przycisk akcji "Spróbuj ponownie" pod spodem.
- **Formularz zgłoszenia problemu**
  - **Układ:** Na mobile przycisk akcji przytwierdzony stale do dołu ekranu. Na desktopie wyśrodkowany kontener o max. szerokości ~600px.
  - **Zawartość:** Nagłówek z numerem wybranego towaru. Duże pole *textarea* na opis problemu (z licznikiem na max 2000 znaków). Przyciski akcji: "Wyślij zgłoszenie" i "Anuluj".
- **Ekran potwierdzenia sukcesu – wariant Klienta**
  - **Układ:** Centralnie wyśrodkowana zawartość ekranu.
  - **Zawartość:** Duża, zielona ikona sukcesu (ptaszek). Pod nią tekst potwierdzenia oraz wyeksponowany duży numer zgłoszenia. Dwa przyciski nawigacyjne ustawione w kolumnie lub w jednym rzędzie: "Przejdź do moich zgłoszeń" oraz "Złóż kolejne zgłoszenie".
- **Lista moich zgłoszeń – standardowy układ wierszy**
  - **Układ:** Analogiczny do Listy Towarów.
  - **Zawartość:** Pozycje ze statusem "Nowe" (niebieska odznaka) i "W trakcie" (pomarańczowa odznaka). Na karcie/wierszu wyraźnie widoczny numer zgłoszenia, numer towaru i data.
- **Lista moich zgłoszeń – układ z uwzględnieniem rozpatrzenia**
  - **Układ:** Jak wyżej.
  - **Zawartość:** W wierszach dla zgłoszeń oznaczonych statusem "Rozpatrzone", pojawia się nowy element wizualny (dodatkowa odznaka) informująca o rezultacie: Uznane (zielona) lub Odrzucone (czerwona).
- **Lista moich zgłoszeń – układ pusty**
  - **Układ:** Jak wyżej, ale bez elementów listy.
  - **Zawartość:** "Empty State" z odpowiednią grafiką i tekstem „Nie masz jeszcze żadnych zgłoszeń”.

---

### 2.3. Interfejs Kierowcy
Głównym środowiskiem pracy jest urządzenie mobilne w terenie, więc UI skupia się na bardzo prostym i szybkim procesie bez zbędnych odwracaczy uwagi. (Uwaga: Formularz zgłoszeniowy, puste stany i błędy API powielają układy z interfejsu klienta).

- **Lista towarów – wariant Kierowcy**
  - **Układ:** Analogiczny do Listy Towarów klienta, ale uboższy w elementy poboczne.
  - **Zawartość:** W nagłówku znajduje się imię i nazwisko kierowcy oraz jego numer. Na ekranie jest tylko jeden przycisk w headerze ("Wyloguj"). Brakuje przycisku przejścia do "Moich zgłoszeń". Lista kart towarów do wyboru.
- **Ekran potwierdzenia sukcesu – wariant Kierowcy**
  - **Układ:** Centralnie wyśrodkowana zawartość.
  - **Zawartość:** Komunikat sukcesu i numer zgłoszenia (podobnie jak u Klienta). Różnica polega na tym, że posiada tylko jeden przycisk pozwalający na złożenie kolejnego zgłoszenia (powrót do listy towarów).

---

### 2.4. Panel Obsługi
Panel optymalizowany jest jako narzędzie typu Dashboard (Desktop-First).

- **Główna tabela zgłoszeń – układ pełny**
  - **Układ:** Szeroka na cały ekran tabela danych (Data Table). Na górze pasek narzędzi.
  - **Zawartość:** Tabela z danymi zawierająca pełne wiersze (zgłaszający, towar, statusy w formie odznak, data). Pasek narzędzi posiada wyszukiwarkę z ikoną lupy i dropdowny kilku filtrów (Status, Typ).
- **Główna tabela zgłoszeń – układ pusty**
  - **Układ:** Układ dashboardu zostaje zachowany, ale zawartość tabeli jest inna.
  - **Zawartość:** Brak wyników wyszukiwania lub pusta tabela jest sygnalizowana pojedynczym, rozciągniętym wierszem "Empty State" zawierającym komunikat np. "Nie znaleziono zgłoszeń spełniających kryteria" i ewentualnie przycisk resetowania filtrów.
- **Widok szczegółów zgłoszenia – układ standardowy**
  - **Układ:** Ekran podzielony na dwie sekcje/kolumny (dane z lewej, notatki z prawej).
  - **Zawartość:** Zgrupowane bloki prezentujące metadane i opis problemu. System przewijanej osi czasu (Timeline) dla notatek oraz pole do dodawania nowej. Pola do wyboru winy (dropdown "Wina") oraz dropdown "Status".
- **Widok szczegółów zgłoszenia – układ z rozpatrywaniem**
  - **Układ:** Jak wyżej.
  - **Zawartość:** Po wybraniu statusu "Rozpatrzone" z dropdownu, dynamicznie pojawia się nowy, wymagany komponent formularza: dropdown "Rezultat" z opcjami Uznane/Odrzucone. 
- **Widok szczegółów zgłoszenia – pusta sekcja notatek**
  - **Układ:** Zachowana struktura kolumn.
  - **Zawartość:** W sekcji osi czasu, zamiast listy notatek, wyświetla się delikatny komponent placeholderowy (np. szara ikonka wiadomości z tekstem "Brak notatek. Bądź pierwszym, który doda notatkę.").
- **Wskaźnik statusu operacji (Toast/Snackbar)**
  - **Układ:** Nakładka systemowa.
  - **Zawartość:** Wzorzec notyfikacji (Toast/Snackbar) dla komunikatów takich jak "Zmiany zapisane", który unosi się nad interfejsem (zwykle w prawym dolnym lub górnym rogu ekranu), znika automatycznie po kilku sekundach. Posiada kolorystykę odpowiadającą rezultatowi (zielony dla sukcesu, czerwony dla błędu).

---

### 2.5. Panel Administracyjny
Analogicznie jak Panel Obsługi – projektowany głównie do pracy na szerokich monitorach.

- **Tabela użytkowników – układ pełny**
  - **Układ:** Standardowa, duża tabela wyświetlająca użytkowników na pełnej szerokości ekranu roboczego.
  - **Zawartość:** Wiersze Obsługi, Klientów i Kierowców oznaczane statusem (kropka zielona/szara). Na górze filtry statusu/roli. Wyeksponowane dwa główne przyciski dodawania pracownika i synchronizacji.
- **Formularz tworzenia konta Obsługi**
  - **Układ:** Wysuwany boczny panel (Drawer) LUB wyśrodkowane okno modalne z przyciemnionym tłem.
  - **Zawartość:** Pola na login i hasło tymczasowe. Wyraźny niebieski blok informacyjny na temat konieczności zmiany hasła przez tworzonego użytkownika. Przyciski akcji (Anuluj, Utwórz) wyrównane do prawej.
- **Ekran edycji konta – stan dla konta aktywnego**
  - **Układ:** Podobny jak przy tworzeniu konta (Drawer/Modal).
  - **Zawartość:** Wyświetla się blok do resetu hasła. Na dole formularza wyraźnie oddzielony (np. linią) przycisk dezaktywacji w stylu Destructive (czerwony outline/tło).
- **Ekran edycji konta – stan dla konta nieaktywnego**
  - **Układ:** Jak wyżej.
  - **Zawartość:** W miejscu czerwonego przycisku dezaktywacji znajduje się standardowy przycisk służący do odblokowania (aktywacji) konta w kolorze Primary lub Secondary.
- **Ekran synchronizacji – przed akcją**
  - **Układ:** Odizolowany, centralny widok oparty na dużej, białej karcie.
  - **Zawartość:** Jasny tekst objaśniający działanie synchronizacji. Widoczna data ostatniej operacji. Pojedynczy, bardzo duży przycisk akcji "Uruchom synchronizację".
- **Ekran synchronizacji – z wynikami**
  - **Układ:** Ten sam co wyżej, dynamicznie rozszerzony po zakończeniu ładowania.
  - **Zawartość:** Na ekranie pod (lub nad) przyciskiem pojawia się nowy blok zawierający podsumowanie liczbowe wykonanej operacji w formie czytelnych kafelków ze wskaźnikami: "Ile kont dodano", "Ile usunięto/zdezaktywowano", "Ile zostawiono bez zmian".

---

## 3. Lista Wszystkich Widoków do Zaimplementowania

Poniższa lista stanowi podsumowanie wszystkich stanów i widoków wymaganych do pełnego wdrożenia interfejsu (tzw. inwentaryzacja widoków).

**1. Logowanie i Autoryzacja**
- Formularz logowania – układ podstawowy (pola login, hasło, przycisk wysłania).
- Formularz logowania – ze stanem błędu (wzorzec dla całego systemu pokazujący, jak wpleść w formularz informację o walidacji lub błędzie głównym).
- Formularz zmiany hasła tymczasowego (komunikat instrukcyjny, dwa pola na hasło, przycisk).

**2. Aplikacja Klienta (Mobile & Desktop)**
- Lista towarów / strona główna – układ z pozycjami (nagłówek, lista elementów, dwa przyciski: "Wyloguj" oraz "Moje zgłoszenia").
- Lista towarów / strona główna – układ pusty (zamiast listy komponent z informacją o braku elementów).
- Ekran błędu krytycznego API (układ zastępujący całkowicie listę – centralny komunikat i przycisk akcji "Spróbuj ponownie").
- Formularz zgłoszenia problemu (nagłówek, duże pole tekstowe, przyciski akcji).
- Ekran potwierdzenia sukcesu – wariant Klienta (komunikat sukcesu, duży numer zgłoszenia oraz dwa przyciski nawigacyjne).
- Lista moich zgłoszeń – standardowy układ wierszy (pozycje ze statusem "Nowe" i "W trakcie").
- Lista moich zgłoszeń – układ z uwzględnieniem rozpatrzenia (w wierszach listy pojawia się nowy element – dodatkowa informacja o rezultacie: Uznane/Odrzucone).
- Lista moich zgłoszeń – układ pusty.

**3. Aplikacja Kierowcy (Mobile & Desktop)**
- Lista towarów – wariant Kierowcy (układ różni się od klienckiego – w nagłówku imię i nazwisko, a na ekranie jest tylko jeden przycisk, brakuje przejścia do "Moich zgłoszeń").
- Ekran potwierdzenia sukcesu – wariant Kierowcy (układ różni się od klienckiego – posiada tylko jeden przycisk pozwalający na złożenie kolejnego zgłoszenia).
*(Uwaga: Formularz zgłoszeniowy dla kierowcy powiela układ, a puste stany i błędy API z interfejsu Klienta i nie wymagają osobnych designów).*

**4. Panel Obsługi (Desktop)**
- Główna tabela zgłoszeń – układ pełny (tabela z danymi, pasek z wyszukiwarką i kilkoma filtrami).
- Główna tabela zgłoszeń – układ pusty (brak wyników wyszukiwania/pusta tabela).
- Widok szczegółów zgłoszenia – układ standardowy (dane informacyjne, lista notatek, pole dodawania notatki, dropdown "Wina", dropdown "Status").
- Widok szczegółów zgłoszenia – układ z rozpatrywaniem (po wybraniu określonego statusu pojawia się nowy, wymagany komponent: dropdown "Rezultat").
- Widok szczegółów zgłoszenia – pusta sekcja notatek (zamiast listy notatek inny komponent placeholderowy).
- Dowolny widok panelu ze wskaźnikiem statusu operacji (Toast/Snackbar) (wzorzec dla notyfikacji typu "Zmiany zapisane", który unosi się nad interfejsem lub jest wpleciony w layout panelu).

**5. Panel Administracyjny (Desktop)**
- Tabela użytkowników – układ pełny (tabela z wierszami Obsługi i Klientów, filtry, przyciski dodawania i synchronizacji).
- Formularz tworzenia konta Obsługi (pola login, hasło, tekst informacyjny, przyciski).
- Ekran edycji konta – stan dla konta aktywnego (widoczne: pole do resetu hasła i przycisk dezaktywacji).
- Ekran edycji konta – stan dla konta nieaktywnego (w miejscu dezaktywacji jest przycisk służący do odblokowania konta).
- Ekran synchronizacji – przed akcją (tekst objaśniający, data ostatniej synchronizacji, pojedynczy przycisk akcji).
- Ekran synchronizacji – z wynikami (na ekranie pojawia się nowy blok zawierający podsumowanie liczbowe wykonanej operacji: ile dodano, usunięto, zostawiono).