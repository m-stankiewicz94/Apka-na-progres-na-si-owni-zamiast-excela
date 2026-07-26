# Trening — dziennik siłowni (PWA)

Mobilna aplikacja webowa zastępująca arkusz Excel z planem treningowym.
Działa w 100% offline po pierwszym otwarciu, dane trzyma lokalnie w telefonie
(`localStorage`, klucze z prefiksem `gym.`). Bez backendu, bez logowania,
bez frameworków — czysty HTML + CSS + JS.

**Aplikacja:** https://m-stankiewicz94.github.io/Apka-na-progres-na-si-owni-zamiast-excela/

## Funkcje

- Plan A / B / C (klatka+plecy I, nogi+barki, klatka+plecy II) wbudowany na sztywno
- Zapis wyników: ciężar + powtórzenia na serię, steppery ±2,5 kg, „Powtórz ostatnie"
- Sugestie progresji (+2,5 kg góra ciała / +5 kg nogi) gdy wszystkie serie na górze zakresu
- Cykl 8-tygodniowy z deloadem w tygodniu 8 (połowa serii, −30% ciężaru)
- Timer przerwy po odhaczeniu serii (wyłączany w ustawieniach)
- Autozapis szkicu treningu — nic nie ginie po zablokowaniu ekranu
- Bieganie (czas, dystans, tętno, samopoczucie, tempo min/km) i pomiary ciała
  (waga, pas, klatka, biceps, biodra, udo, łydka) z wykresami SVG
- Historia każdego ćwiczenia z mini-wykresem progresu
- Eksport/import kopii JSON, eksport CSV (średniki, UTF-8 z BOM — otwiera się w polskim Excelu)
- Zakładka „Instrukcja" — zasady progresji (RIR 1–2), deload, plan tygodnia i szybki zapis treningu

## Pliki

| Plik | Rola |
|---|---|
| `index.html` | szkielet aplikacji, dolna nawigacja |
| `app.js` | cała logika: plan, ekrany, magazyn danych, wykresy, eksporty |
| `style.css` | ciemny motyw, mobile-first |
| `manifest.json` | manifest PWA (instalacja na ekranie głównym) |
| `sw.js` | service worker — cache offline (przy zmianach podbij `CACHE` w środku) |
| `icons/` | ikony aplikacji |
| `.github/workflows/deploy.yml` | automatyczne wdrożenie na GitHub Pages po pushu |

## Zmiany

Wystarczy edytować pliki i zrobić push — GitHub Actions samo wdroży nową wersję
na GitHub Pages. Po zmianie `app.js`/`style.css` podbij wersję cache w `sw.js`
(np. `gym-v1` → `gym-v2`), żeby telefony pobrały nową wersję.
