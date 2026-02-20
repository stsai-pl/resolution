# System do zgłoszeń problemów z dostawami dla firmy logistycznej

1. Problem (objawy):
   Zgłoszenia problemów z dostawami giną, tracimy dużo czasu na zdobywanie informacji, tworzenie, a potem szukanie, klienci są sfrustrowani złą obsługą reklamacyjną, a kierowcy brakiem jasnej ścieżki i biurokracją.
2. Przyczyny:
   Problem istnieje, ponieważ odpowiedzialność jest rozmyta i nie ma jednego miejsca do zgłaszania i wglądu do zgłoszeń.
3. Interesariusze:
   Klient - zgłasza reklamacje, ma wgląd do statusu
   Kierowca - zgłasza reklamacje,
   Obsługa - ma pełny wgląd, uzupełnia szczegóły, rozpatruje/zmienia status
4. Proces as-is:
	1. Kierowca lub Klient: wypełnia papierowy formularz, 
	2. Dostarcza fizycznie do firmy (klient pocztą, kierowca kiedy ma czas zajechać do siedziby) 
	3. Dokument trafia do szafy dokumentów oczekujących, 
	4. Pani Basia wprowadza dokument do systemu
	5. Dokument może być rozpatrzony przez obsługę
5. Cele użytkowników:
   Klient: Łatwe i szybkie zgłoszenie (elektroniczne), dostęp do statusu
   Kierowca: Łatwe i szybkie zgłoszenie (elektroniczne)
   Obsługa: Dostęp do wszystkiego w jednym miejscu, łatwe odnajdywanie zgłoszeń, brak redundancji w działaniu
6. Zakres:
   Centralna baza zgłoszeń + interfejsy Klienta, Kierowcy, Obsługi
7. Ograniczenia i warunki:
   Integracja z systemem logistycznym (identyfikacja klienta, towaru/zlecenia, kierowcy) - system logistyczny jest SSoT dla tych danych. Dokumentacja API systemu logistycznego znajduje się w openapi.yaml
   Interfejsy kierowcy i klienta muszą być responsywne, dostosowane zarówno do mobile jak i desktop
   Klient ma dostęp wyłącznie do swoich zleceń. Kierowca ma dostęp wyłącznie do obsługiwanych przez niego zleceń.
   
   
   
   
   
   