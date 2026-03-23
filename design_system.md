# Resolution - Design System

Poniższy dokument szczegółowo definiuje wysoce abstrakcyjną warstwę wizualną ("Look & Feel") dla nowej aplikacji Resolution. Dokument oparty jest na prototypie wizualnym, ale wyciąga z niego czyste, niezależne od kontekstu wzorce, które można (i należy) powielać na wszystkich nowych widokach produkcyjnych.

---

## 1. Zmienne Globalne i Fundamenty (Design Tokens)

### 1.1 Kolorystyka i Powierzchnie (Surface Philosophy)
Aplikacja oparta jest na nowoczesnym "stapiajacym się" (flat) minimalizmie. Płaszczyzny są w odcieniach chłodnej szarości i czystej bieli, przełamywane stanowczym granatowym akcentem marki. 

**Główne kolory marki i layoutu:**
* **Tło aplikacji (Background Base):** `#f3f2f2` - jasna, neutralna szarość pełniąca rolę płótna głównego.
* **Powierzchnia Boczna (Surface Low):** `#f3f3f3` - stosowana dla Menu Głównego, by delikatnie oddzielić je od płótna.
* **Powierzchnia Średnia (Surface High):** `#eeeeee`
* **Powierzchnia Najwyższa (Surface Lowest):** `#ffffff` - czysta biel, bezkompromisowo stosowana do budowy komponentów nadrzędnych: kontenerów roboczych, tabel, widgetów na ekranie szczegółów.

**Akcenty (Brand & Accents):**
* **Primary (Główny Kolor):** `#00113a` (bardzo ciemny navy/granat).
* **Primary Container:** `#1a237e`
* **Primary Gradient:** Główne przyciski i stany mocno aktywne (jak wybrane podstrony menu) zbudowane są z tła: `linear-gradient(135deg, #00113a 0%, #1a237e 100%)`.
* **Secondary (Poboczny):** `#6e7694` - bezpieczny, fioletowo-szary kolor ikon i akcji nieinwazyjnych.

**Typografia i Tekst (On-Surface):**
* **Tekst główny:** `#1a1c1c` - domyślnie "prawie" czysto czarny.
* **Tekst wyciszony (Muted/Variant):** `#6b7280` - wyszarzony, uzywany dla dat, labeli dodatkowych, podpisów.

**Obramowania i Cienie (Całkowity Minimalizm):**
Interfejs domyślnie nakazuje UNIKAĆ twardych, rzucających się w oczy ramek o jednolitym kolorze.
* **Ghost Border:** `rgba(198, 197, 212, 0.15)` - ultra-delikatna linia, używana wokół wewnątrz-ekranowych form i kart. Mają stwarzać wrażenie wtopienia się w białe tło.
* **Delicate Border:** `rgba(0, 0, 0, 0.06)` - kreska pionowa odcinania głównego sidebaru od zawartości bazowej.
* **Podświetlenie (Hover Glow):** `rgba(76, 86, 175, 0.05)` - lekkie zabarwienie np. linku przy wskazaniu myszką.

### 1.2 Kolory Semantyczne (Pigułki Statusów i Logiki)
Tło dla elementów uświadamiających o ich stanie biznesowym składa się z pastelowego, transparentnego wypełnienia, na którym leży niesłychanie nasycony kolor tej samej barwy (soft-colors pattern).
* **Stan Inicjujący / Neutralny:** Tło: `#e0f2fe`, Tekst: `#0369a1`
* **Stan w Procesie / Uwaga:** Tło: `#fef3c7`, Tekst: `#b45309`
* **Stan Pozytywny / Zakończenie:** Tło: `#dcfce7`, Tekst: `#15803d`
* **Stan Błędu / Odrzucenia:** Tło: `#fee2e2`, Tekst: `#b91c1c`

### 1.3 Typografia
Obowiązuje nowoczena, czysta czcionka bezszeryfowa: **Inter**. Zdefiniowano konkretne skale, które zakazują ręcznego formatowania każdego napisu:
* **Headline Large (H1):** 2.0rem (32px), Bold (700), `line-height: 1.2`, `-0.02em` odstępu. (Używane np. do głównego wezwania "Zgłoszenia").
* **Headline Medium (H2):** 1.5rem (24px), Bold (700). (Tytuły precyzyjne dokumentów).
* **Title Medium / Headline Small:** 1.125rem - 1.25rem, Semi-bold (600).
* **Body Large (Tekst główny powiększony):** 1.0rem (16px), Regular (400).
* **Body Medium (Tekst interfejsów):** 0.875rem (14px), Regular (400) – ten font wypełnia całe tabele danych, wnętrza notatek, komunikaty.
* **Label Small (Etykiety Precyzyjne):** 0.6875rem (11px), Semi-bold (600), **ALL CAPS**, lekko rozstrzelona `letter-spacing: 0.05em`. Zazwyczaj powiązana z kodem koloru Muted (`#6b7280`). Oznacza nagłówki w tabelach, podpisy pól formularzy formularzy.

### 1.4 Przestrzeń i Promienie Zaokrągleń
Przestrzeń definiowana "oddechem", bardzo napowietrzona. Zmienne `sm` (8px), `md` (16px), `lg` (~21px), `xl` (32px), `xxl` (56px) nakładane na margin/gap/padding.

**Promienie zaokrągleń rogów (Border Radius):**
* `sm` (8px) – delikatne. Komponenty hover/listy.
* `md` (16px) – główny wymiar ujednolicający kontener roboczy tabel ułożony na szarym tle, obrysy form regularnych i wszystkie karty modułowe.
* `xl` (48px) – specyficzny kształt używany do "pasków wyszukiwarki" na ekranach lisy i filtrów. Daje dużą pigułę po lewej stronie toolbaru.
* `full` (9999px) – absolutnie zaokrąglona kapsułka. Rezerwowane WYŁĄCZNIE dla głównych przycisków zatwierdzeń (CTA) i malutkich odznak (badge'y). 

---

## 2. Layout i Układy Ekranów (Archetypy)

### 2.1 Architektura Makro Ekranu
* **Nawigacja Boczna (Sidebar):** Stała szerokość 280px. Pamięta o z-indexach, izolowana delikatną 6% poziomą krechą pionową, tło `#f3f3f3`. Znajduje się tam **Komponent Awatara Użytkownika** jako wizualny standard (idealne koło wymiaru ok. 40x40px, wyśrodkowany akronim imienia, tło z primary-gradient).
* **Przestrzeń Robocza (Main Content):** 100% responsywności przez Flex. Posiada twarde i hojne odsunięcie wewnątrz równe `2.5rem` góra vs `3.0rem` boki.

### 2.2 Wzorzec: Widok Listy Głównej (List View)
1. **Toolbary (Narzędziownik nad Listami):**
   * Wykorzystuje wzorzec Flexbox "Space-between".
   * **Po lewej:** Formularz "Szukaj". Zbudowany na skrajnym radiusie `xl` udającym okrągłą listwę. Wewnątrz wpisana ikona szkła powiększającego, a tekst lekko oddalony by na nią nie wchodzić.
   * **Po prawej:** Grupa Pól Akcji (Select/Filter). Oparte o mikro-układ "Etykieta Muted (Label Small)" leżąca obok Selecta na białym tyle bez obramowań.
2. **Karta Tabeli:** W przypadku prezentacji wierszy (lista elementów), Tabela leży *we własnej, pojedynczej bryle karty* (Białe Tło, radius md, brak linii dookoła - ghost border zaledwie). Same wiersze zachowane są bez tła. 

### 2.3 Wzorzec: Widok Szczegółów Podmiotu (Details View)
1. **Nagłówek Detali:** Posiada przycisk powrotny z lewej. Tekst tytułu dokumentu operującego wymuszany jest na ułożenie na *idealnym centrum ekranu* (matematycznie na osi). Od AI na etapie dewelopmentu wymaga to balastowania prawej strony niewidzialnym div'em o szerokości zbliżonej lewego guziczka Powrotu, aby moduł środkowy wyśrodkował układ.
2. **Podwójny Układ Siatki (Grid):** Duże monitory wykorzystują grid dwukolumnowy np. 2fr / 1.2fr. 
   - Lewa przeważnie trzyma ciężkie moduły wizualne (Dane obiektów, Panele decyzyjne).
   - Prawa zachowana jest zwykle na pociągłe informacje osiowe, komentarze lub akcje drugorzędne. Poniżej rozdzielczości `1024px` układ zjeżdża do połączonej 1 kolumny.

---

## 3. Komponenty UI Wzorca

### 3.1 Kontrola Przyciskowa (Buttons i Akcje)
* **Główne Przyciski (Primary CTA):** Tło gradientowe `Primary Gradient`, twarde zaokrąglenie `full`. Biały czysty napis (rozmiar 14px bez pogrubienia max, max wagą jest weight: 500). Rośnie po najechaniu, zdobywając ultra-miękki cień dolny.
* **Secondary:** Gradient i obwódka nie istnieją - są zastąpione czcionką z kolorem na przezroczystym tle.
* **POZYCJONOWANIE:** Główna i żelazna zasada UI - **Wszelkie przyciski zatwierdzeń (np. "Zapisz", "Aktualizuj", "Dodaj") na każdym koncie widoku interfejsu i panelach / widgetach są bezwzględnie wyrównywane do prawej krawędzi formy**. (`justify-content: flex-end`).

### 3.2 Moduły Formularzowe i Kontenerowe
* **Inputy:** Kształt to rygor zaokrągleń 16px. Kolor czysto biały. Ramka prawie transparentna chroniąca jedynie jasnobłotniste płótno. W momencie uaktywnienia kontrolki, ramka wyrazista `rgba(198,197,212, 0.4)` odrzucając obrys, a sam moduł dostaje wypychanego w twarz cienia.
* **Selecty:** Zero natywnych szarych stylów systemu. Wewnątrz SVG customowego grota w szarym wciszonym kolorze.

### 3.3 Karty i Komponenty Płaskie (Flat Design)
Aplikacja jest płaska konstrukcyjnie. Biały panel leży na minimalnie szarym panelu głównym z paddingiem 24-32 piksele do wewnątrz. Znika uderzający Outline ramy.
* **Gesty Modułów Dodatkowych (Załączniki / Zestawy):** Reprezentacja spójna w strukturę ikona->tytuł->akcja prawej krawędzi (np. w jednym rzędzie: wyszarzone SVG załącznika, pośrodku nazwa pliku czcionką 14px, po prawej do samej ściany odsuwana jest ikona ściągania - przycisk poboczny).

### 3.4 Pigułki Oznaczające (Badges)
Posiadają kapsułkowy charakter okrążeń (Border=9999px). Są dwóch wariantów:
* Twarde wygaszenie pastelowych teł dla głównego odnalezienia w gąszczu z jaskrawym tekstem,
* **Pigułki Konturowe (Outline):** Zachowania z zachowaniem wyłącznie cienkiej granicy używane jako poboczne ułatwiacze "pomagacze". Jeśli obiekt główny jest "Rozpatrzony", obok może leżeć obrys "Uznany" lub "Odrzucony" bazując na zwykłym ramkowaniu o tych samych barwach sukcesu.

### 3.5 Tabele Danych (No-Line Architecture)
Bezwzględny brak konwencjonalnych ramek i urojonych obrysów rodem z baz danych.
1. Cała tabela leży we własnej białej bryczce (kontener Card-like).
2. **Nagłówek:** Linijka tekstu zbudowana czcionką Label Small (AllCaps, szerokie światło) posiada sortowniki i jest ucięta pod sobą znikomą grubości 0.5px jasną kreseczką.
3. **Wiersze Table (Row):** Brak jakiegokolwiek tła oraz wyzerowane poboczne odstępy od matrycy kolumnowej. Elementy leżące w komórkach ZAWSZE dobiegają naturalnie wyrównane w lewo.
4. **Reakcja Hover:** Najwyższej delikatności. Najechanie na wpis odpycha go natychmiast lekko ku górze - i bezszelestnie zabarwia sam tekst wskaźnika w barwę marynistycznego navy (`color: navy`). Zero kolorowania całych brył tła.

### 3.6 Oś Przebiegu (Timeline Pattern)
Używane często do historii działań po prawej osi detalu.
1. Cała konstrukcja pnie się na nieuchwytnie wąziutkiej nitce kolorystycznej (Ostrzegawczej Barwy 2px w tle).
2. Reprezentowane kroki objawiają się tłem kuleczek na tej nici. Kuleczki wyrywa ze swojego systemu `10px` szerokości powloką "ciężkiego i grubego 2px" wyciętego tła bieli. Trawa szumi niemożliwie czystą lekkością. 

---

## 4. Ikonografia Systemu
System preferuje w całej swojej masie grafiki bazujące na Zarysie (Outline Format). W 100% z wykorzystaniem formatu Scalable Vector Graphics, dążącym do optyki dwóch punktów grubości obrysu (`stroke-width="2"`). Rogi graficzne nie kłują, lecz wyginają rzece `stroke-linejoin="round"`. 

---

## 5. System Animacji Zdarzeń
Ułamek dziesiętnych to twarda zasada spójności. 0.3s gładkiego rozjaśniania (FadeIn) przy wsuwaniai nowych okien z lekkim 8 pikselowym odbiciem od dołka, tworząc czyste wrażenie profesjonalnych powiadomień Toost z `0.3-sekundowym przesuwem w dół` przy kasacji. Animacje Hover to natywne 0.2s miękkości z domyślnego mechanika przeglądarki.
