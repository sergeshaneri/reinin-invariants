# Tetrachotomy Doc Extract

Source: https://docs.google.com/document/d/1bt9jk6nMrItqNc53EelQxJjZmiepyL3uEJlfv5pXEqU/edit?tab=t.0

Raw extraction from DOCX export. Cell fill colors were read from `word/document.xml` `w:tcPr/w:shd/@w:fill`. Three near-identical manual shade variants were normalized: `6fa8dc -> 6d9eeb`, `f1c232 -> ffd966`, `b6d7a8 -> 93c47d`.

## 1. Table 1
- Formula: Верт = Бс/Пр Х Ит/Сн (1,а)
- Relation: (1) = (3) х (3)
- Nearby label: Стимульная группа
- $(@{color=4a86e8; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, EIE, LIE, IEE
- $(@{color=6aa84f; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LSI, ESI, SLI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, SLE, SEE, LSE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, IEI, ILI, EII

## 2. Table 2
- Formula: Верт = Дм/Ар Х +/- (2,с)
- Relation: (1) = 4 х 4
- Nearby label: парна к 20
- $(@{color=4a86e8; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, ESE, LIE, SEE
- $(@{color=6aa84f; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LII, ESI, ILI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, SLE, IEE, LSE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LSI, IEI, SLI, EII

## 3. Table 3
- Formula: Верт = Ус/Уп Х Лг/Эт (3,а)
- Relation: 1 = 3 х 3
- Nearby label: парна к 10. сб/об пц/рз бс/пр
- $(@{color=6aa84f; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, IEI, ESI, EII
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SLE, LIE, LSE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, EIE, SEE, IEE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, LSI, ILI, SLI

## 4. Table 4
- Formula: Верт = Сб/Об Х Кн/Эм (4,а)
- Relation: 1 = 3 х 3
- Nearby label: * вопросы с порядком цифрового кодирования
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, ESE, EIE, SLE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LII, LSI, IEI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LIE, SEE, IEE, LSE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESI, ILI, SLI, EII

## 5. Table 5
- Formula: Верт = Пц/Рз Х ?/! (5,c)
- Relation: 1 = 4 х 4
- Nearby label: функции объеденены верб, интро, контакт
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, EIE, SEE, LSE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LSI, ILI, EII
- $(@{color=cc4125; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, SLE, LIE, IEE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, IEI, ESI, SLI

## 6. Table 6
- Formula: Верт = Рс/Рш Х Тк/Ст (6,а)
- Relation: 1 = 3 х 3
- Nearby label: С4,1 группа - главная образующая группа социона
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, ESE, IEE, LSE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LII, SLI, EII
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, SLE, LIE, SEE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LSI, IEI, ESI, ILI

## 7. Table 7
- Formula: Верт = Наль Х Таль (7,c)
- Relation: 1 = 2 х 2
- Nearby label: “стили взаимодействия с обществом”
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SLE, SEE, IEE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, IEI, ILI, SLI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, EIE, LIE, LSE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, LSI, ESI, EII

## 8. Table 10
- Formula: Бс/Пр = Дм/Ар Х Ус/Уп (8,с)
- Relation: 3 = 4 х 3
- Nearby label: (2→2) X 4
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SEI, LIE, ESI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LII, SEE, ILI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, LSI, IEE, SLI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SLE, IEI, LSE, EII

## 9. Table 11
- Formula: Бс/Пр = +/- Х Лг/Эт (9,a)
- Relation: 3 = 4 х 3
- Nearby label: (4→4)x2
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LSI, LIE, SLI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, EIE, ESI, IEE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, IEI, SEE, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, SLE, ILI, LSE

## 10. Table 12
- Formula: Бс/Пр = Сб/Об Х Пц/Рз (10,a)
- Relation: 3 = 3 х 4
- Nearby label: D8,4
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SEI, EIE, LSI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LII, SLE, IEI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LIE, ESI, IEE, SLI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEE, ILI, LSE, EII

## 11. Table 13
- Formula: Бс/Пр = Кн/Эм Х ?/! (11,а)
- Relation: 3 = 3 х 4
- Nearby label: парна к 2. верт бс/пр ит/сн
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, EIE, ESI, SLI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LSI, LIE, IEE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, SLE, ILI, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, IEI, SEE, LSE

## 12. Table 14
- Formula: Бс/Пр = Рс/Рш Х Наль (12,a)
- Relation: 3 = 3 х 2
- Nearby label: D8,2
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SEI, IEE, SLI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LII, LSE, EII
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, LSI, LIE, ESI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SLE, IEI, SEE, ILI

## 13. Table 15
- Formula: Бс/Пр = Тк/Ст Х Таль (13,a)
- Relation: 3 = 3 х 2
- Nearby label: D4xC2,1
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LSI, ESI, IEE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, EIE, LIE, SLI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, IEI, ILI, LSE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, SLE, SEE, EII

## 14. Table 16
- Formula: Ит/Сн = Дм/Ар Х Лг/Эт (14,c)
- Relation: 3 = 4 х 3
- Nearby label: D4xC2,1
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LII, LIE, ILI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, ESE, ESI, SEE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, IEI, IEE, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LSI, SLE, SLI, LSE

## 15. Table 17
- Formula: Ит/Сн = +/- Х Ус/Уп (15,a)
- Relation: 3 = 4 х 3
- Nearby label: D2xC2,5
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, IEI, LIE, EII
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, SLE, ESI, LSE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LSI, SEE, SLI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, EIE, ILI, IEE

## 16. Table 18
- Formula: Ит/Сн = Сб/Об Х ?/! (16,a)
- Relation: 3 = 3 х 4
- Nearby label: D8, 4
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LII, EIE, IEI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, ESE, LSI, SLE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LIE, ILI, IEE, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESI, SEE, SLI, LSE

## 17. Table 19
- Formula: Ит/Сн = Кн/Эм Х Пц/Рз (17,a)
- Relation: 3 = 3 х 4
- Nearby label: дуальна к 23
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, EIE, ILI, EII
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LSI, SEE, LSE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, SLE, ESI, SLI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, IEI, LIE, IEE

## 18. Table 20
- Formula: Ит/Сн = Рс/Рш Х Таль (18,a)
- Relation: 3 = 3 х 2
- Nearby label: самодуальная
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LII, IEE, EII
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, ESE, SLI, LSE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, IEI, LIE, ILI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LSI, SLE, ESI, SEE

## 19. Table 21
- Formula: Ит/Сн = Тк/Ст Х Наль (19,А)
- Relation: 3 = 3 х 2
- Nearby label: рацы деловятся
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, IEI, ILI, IEE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, SLE, SEE, SLI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LSI, ESI, LSE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, EIE, LIE, EII

## 20. Table 22
- Formula: Дм/Ар = Сб/Об Х Рс/Рш (20,c)
- Relation: 4 = 3 х 3
- Nearby label: Пара к
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SEI, ESE, LII
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, LSI, SLE, IEI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LIE, ESI, SEE, ILI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): IEE, SLI, LSE, EII

## 21. Table 23
- Formula: Дм/Ар = Кн/Эм Х Тк/Ст (21,c)
- Relation: 4 = 3 х 3
- Nearby label: Принято. Продолжаю работу в заданном формате чистого текста.
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, ESE, ESI, ILI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LII, LIE, SEE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, SLE, SLI, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LSI, IEI, IEE, LSE

## 22. Table 24
- Formula: Дм/Ар = Пц/Рз Х Наль (22, c)
- Relation: 4 = 4 х 2
- Nearby label: D2xC2,6
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SEI, SEE, ILI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LII, LIE, ESI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, LSI, LSE, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SLE, IEI, IEE, SLI

## 23. Table 25
- Formula: Дм/Ар = ?/! Х Таль (23,с)
- Relation: 4 = 4 х 2
- Nearby label: С2xC2
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LII, ESI, SEE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, ESE, LIE, ILI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, IEI, SLI, LSE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LSI, SLE, IEE, EII

## 24. Table 26
- Formula: +/- = Сб/Об Х Тк/Ст (24, a)
- Relation: 4 = 3 х 3
- Nearby label: Принято. Продолжаю работу в заданном формате чистого текста.
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, ESE, LSI, IEI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LII, EIE, SLE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LIE, SEE, SLI, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESI, ILI, IEE, LSE

## 25. Table 27
- Formula: +/- = Кн/Эм Х Рс/Рш (25,a)
- Relation: 4 = 3 х 3
- Nearby label: D8,4
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, ESE, SLI, EII
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, LII, IEE, LSE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, SLE, ESI, ILI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LSI, IEI, LIE, SEE

## 26. Table 28
- Formula: +/- = Пц/Рз Х Таль (26,c)
- Relation: 4 = 4 х 2
- Nearby label: D8,4
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LSI, SEE, EII
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, EIE, ILI, LSE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, IEI, LIE, SLI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, SLE, ESI, IEE

## 27. Table 29
- Formula: +/- = ?/! Х Наль (27,с)
- Relation: 4 = 3 х 2
- Nearby label: C4,2
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, IEI, SEE, SLI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, SLE, ILI, IEE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LSI, LIE, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, EIE, ESI, LSE

## 28. Table 30
- Formula: Ус/Уп = Сб/Об Х Наль (28,A)
- Relation: 3 = 3х2
- Nearby label: D4,2
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SEI, SLE, IEI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LII, EIE, LSI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LIE, ESI, LSE, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEE, ILI, IEE, SLI

## 29. Table 31
- Formula: Ус/Уп = Кн/Эм Х Таль (29,A)
- Relation: 3 = 3х2
- Nearby label: Формула иррационального сплетения[ЧИ БС ЧС БИ | иррациональные] → (1 3 5 7 | акцептные)
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SLE, ESI, EII
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, IEI, LIE, LSE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, EIE, ILI, SLI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, LSI, SEE, IEE

## 30. Table 32
- Formula: Ус/Уп = Пц/Рз Х Рс/Рш (30, а)
- Relation: 3 = 4 х 3
- Nearby label: непарный
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SEI, LSE, EII
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LII, IEE, SLI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, LSI, SEE, ILI
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SLE, IEI, LIE, ESI

## 31. Table 33
- Formula: Ус/Уп = ?/! Х Тк/Ст (31,a)
- Relation: 3 = 4 х 3
- Nearby label: порядок процесс
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, IEI, ESI, LSE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, SLE, LIE, EII
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, LSI, ILI, IEE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, EIE, SEE, SLI

## 32. Table 34
- Formula: Лг/Эт = Сб/Об Х Таль (32,a)
- Relation: 3 = 3 х 2
- Nearby label: синусоида би, в одном есть есь в другом баль
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LII, LSI, SLE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, ESE, EIE, IEI
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LIE, ILI, SLI, LSE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESI, SEE, IEE, EII

## 33. Table 35
- Formula: Лг/Эт = Кн/Эм Х Наль (33,А)
- Relation: 3 = 3 х 2
- Nearby label: Принято. Продолжаю работу в заданном формате чистого текста.
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, SLE, ILI, SLI
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, IEI, SEE, IEE
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, EIE, ESI, EII
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, LSI, LIE, LSE

## 34. Table 36
- Formula: Лг/Эт = Пц/Рз Х Тк/Ст (34,a)
- Relation: 3 = 4 х 3
- Nearby label: опять сильное закручивание 1 пара далеко 1 близко
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LSI, ILI, LSE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, EIE, SEE, EII
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ESE, IEI, ESI, IEE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LII, SLE, LIE, SLI

## 35. Table 37
- Formula: Лг/Эт = ?/! Х Рс/Рш (35,a)
- Relation: 3 = 4 х 3
- Nearby label: довольно симметрично
- $(@{color=6d9eeb; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): ILE, LII, SLI, LSE
- $(@{color=93c47d; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): SEI, ESE, IEE, EII
- $(@{color=e06666; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): EIE, IEI, ESI, SEE
- $(@{color=ffd966; typeIds=System.Object[]; sourceTexts=System.Object[]}.color): LSI, SLE, LIE, ILI

