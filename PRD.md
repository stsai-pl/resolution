# PRD: System Zgłoszeń Problemów z Dostawami

## Informacje o dokumencie
- Wersja: 3.0
- Data: 2026-02-19
- Status: Draft
- Dokumenty źródłowe: `analiza_wymagan.md`, `openapi.yaml`

---

## Feature: Logowanie użytkowników

### Cel funkcjonalności
Dla wszystkich użytkowników systemu (Klient, Kierowca, Obsługa, Admin) — zapewnienie kontroli dostępu do systemu. Każda część systemu jest dostępna wyłącznie po zalogowaniu.

### Punkt wejścia
Użytkownik otwiera aplikację (przeglądarka, urządzenie mobilne lub desktop) i nie jest zalogowany.

### Warunek zakończenia
Użytkownik jest zalogowany i przekierowany do odpowiedniego widoku zgodnie ze swoją rolą.

### Przepływ użytkownika (Happy Path)

**Ekran 1: Logowanie**
- Cel: Użytkownik uwierzytelnia się w systemie
- Widoczne elementy:
  - Nazwa systemu / logo
  - Pole „Login" (text input, wymagane)
  - Pole „Hasło" (password input, wymagane)
  - Przycisk „Zaloguj się"
- Akcja: Użytkownik wpisuje login i hasło, klika „Zaloguj się"
- Przejście: System weryfikuje dane logowania w lokalnej bazie danych. Jeśli konto jest nieaktywne — komunikat „Konto zostało dezaktywowane. Skontaktuj się z administratorem." Po pozytywnej weryfikacji:
  - Jeśli flaga `mustChangePassword = true` → Ekran 2 (Zmiana hasła tymczasowego)
  - W przeciwnym razie → przekierowanie zależne od roli:
    - Rola KLIENT → Feature „Składanie zgłoszenia przez Klienta", Ekran 1 (Lista towarów)
    - Rola KIEROWCA → Feature „Składanie zgłoszenia przez Kierowcę", Ekran 1 (Lista towarów)
    - Rola OBSŁUGA → Feature „Panel Obsługi", Ekran 1 (Lista zgłoszeń)
    - Rola ADMIN → Feature „Panel Administracyjny", Ekran 1 (Lista użytkowników)

**Ekran 2: Zmiana hasła tymczasowego**
- Cel: Użytkownik logujący się po raz pierwszy ustawia własne hasło
- Widoczne elementy:
  - Komunikat „Logujesz się po raz pierwszy. Ustaw swoje hasło."
  - Pole „Nowe hasło" (password input, wymagane)
  - Pole „Powtórz nowe hasło" (password input, wymagane)
  - Przycisk „Ustaw hasło i zaloguj się"
- Akcja: Użytkownik wpisuje nowe hasło dwukrotnie i klika przycisk
- Przejście: System zapisuje nowe hasło (flaga `mustChangePassword` = false) → przekierowanie do widoku odpowiedniego dla roli

### Diagram przepływu

```
                                                         ┌→ [Lista towarów Klienta]
                                  ┌→ [hasło OK]          ├→ [Lista towarów Kierowcy]
[Logowanie] ──(weryfikacja OK)──→ │  (wg roli) ─────────→├→ [Panel Obsługi]
      ↓                           │                       └→ [Panel Administracyjny]
  (błąd /                         └→ [mustChangePassword]
  nieaktywne →                        → [Zmiana hasła] → (przekierowanie wg roli)
  komunikat)
```

### Stany brzegowe
- **Pusty stan:** Nie dotyczy.
- **Stan błędu:** Błędny login lub hasło — komunikat „Nieprawidłowy login lub hasło" (bez wskazania, które pole jest błędne). Konto nieaktywne — komunikat „Konto zostało dezaktywowane. Skontaktuj się z administratorem." Baza danych niedostępna — komunikat „Nie można połączyć się z systemem. Spróbuj ponownie później."
- **Reguły walidacji:** Login — wymagany, niepusty. Hasło — wymagane, niepuste. Nowe hasło (Ekran 2) — wymagane, niepuste, oba pola muszą być identyczne. System nie informuje, czy login istnieje (ochrona przed enumeracją kont).
- **Ograniczenia dostępu:** Niezalogowany użytkownik nie ma dostępu do żadnej części systemu poza ekranem logowania. Użytkownik z `mustChangePassword = true` nie może pominąć ekranu zmiany hasła.

### Używane dane

| Obiekt | Pole | Typ | Wymagane | Mutowalne po utworzeniu | Usuwalne | Źródło (SSoT) / Cel |
|--------|------|-----|----------|------------------------|----------|----------------------|
| Użytkownik | id | integer | tak | nie | nie | lokalna BD |
| Użytkownik | login | string (unikalny) | tak | nie (dla OBSŁUGA/ADMIN: tak przy edycji) | nie | lokalna BD |
| Użytkownik | passwordHash | string | tak | tak | nie | lokalna BD |
| Użytkownik | role | enum (KLIENT, KIEROWCA, OBSŁUGA, ADMIN) | tak | nie | nie | lokalna BD |
| Użytkownik | externalId | integer (nullable) | dla KLIENT i KIEROWCA: tak; dla OBSŁUGA/ADMIN: nie | nie | nie | lokalna BD (referencja do id w systemie logistycznym) |
| Użytkownik | isActive | boolean | tak | tak (tylko ADMIN) | nie | lokalna BD |
| Użytkownik | mustChangePassword | boolean | tak | tak (system ustawia false po zmianie hasła) | nie | lokalna BD |

### Założenia
- Konta pracowników Obsługi i Adminów są zakładane ręcznie przez Admina w Panelu Administracyjnym.
- Konta Klientów i Kierowców są tworzone automatycznie poprzez synchronizację z systemem logistycznym (Feature „Panel Administracyjny").
- Dla roli KLIENT pole `externalId` wskazuje na `client.id` w systemie logistycznym; login = `client.number`.
- Dla roli KIEROWCA pole `externalId` wskazuje na `driver.id` w systemie logistycznym; login = `driver.number`.
- Dla roli OBSŁUGA i ADMIN pole `externalId` jest puste.
- Sesja użytkownika wygasa po określonym czasie nieaktywności (szczegóły implementacyjne).

### Poza zakresem
- Rejestracja nowych użytkowników (self-service).
- Resetowanie hasła przez użytkownika (self-service, np. przez e-mail).
- Dwuskładnikowe uwierzytelnianie (2FA).

### Endpointy API (system zgłoszeń)

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | /api/auth/login | Logowanie — przyjmuje login i hasło, zwraca token sesji, rolę i flagę mustChangePassword |
| POST | /api/auth/logout | Wylogowanie — unieważnia sesję |
| POST | /api/auth/change-password | Zmiana hasła tymczasowego — przyjmuje nowe hasło, ustawia mustChangePassword = false |

### Kryteria DONE
1. Użytkownik z poprawnymi danymi logowania zostaje zalogowany i przekierowany do widoku odpowiedniego dla swojej roli (KLIENT → lista towarów, KIEROWCA → lista towarów, OBSŁUGA → panel zgłoszeń, ADMIN → panel administracyjny).
2. Użytkownik logujący się po raz pierwszy (mustChangePassword = true) jest przekierowany na ekran zmiany hasła i nie może go pominąć; po ustawieniu hasła trafia do widoku swojej roli.
3. Niezalogowany użytkownik, który próbuje wejść na dowolny adres w systemie, jest przekierowany na ekran logowania.

### Podsumowanie przepływu
Przepływ jest jedno- lub dwuekranowy: logowanie → (opcjonalnie zmiana hasła tymczasowego) → przekierowanie po roli. Wspólny ekran logowania dla wszystkich ról. Dane logowania trzymane lokalnie, dane opisowe Klienta/Kierowcy pobierane z systemu logistycznego na podstawie `externalId`.

---

## Feature: Składanie zgłoszenia i przegląd statusu przez Klienta

### Cel funkcjonalności
Dla Klienta firmy logistycznej — umożliwienie elektronicznego zgłoszenia problemu z dostawą oraz wglądu w status swoich zgłoszeń, eliminując papierowe formularze i fizyczne dostarczanie dokumentów.

### Punkt wejścia
Klient jest zalogowany w systemie (po przejściu Feature „Logowanie").

### Warunek zakończenia
Klient złożył zgłoszenie i widzi je na liście swoich zgłoszeń ze statusem NOWE, lub Klient przejrzał statusy swoich istniejących zgłoszeń.

### Przepływ użytkownika (Happy Path)

**Ekran 1: Lista towarów / Strona główna Klienta**
- Cel: Klient wskazuje, którego towaru/zlecenia dotyczy problem
- Widoczne elementy:
  - Nagłówek z numerem klienta (pobranym z systemu logistycznego na podstawie `externalId` zalogowanego użytkownika)
  - Lista towarów klienta (każdy element wyświetla numer towaru `number`)
  - Przycisk „Moje zgłoszenia" (nawigacja do Ekranu 4)
  - Przycisk „Wyloguj"
- Akcja: Klient klika na wybrany towar z listy
- Przejście: System pobiera dane towaru z API (`GET /api/clients/{externalId}/goods`). Po wybraniu towaru → Ekran 2

**Ekran 2: Formularz zgłoszenia**
- Cel: Klient opisuje problem z dostawą
- Widoczne elementy:
  - Nagłówek z numerem towaru
  - Pole „Opis problemu" (textarea, wymagane, maks. 2000 znaków)
  - Przycisk „Wyślij zgłoszenie"
  - Przycisk „Anuluj" (powrót do Ekranu 1)
- Akcja: Klient wypełnia opis problemu i klika „Wyślij zgłoszenie"
- Przejście: System zapisuje zgłoszenie ze statusem NOWE → Ekran 3

**Ekran 3: Potwierdzenie**
- Cel: Klient otrzymuje potwierdzenie złożenia zgłoszenia
- Widoczne elementy:
  - Komunikat „Zgłoszenie zostało złożone"
  - Numer zgłoszenia
  - Przycisk „Przejdź do moich zgłoszeń" (→ Ekran 4)
  - Przycisk „Złóż kolejne zgłoszenie" (→ Ekran 1)
- Akcja: Klient klika jeden z przycisków
- Przejście: Nawigacja zgodnie z wybranym przyciskiem

**Ekran 4: Lista moich zgłoszeń**
- Cel: Klient przegląda swoje zgłoszenia i ich statusy
- Widoczne elementy:
  - Lista zgłoszeń klienta (każdy element: numer zgłoszenia, numer towaru, status, data utworzenia)
  - Kolorowe oznaczenie statusu (NOWE, W TRAKCIE, ROZPATRZONE)
  - Dla zgłoszeń ze statusem ROZPATRZONE: wyświetlany rezultat (UZNANE lub ODRZUCONE)
  - Przycisk „Złóż nowe zgłoszenie" (→ Ekran 1)
  - Przycisk „Wyloguj"
- Akcja: Klient przegląda listę
- Przejście: Klient może wrócić do Ekranu 1 lub wylogować się

### Diagram przepływu

```
[Logowanie] → [Lista towarów] → [Formularz zgłoszenia] → [Potwierdzenie]
                     ↓                                          ↓
                [Moje zgłoszenia] ←←←←←←←←←←←←←←←←←←←←←←←←←←←┘
```

### Stany brzegowe
- **Pusty stan:** Klient nie ma żadnych towarów — Ekran 1 wyświetla komunikat „Brak towarów przypisanych do Twojego konta". Klient nie ma żadnych zgłoszeń — Ekran 4 wyświetla komunikat „Nie masz jeszcze żadnych zgłoszeń".
- **Stan błędu:** API systemu logistycznego niedostępne — wyświetlany komunikat „Nie można połączyć się z systemem. Spróbuj ponownie później." z przyciskiem „Spróbuj ponownie". Błąd zapisu zgłoszenia — komunikat „Nie udało się zapisać zgłoszenia. Spróbuj ponownie."
- **Reguły walidacji:** Opis problemu — wymagany, maks. 2000 znaków. Towar — wymagany (musi być wybrany z listy).
- **Ograniczenia dostępu:** Klient widzi wyłącznie towary przypisane do swojego `externalId` w systemie logistycznym. Klient widzi wyłącznie zgłoszenia, które sam złożył. Dostęp wymaga zalogowania z rolą KLIENT.

### Używane dane

| Obiekt | Pole | Typ | Wymagane | Mutowalne po utworzeniu | Usuwalne | Źródło (SSoT) / Cel |
|--------|------|-----|----------|------------------------|----------|----------------------|
| Klient | id | integer | tak | nie | nie | system logistyczny (SSoT) |
| Klient | number | string | tak | nie | nie | system logistyczny (SSoT) |
| Klient | email | string | tak | nie | nie | system logistyczny (SSoT) |
| Towar | id | integer | tak | nie | nie | system logistyczny (SSoT) |
| Towar | number | string | tak | nie | nie | system logistyczny (SSoT) |
| Towar | clientId | integer | tak | nie | nie | system logistyczny (SSoT) |
| Towar | driverId | integer | tak | nie | nie | system logistyczny (SSoT) |
| Zgłoszenie | id | integer | tak | nie | nie | lokalna BD |
| Zgłoszenie | goodId | integer | tak | nie | nie | lokalna BD (referencja do Towar w systemie logistycznym) |
| Zgłoszenie | reporterType | enum (KLIENT, KIEROWCA) | tak | nie | nie | lokalna BD |
| Zgłoszenie | reporterId | integer | tak | nie | nie | lokalna BD (referencja do Użytkownik.id) |
| Zgłoszenie | description | string (maks. 2000 znaków) | tak | nie | nie | lokalna BD |
| Zgłoszenie | status | enum (NOWE, W_TRAKCIE, ROZPATRZONE) | tak | tak (tylko Obsługa) | nie | lokalna BD |
| Zgłoszenie | fault | enum (KLIENT, FIRMA, NIKT) | nie | tak (tylko Obsługa) | nie | lokalna BD |
| Zgłoszenie | resolution | enum (UZNANE, ODRZUCONE) | nie (wymagane gdy status = ROZPATRZONE) | tak (tylko Obsługa) | nie | lokalna BD |
| Zgłoszenie | createdAt | datetime | tak | nie | nie | lokalna BD |

### Założenia
- System automatycznie identyfikuje klienta na podstawie zalogowanego użytkownika (`externalId` → `client.id` w systemie logistycznym).
- Jedno zgłoszenie dotyczy jednego towaru/zlecenia.
- Status NOWE jest nadawany automatycznie przy tworzeniu zgłoszenia.
- Opis problemu podany przez zgłaszającego jest niezmienny po złożeniu (integralność zgłoszenia).
- Zgłoszenia nie mogą być usuwane — pozostają w systemie na zawsze.

### Poza zakresem
- Załączanie plików (zdjęcia, dokumenty) do zgłoszenia.
- Powiadomienia e-mail/SMS o zmianie statusu.
- Edycja lub usuwanie złożonego zgłoszenia przez Klienta.

### Endpointy API (system zgłoszeń)

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | /api/complaints?clientId={id} | Pobranie zgłoszeń klienta |
| POST | /api/complaints | Utworzenie nowego zgłoszenia |

### Kryteria DONE
1. Zalogowany Klient widzi listę swoich towarów pobraną z systemu logistycznego i może złożyć zgłoszenie — po wysłaniu widzi potwierdzenie z numerem zgłoszenia.
2. Klient na ekranie „Moje zgłoszenia" widzi wyłącznie swoje zgłoszenia z aktualnymi statusami, a przy zgłoszeniach ze statusem ROZPATRZONE widzi rezultat (UZNANE / ODRZUCONE).
3. Niezalogowany użytkownik nie ma dostępu do żadnego ekranu Klienta.

### Podsumowanie przepływu
Przepływ po zalogowaniu jest liniowy: wybór towaru → opis problemu → potwierdzenie. Identyfikacja klienta odbywa się automatycznie na podstawie sesji — klient nie musi podawać swojego numeru. Lista towarów pochodzi z systemu logistycznego, co eliminuje ręczne wpisywanie danych.

---

## Feature: Składanie zgłoszenia przez Kierowcę

### Cel funkcjonalności
Dla Kierowcy firmy logistycznej — umożliwienie elektronicznego zgłoszenia problemu z dostawą, eliminując papierowy formularz i konieczność fizycznego dostarczania dokumentu do siedziby firmy.

### Punkt wejścia
Kierowca jest zalogowany w systemie (po przejściu Feature „Logowanie").

### Warunek zakończenia
Kierowca złożył zgłoszenie i widzi potwierdzenie z numerem zgłoszenia.

### Przepływ użytkownika (Happy Path)

**Ekran 1: Lista towarów / Strona główna Kierowcy**
- Cel: Kierowca wskazuje, którego towaru/zlecenia dotyczy problem
- Widoczne elementy:
  - Nagłówek z numerem kierowcy i nazwiskiem (pobranymi z systemu logistycznego na podstawie `externalId` zalogowanego użytkownika)
  - Lista towarów obsługiwanych przez kierowcę (każdy element wyświetla numer towaru `number`)
  - Przycisk „Wyloguj"
- Akcja: Kierowca klika na wybrany towar z listy
- Przejście: System pobiera dane towaru z API (`GET /api/drivers/{externalId}/goods`). Po wybraniu towaru → Ekran 2

**Ekran 2: Formularz zgłoszenia**
- Cel: Kierowca opisuje problem z dostawą
- Widoczne elementy:
  - Nagłówek z numerem towaru
  - Pole „Opis problemu" (textarea, wymagane, maks. 2000 znaków)
  - Przycisk „Wyślij zgłoszenie"
  - Przycisk „Anuluj" (powrót do Ekranu 1)
- Akcja: Kierowca wypełnia opis problemu i klika „Wyślij zgłoszenie"
- Przejście: System zapisuje zgłoszenie ze statusem NOWE → Ekran 3

**Ekran 3: Potwierdzenie**
- Cel: Kierowca otrzymuje potwierdzenie złożenia zgłoszenia
- Widoczne elementy:
  - Komunikat „Zgłoszenie zostało złożone"
  - Numer zgłoszenia
  - Przycisk „Złóż kolejne zgłoszenie" (→ Ekran 1)
- Akcja: Kierowca klika przycisk lub wylogowuje się
- Przejście: Nawigacja do Ekranu 1

### Diagram przepływu

```
[Logowanie] → [Lista towarów] → [Formularz zgłoszenia] → [Potwierdzenie]
                                                                ↓
                                                          [Złóż kolejne]
                                                           → powrót do
                                                           listy towarów
```

### Stany brzegowe
- **Pusty stan:** Kierowca nie ma przypisanych towarów — Ekran 1 wyświetla komunikat „Brak towarów przypisanych do Twojego konta".
- **Stan błędu:** API systemu logistycznego niedostępne — wyświetlany komunikat „Nie można połączyć się z systemem. Spróbuj ponownie później." z przyciskiem „Spróbuj ponownie". Błąd zapisu zgłoszenia — komunikat „Nie udało się zapisać zgłoszenia. Spróbuj ponownie."
- **Reguły walidacji:** Opis problemu — wymagany, maks. 2000 znaków. Towar — wymagany (musi być wybrany z listy).
- **Ograniczenia dostępu:** Kierowca widzi wyłącznie towary przypisane do swojego `externalId` w systemie logistycznym. Dostęp wymaga zalogowania z rolą KIEROWCA.

### Używane dane

| Obiekt | Pole | Typ | Wymagane | Mutowalne po utworzeniu | Usuwalne | Źródło (SSoT) / Cel |
|--------|------|-----|----------|------------------------|----------|----------------------|
| Kierowca | id | integer | tak | nie | nie | system logistyczny (SSoT) |
| Kierowca | number | string | tak | nie | nie | system logistyczny (SSoT) |
| Kierowca | lastName | string | tak | nie | nie | system logistyczny (SSoT) |
| Towar | id | integer | tak | nie | nie | system logistyczny (SSoT) |
| Towar | number | string | tak | nie | nie | system logistyczny (SSoT) |
| Towar | clientId | integer | tak | nie | nie | system logistyczny (SSoT) |
| Towar | driverId | integer | tak | nie | nie | system logistyczny (SSoT) |
| Zgłoszenie | (struktura identyczna jak w Feature „Klient") | | | | | |

### Założenia
- System automatycznie identyfikuje kierowcę na podstawie zalogowanego użytkownika (`externalId` → `driver.id` w systemie logistycznym).
- Jedno zgłoszenie dotyczy jednego towaru/zlecenia.
- Kierowca nie ma wglądu w status złożonych zgłoszeń (potwierdzone w analizie wymagań).
- Zgłoszenia nie mogą być usuwane.

### Poza zakresem
- Przegląd statusu złożonych zgłoszeń przez Kierowcę.
- Załączanie plików do zgłoszenia.
- Powiadomienia o statusie zgłoszenia.

### Endpointy API (system zgłoszeń)

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | /api/complaints | Utworzenie nowego zgłoszenia (wspólny z Feature „Klient") |

### Kryteria DONE
1. Zalogowany Kierowca widzi listę swoich towarów pobraną z systemu logistycznego i może złożyć zgłoszenie — po wysłaniu widzi potwierdzenie z numerem.
2. Kierowca widzi wyłącznie towary przypisane do niego w systemie logistycznym.
3. Niezalogowany użytkownik nie ma dostępu do żadnego ekranu Kierowcy.

### Podsumowanie przepływu
Przepływ po zalogowaniu jest trzyekranowy: lista towarów → formularz → potwierdzenie. Kierowca identyfikuje się automatycznie przez sesję. Brak ekranu przeglądu zgłoszeń — kierowca tylko składa zgłoszenia. Kluczowe ryzyko: kierowca w terenie może mieć słabe połączenie — stan błędu i komunikaty „spróbuj ponownie" są istotne.

---

## Feature: Panel Obsługi

### Cel funkcjonalności
Dla pracownika Obsługi firmy logistycznej — zapewnienie pełnego wglądu we wszystkie zgłoszenia w jednym miejscu, łatwe odnajdywanie zgłoszeń, dodawanie notatek, oznaczanie winnego, oraz rozpatrywanie zgłoszeń z ustaleniem rezultatu (uznane / odrzucone).

### Punkt wejścia
Pracownik Obsługi jest zalogowany w systemie (po przejściu Feature „Logowanie").

### Warunek zakończenia
Pracownik Obsługi przejrzał zgłoszenia, dodał notatki, określił winnego lub zmienił status wybranego zgłoszenia.

### Przepływ użytkownika (Happy Path)

**Ekran 1: Lista wszystkich zgłoszeń**
- Cel: Obsługa widzi wszystkie zgłoszenia i może szybko znaleźć potrzebne
- Widoczne elementy:
  - Tabela zgłoszeń z kolumnami: numer zgłoszenia, numer towaru, typ zgłaszającego (Klient/Kierowca), dane zgłaszającego (numer + nazwisko lub e-mail), status, rezultat (dla ROZPATRZONE: UZNANE/ODRZUCONE), data utworzenia
  - Pole wyszukiwania (przeszukuje: numer zgłoszenia, numer towaru, dane zgłaszającego)
  - Filtry: status (NOWE / W TRAKCIE / ROZPATRZONE / wszystkie), typ zgłaszającego (Klient / Kierowca / wszyscy)
  - Kolorowe oznaczenie statusów
  - Sortowanie po dacie utworzenia (domyślnie: najnowsze na górze)
  - Przycisk „Wyloguj"
- Akcja: Obsługa klika na wiersz zgłoszenia w tabeli
- Przejście: → Ekran 2 (szczegóły zgłoszenia)

**Ekran 2: Szczegóły zgłoszenia**
- Cel: Obsługa przegląda pełne dane zgłoszenia, dodaje notatki, ustala winnego, zmienia status i rezultat
- Widoczne elementy:
  - Sekcja „Dane zgłoszenia" (tylko odczyt): numer zgłoszenia, data utworzenia, typ zgłaszającego, dane zgłaszającego (numer, nazwisko/e-mail), numer towaru, opis problemu
  - Sekcja „Kto zawinił":
    - Dropdown „Wina" (KLIENT / FIRMA / NIKT / nieokreślone, edytowalny)
  - Sekcja „Status i rezultat":
    - Dropdown „Status" (NOWE / W TRAKCIE / ROZPATRZONE, edytowalny)
    - Dropdown „Rezultat" (UZNANE / ODRZUCONE, widoczny i wymagany tylko gdy status = ROZPATRZONE)
  - Sekcja „Notatki":
    - Lista istniejących notatek (każda: treść, autor, data dodania), posortowanych chronologicznie (najstarsza na górze)
    - Pole „Nowa notatka" (textarea, maks. 2000 znaków)
    - Przycisk „Dodaj notatkę"
  - Przycisk „Zapisz zmiany" (zapisuje status, rezultat, winę)
  - Przycisk „Powrót do listy" (→ Ekran 1)
- Akcja: Obsługa zmienia status/winę/rezultat i klika „Zapisz zmiany", lub wpisuje notatkę i klika „Dodaj notatkę"
- Przejście: System zapisuje zmiany, wyświetla komunikat „Zmiany zapisane" / „Notatka dodana". Obsługa może kliknąć „Powrót do listy" → Ekran 1

### Diagram przepływu

```
[Logowanie] → [Lista zgłoszeń] ──(klik na zgłoszenie)──→ [Szczegóły zgłoszenia]
                      ↑                                         │
                      │          (edycja statusu / winy /       │
                      │           rezultatu + zapis,            │
                      │           dodanie notatki)              │
                      │                                         │
                      └────────(powrót do listy)────────────────┘
```

### Stany brzegowe
- **Pusty stan:** Brak zgłoszeń w systemie — Ekran 1 wyświetla komunikat „Brak zgłoszeń w systemie". Wyszukiwanie bez wyników — komunikat „Nie znaleziono zgłoszeń pasujących do kryteriów". Zgłoszenie nie ma jeszcze notatek — sekcja notatek wyświetla komunikat „Brak notatek".
- **Stan błędu:** Błąd pobierania danych ze systemu logistycznego (np. dane klienta/kierowcy) — wyświetlane są dostępne dane lokalne z komunikatem „Nie udało się pobrać pełnych danych z systemu logistycznego". Błąd zapisu zmian — komunikat „Nie udało się zapisać zmian. Spróbuj ponownie." Błąd dodania notatki — komunikat „Nie udało się dodać notatki. Spróbuj ponownie."
- **Reguły walidacji:** Status — wymagany, musi być jedną z dozwolonych wartości. Rezultat — wymagany gdy status = ROZPATRZONE (system blokuje zapis statusu ROZPATRZONE bez wybranego rezultatu, wyświetlając komunikat „Wybierz rezultat rozpatrzenia: UZNANE lub ODRZUCONE"). Nowa notatka — maks. 2000 znaków, niepusta przy kliknięciu „Dodaj notatkę". Wina — opcjonalna (może pozostać nieokreślona).
- **Ograniczenia dostępu:** Panel Obsługi jest dostępny wyłącznie dla użytkowników z rolą OBSŁUGA. Obsługa ma wgląd do wszystkich zgłoszeń (bez ograniczeń per klient/kierowca). Niezalogowany użytkownik jest przekierowywany na ekran logowania.

### Używane dane

| Obiekt | Pole | Typ | Wymagane | Mutowalne po utworzeniu | Usuwalne | Źródło (SSoT) / Cel |
|--------|------|-----|----------|------------------------|----------|----------------------|
| Zgłoszenie | id | integer | tak | nie | nie | lokalna BD |
| Zgłoszenie | goodId | integer | tak | nie | nie | lokalna BD |
| Zgłoszenie | reporterType | enum (KLIENT, KIEROWCA) | tak | nie | nie | lokalna BD |
| Zgłoszenie | reporterId | integer | tak | nie | nie | lokalna BD |
| Zgłoszenie | description | string (maks. 2000 znaków) | tak | nie | nie | lokalna BD |
| Zgłoszenie | status | enum (NOWE, W_TRAKCIE, ROZPATRZONE) | tak | tak (tylko Obsługa) | nie | lokalna BD |
| Zgłoszenie | fault | enum (KLIENT, FIRMA, NIKT) | nie | tak (tylko Obsługa) | nie | lokalna BD |
| Zgłoszenie | resolution | enum (UZNANE, ODRZUCONE) | nie (wymagane gdy status = ROZPATRZONE) | tak (tylko Obsługa) | nie | lokalna BD |
| Zgłoszenie | createdAt | datetime | tak | nie | nie | lokalna BD |
| Notatka | id | integer | tak | nie | nie | lokalna BD |
| Notatka | complaintId | integer | tak | nie | nie | lokalna BD (referencja do Zgłoszenie.id) |
| Notatka | authorId | integer | tak | nie | nie | lokalna BD (referencja do Użytkownik.id) |
| Notatka | content | string (maks. 2000 znaków) | tak | nie | nie | lokalna BD |
| Notatka | createdAt | datetime | tak | nie | nie | lokalna BD |
| Klient | number, email | string | tak | nie | nie | system logistyczny (SSoT) — wyświetlane w szczegółach |
| Kierowca | number, lastName | string | tak | nie | nie | system logistyczny (SSoT) — wyświetlane w szczegółach |
| Towar | number | string | tak | nie | nie | system logistyczny (SSoT) — wyświetlany w liście i szczegółach |

### Założenia
- Obsługa nie tworzy zgłoszeń — jedynie je przegląda, uzupełnia i rozpatruje.
- Notatki są niezmienne po dodaniu (nie można edytować ani usuwać notatki).
- Dane klienta, kierowcy i towaru są pobierane z systemu logistycznego w czasie wyświetlania (nie kopiowane lokalnie).
- Zmiana statusu jest jednokierunkowa w typowym przepływie (NOWE → W TRAKCIE → ROZPATRZONE), ale system nie blokuje cofnięcia statusu.
- Przy cofnięciu statusu z ROZPATRZONE na inny, pole `resolution` jest czyszczone.
- Zgłoszenia nie mogą być usuwane.

### Poza zakresem
- Przypisywanie zgłoszeń do konkretnych pracowników obsługi.
- Historia zmian statusu (audit log).
- Eksport listy zgłoszeń do pliku.
- Statystyki i raporty.
- Edycja lub usuwanie notatek.

### Endpointy API (system zgłoszeń)

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | /api/complaints | Pobranie wszystkich zgłoszeń (z opcjonalnymi filtrami: status, reporterType, wyszukiwanie) |
| GET | /api/complaints/{id} | Pobranie szczegółów zgłoszenia |
| PATCH | /api/complaints/{id} | Aktualizacja statusu, winy i/lub rezultatu |
| GET | /api/complaints/{id}/notes | Pobranie notatek do zgłoszenia |
| POST | /api/complaints/{id}/notes | Dodanie notatki do zgłoszenia |

### Kryteria DONE
1. Pracownik Obsługi widzi tabelę wszystkich zgłoszeń z filtrami i wyszukiwaniem; może otworzyć szczegóły, zmienić status, ustawić winę i dodać notatkę — zmiany są natychmiast widoczne.
2. Przy próbie ustawienia statusu ROZPATRZONE bez wybranego rezultatu (UZNANE / ODRZUCONE) system blokuje zapis i wyświetla komunikat walidacyjny.
3. Zmiana statusu i rezultatu zgłoszenia przez Obsługę jest widoczna dla Klienta na jego liście zgłoszeń (Ekran 4, Feature „Klient").

### Podsumowanie przepływu
Przepływ jest dwuekranowy: lista → szczegóły → powrót do listy. Ekran szczegółów łączy trzy niezależne akcje: zmiana statusu/winy/rezultatu (jedno zapisanie), dodawanie notatek (osobne zapisywanie). Walidacja rezultatu przy ROZPATRZONE wymusza świadomą decyzję. Notatki dają historię obsługi zgłoszenia bez formalnego audit logu.

---

## Feature: Panel Administracyjny

### Cel funkcjonalności
Dla Admina — umożliwienie zarządzania kontami pracowników Obsługi (tworzenie, edycja, dezaktywacja) oraz synchronizacji kont Klientów i Kierowców z systemu logistycznego, tak aby każdy użytkownik mógł uzyskać dostęp do systemu.

### Punkt wejścia
Admin jest zalogowany w systemie (po przejściu Feature „Logowanie" z rolą ADMIN).

### Warunek zakończenia
Admin utworzył lub zaktualizował konto pracownika Obsługi, lub przeprowadził synchronizację z systemem logistycznym.

### Przepływ użytkownika (Happy Path)

**Ekran 1: Lista użytkowników**
- Cel: Admin przegląda wszystkich użytkowników systemu
- Widoczne elementy:
  - Tabela użytkowników z kolumnami: login, rola, status (aktywny / nieaktywny), flaga „wymaga zmiany hasła" (tak/nie)
  - Filtr roli (OBSŁUGA / KLIENT / KIEROWCA / wszyscy)
  - Filtr statusu (aktywny / nieaktywny / wszyscy)
  - Przycisk „Dodaj pracownika Obsługi" (→ Ekran 2)
  - Przycisk „Synchronizuj Klientów i Kierowców" (→ Ekran 4)
  - Kliknięcie wiersza z rolą OBSŁUGA → Ekran 3 (edycja)
  - Przycisk „Wyloguj"
- Akcja: Admin klika jeden z przycisków lub wiersz w tabeli
- Przejście: zgodnie z wybraną akcją

**Ekran 2: Formularz tworzenia konta Obsługi**
- Cel: Admin tworzy nowe konto pracownika Obsługi
- Widoczne elementy:
  - Pole „Login" (text input, wymagane, unikalny w systemie)
  - Pole „Hasło tymczasowe" (password input, wymagane)
  - Informacja: „Pracownik będzie zobowiązany do zmiany hasła przy pierwszym logowaniu"
  - Przycisk „Utwórz konto"
  - Przycisk „Anuluj" (→ Ekran 1)
- Akcja: Admin wypełnia dane i klika „Utwórz konto"
- Przejście: System tworzy konto z rolą OBSŁUGA, `isActive = true`, `mustChangePassword = true` → komunikat „Konto zostało utworzone" → Ekran 1

**Ekran 3: Edycja konta Obsługi**
- Cel: Admin zmienia hasło lub dezaktywuje konto pracownika Obsługi
- Widoczne elementy:
  - Nagłówek z loginem pracownika (tylko odczyt)
  - Sekcja „Reset hasła":
    - Pole „Nowe hasło tymczasowe" (password input, opcjonalne)
    - Przycisk „Zapisz nowe hasło" (aktywny tylko gdy pole niepuste)
    - Informacja: „Pracownik będzie zobowiązany do zmiany hasła przy następnym logowaniu"
  - Sekcja „Status konta":
    - Aktualny status: aktywny / nieaktywny
    - Przycisk „Dezaktywuj konto" (widoczny gdy konto aktywne) lub „Aktywuj konto" (widoczny gdy konto nieaktywne)
  - Przycisk „Powrót do listy" (→ Ekran 1)
- Akcja: Admin resetuje hasło lub zmienia status konta
- Przejście: System zapisuje zmiany → komunikat „Zmiany zapisane" → Admin pozostaje na Ekranie 3

**Ekran 4: Synchronizacja Klientów i Kierowców**
- Cel: Admin uruchamia synchronizację kont z systemem logistycznym
- Widoczne elementy:
  - Informacja o ostatniej synchronizacji (data i godzina ostatniego uruchomienia lub „Nigdy")
  - Opis mechanizmu: „Synchronizacja pobiera listę klientów i kierowców z systemu logistycznego. Nowe osoby otrzymują konto z loginem równym ich numerowi i hasłem tymczasowym równym ich numerowi. Osoby usunięte z systemu logistycznego mają konto dezaktywowane."
  - Przycisk „Uruchom synchronizację"
  - Wyniki ostatniej synchronizacji (widoczne po jej wykonaniu): liczba nowo utworzonych kont, liczba dezaktywowanych kont, liczba kont bez zmian
  - Przycisk „Powrót do listy" (→ Ekran 1)
- Akcja: Admin klika „Uruchom synchronizację"
- Przejście: System wywołuje `GET /api/clients` i `GET /api/drivers`, przetwarza różnice (opis poniżej w Założeniach) → wyświetla wyniki na tym samym ekranie

### Logika synchronizacji

```
Dla każdego klienta z GET /api/clients:
  - Jeśli brak konta z externalId = client.id i role = KLIENT
    → utwórz konto: login = client.number, hasło = client.number,
      mustChangePassword = true, isActive = true
  - Jeśli konto istnieje → bez zmian (nie nadpisuj hasła)

Dla każdego kierowcy z GET /api/drivers:
  - Analogicznie: login = driver.number, hasło = driver.number

Dla każdego konta KLIENT/KIEROWCA w lokalnej BD:
  - Jeśli brak odpowiednika w systemie logistycznym → isActive = false
```

### Diagram przepływu

```
[Logowanie ADMIN] → [Lista użytkowników]
                           │
              ┌────────────┼────────────────────┐
              ↓            ↓                    ↓
     [Tworzenie konta]  [Edycja konta]  [Synchronizacja]
        Obsługi           Obsługi        Klientów/Kierowców
              │            │                    │
              └────────────┴────────────────────┘
                           ↓
                   [Lista użytkowników]
```

### Stany brzegowe
- **Pusty stan:** Brak użytkowników poza Adminem — tabela wyświetla tylko konto admina z komunikatem „Brak innych użytkowników. Dodaj pracownika Obsługi lub uruchom synchronizację."
- **Stan błędu:** Login już istnieje przy tworzeniu konta — komunikat „Podany login jest już zajęty. Wybierz inny." API systemu logistycznego niedostępne podczas synchronizacji — komunikat „Nie udało się połączyć z systemem logistycznym. Synchronizacja przerwana. Spróbuj ponownie." Błąd zapisu — komunikat „Nie udało się zapisać zmian. Spróbuj ponownie."
- **Reguły walidacji:** Login (Obsługa) — wymagany, unikalny w systemie, niepusty. Hasło tymczasowe — wymagane przy tworzeniu, niepuste; opcjonalne przy edycji (reset tylko jeśli pole wypełnione). Synchronizacja nie nadpisuje istniejących haseł.
- **Ograniczenia dostępu:** Panel Administracyjny dostępny wyłącznie dla użytkowników z rolą ADMIN. Admin nie może edytować loginów ani danych kont KLIENT/KIEROWCA — te dane są własnością systemu logistycznego (SSoT).

### Używane dane

| Obiekt | Pole | Typ | Wymagane | Mutowalne po utworzeniu | Usuwalne | Źródło (SSoT) / Cel |
|--------|------|-----|----------|------------------------|----------|----------------------|
| Użytkownik | id | integer | tak | nie | nie | lokalna BD |
| Użytkownik | login | string (unikalny) | tak | nie (login niezmienny po utworzeniu) | nie | lokalna BD |
| Użytkownik | passwordHash | string | tak | tak (reset przez ADMIN dla OBSŁUGA) | nie | lokalna BD |
| Użytkownik | role | enum (KLIENT, KIEROWCA, OBSŁUGA, ADMIN) | tak | nie | nie | lokalna BD |
| Użytkownik | externalId | integer (nullable) | dla KLIENT/KIEROWCA: tak; dla OBSŁUGA/ADMIN: nie | nie | nie | lokalna BD |
| Użytkownik | isActive | boolean | tak | tak (ADMIN) | nie | lokalna BD |
| Użytkownik | mustChangePassword | boolean | tak | tak (system) | nie | lokalna BD |
| Klient | id, number | integer, string | tak | nie | nie | system logistyczny (SSoT) — odczyt przy synchronizacji |
| Kierowca | id, number | integer, string | tak | nie | nie | system logistyczny (SSoT) — odczyt przy synchronizacji |

### Założenia
- W systemie istnieje co najmniej jedno konto z rolą ADMIN — zakładamy, że zostało utworzone podczas wdrożenia (seed danych).
- Admin nie może dezaktywować własnego konta (ochrona przed zablokowaniem dostępu do panelu).
- Login kont KLIENT i KIEROWCA jest niezmienny — pochodzi z systemu logistycznego i jest równy `number`.
- Hasło tymczasowe klientów i kierowców = ich `number` (np. „C001"). Admin widzi tę zasadę opisaną na ekranie synchronizacji i może ją przekazać użytkownikom.
- Synchronizacja jest idempotentna — wielokrotne uruchomienie nie tworzy duplikatów ani nie nadpisuje haseł już ustawionych przez użytkownika.
- Konto ADMIN nie może być tworzone ani zarządzane przez Panel Administracyjny — konto admina jest zakładane podczas wdrożenia systemu.

### Poza zakresem
- Automatyczna (harmonogramowana) synchronizacja — wyłącznie synchronizacja ręczna triggerowana przez Admina.
- Wysyłka e-mail z hasłem tymczasowym — system logistyczny nie udostępnia tej możliwości.
- Zarządzanie rolą ADMIN przez Panel Administracyjny.
- Usuwanie kont użytkowników.

### Endpointy API (system zgłoszeń)

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | /api/admin/users | Pobranie listy wszystkich użytkowników (z filtrami: role, isActive) |
| POST | /api/admin/users | Utworzenie konta pracownika Obsługi |
| PATCH | /api/admin/users/{id} | Aktualizacja konta (reset hasła, zmiana isActive) |
| POST | /api/admin/sync | Uruchomienie synchronizacji Klientów i Kierowców z systemu logistycznego — zwraca wyniki (created, deactivated, unchanged) |

### Kryteria DONE
1. Admin może utworzyć konto pracownika Obsługi z loginem i hasłem tymczasowym — pracownik przy pierwszym logowaniu jest zmuszony zmienić hasło.
2. Po uruchomieniu synchronizacji nowi klienci i kierowcy z systemu logistycznego otrzymują konta (login = number, hasło tymczasowe = number, mustChangePassword = true); konta osób usuniętych z systemu logistycznego są dezaktywowane; istniejące konta pozostają bez zmian. Wyniki synchronizacji są wyświetlone Adminowi.
3. Admin może dezaktywować konto pracownika Obsługi — po dezaktywacji pracownik nie może się zalogować i widzi komunikat o dezaktywacji konta.

### Podsumowanie przepływu
Panel Administracyjny obsługuje dwa rozłączne przypadki: ręczne zarządzanie kontami Obsługi (tworzenie + reset hasła + dezaktywacja) oraz synchronizację z systemem logistycznym dla Klientów i Kierowców. Synchronizacja jest jedynym punktem, gdzie dane z zewnętrznego SSoT przepływają do lokalnej bazy — ale tylko `id` i `number` (jako login), bez kopiowania danych profilowych, które zawsze pobierane są na żywo.

---

## Wymagania niefunkcjonalne

Wyłącznie wymagania wynikające bezpośrednio z dokumentów źródłowych i ustaleń z interesariuszem:

- **NFR-1:** Interfejsy Klienta i Kierowcy muszą być responsywne — dostosowane zarówno do urządzeń mobilnych, jak i desktopowych (źródło: analiza wymagań, pkt 7).
- **NFR-2:** System musi integrować się z systemem logistycznym przez API REST z autoryzacją kluczem `X-API-KEY` (źródło: `openapi.yaml`).
- **NFR-3:** Dane klientów, kierowców i towarów/zleceń są pobierane z systemu logistycznego, który jest jedynym źródłem prawdy (SSoT) dla tych danych (źródło: analiza wymagań, pkt 7).
- **NFR-4:** Dostęp do każdej części systemu wymaga wcześniejszego zalogowania. Dane logowania (login, hasło) przechowywane są lokalnie (źródło: ustalenia z interesariuszem).
- **NFR-5:** Zgłoszenia nie mogą być usuwane — pozostają w systemie bezterminowo (źródło: ustalenia z interesariuszem).
- **NFR-6:** Konta użytkowników nie mogą być usuwane — mogą być wyłącznie dezaktywowane (źródło: ustalenia z interesariuszem).

## Otwarte pytania

Brak — wszystkie pytania z wersji 1.0 zostały rozstrzygnięte w ustaleniach z interesariuszem.
