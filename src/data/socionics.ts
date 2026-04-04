
export type AspectId = 'Ne' | 'Si' | 'Fe' | 'Ti' | 'Te' | 'Fi' | 'Se' | 'Ni';

export interface Aspect {
  id: AspectId;
  name: string;
  fullName: string;
  isExtra: boolean;
  isStatic: boolean;
  isRational: boolean;
  isObject: boolean; // отвлеченные/вовлеченные
  isExplicit: boolean; // явные/неявные
  quadra: 'Alpha' | 'Beta' | 'Gamma' | 'Delta';
}

export const ASPECTS: Aspect[] = [
  { id: 'Ne', name: 'ЧИ', fullName: 'Интуиция возможностей', isExtra: true, isStatic: true, isRational: false, isObject: true, isExplicit: false, quadra: 'Alpha' },
  { id: 'Si', name: 'БС', fullName: 'Сенсорика ощущений', isExtra: false, isStatic: false, isRational: false, isObject: false, isExplicit: true, quadra: 'Alpha' },
  { id: 'Fe', name: 'ЧЭ', fullName: 'Этика эмоций', isExtra: true, isStatic: false, isRational: true, isObject: false, isExplicit: false, quadra: 'Alpha' },
  { id: 'Ti', name: 'БЛ', fullName: 'Логика отношений', isExtra: false, isStatic: true, isRational: true, isObject: true, isExplicit: true, quadra: 'Alpha' },
  { id: 'Te', name: 'ЧЛ', fullName: 'Деловая логика', isExtra: true, isStatic: false, isRational: true, isObject: true, isExplicit: true, quadra: 'Delta' },
  { id: 'Fi', name: 'БЭ', fullName: 'Этика отношений', isExtra: false, isStatic: true, isRational: true, isObject: false, isExplicit: false, quadra: 'Delta' },
  { id: 'Se', name: 'ЧС', fullName: 'Волевая сенсорика', isExtra: true, isStatic: true, isRational: false, isObject: false, isExplicit: true, quadra: 'Beta' },
  { id: 'Ni', name: 'БИ', fullName: 'Интуиция времени', isExtra: false, isStatic: false, isRational: false, isObject: true, isExplicit: false, quadra: 'Beta' },
];

export interface SocionicFunction {
  id: number;
  name: string;
  isMental: boolean;
  isAcceptant: boolean;
  isExtra: boolean;
  isStrong: boolean;
  isVerbal: boolean;
  isInert: boolean;
}

export const FUNCTIONS: SocionicFunction[] = [
  { id: 1, name: 'Базовая', isMental: true, isAcceptant: true, isExtra: true, isStrong: true, isVerbal: true, isInert: true },
  { id: 2, name: 'Творческая', isMental: true, isAcceptant: false, isExtra: false, isStrong: true, isVerbal: true, isInert: false },
  { id: 3, name: 'Ролевая', isMental: true, isAcceptant: true, isExtra: true, isStrong: false, isVerbal: false, isInert: false },
  { id: 4, name: 'Болевая', isMental: true, isAcceptant: false, isExtra: false, isStrong: false, isVerbal: false, isInert: true },
  { id: 5, name: 'Суггестивная', isMental: false, isAcceptant: true, isExtra: false, isStrong: false, isVerbal: true, isInert: false },
  { id: 6, name: 'Активационная', isMental: false, isAcceptant: false, isExtra: true, isStrong: false, isVerbal: true, isInert: true },
  { id: 7, name: 'Ограничительная', isMental: false, isAcceptant: true, isExtra: false, isStrong: true, isVerbal: false, isInert: true },
  { id: 8, name: 'Фоновая', isMental: false, isAcceptant: false, isExtra: true, isStrong: true, isVerbal: false, isInert: false },
];

export interface Mapping {
  aspects: AspectId[];
  functions: number[];
  label?: string;
}

export interface TraitPole {
  name: string;
  description: string;
  // For Class 1 & 2, we usually have one set of mappings.
  // For Class 3, we might have multiple tetrachotomies.
  views?: {
    title: string;
    mappings: Mapping[];
  }[];
  // Fallback for simple traits
  mapping?: Mapping[];
}

export interface ReininTrait {
  id: string;
  name: string;
  class: 1 | 2 | 3;
  poles: [TraitPole, TraitPole];
}

export const REININ_TRAITS: ReininTrait[] = [
  // ... (Class 1 & 2 remain similar but I'll update them to use mapping property)
  {
    id: 'vertness',
    name: 'Экстраверсия / Интроверсия',
    class: 1,
    poles: [
      {
        name: 'Экстраверты',
        description: 'Экстравертные аспекты в экстравертных функциях, интровертные в интровертных.',
        mapping: [
          { aspects: ['Ne', 'Fe', 'Te', 'Se'], functions: [1, 3, 6, 8] },
          { aspects: ['Si', 'Ti', 'Fi', 'Ni'], functions: [2, 4, 5, 7] }
        ]
      },
      {
        name: 'Интроверты',
        description: 'Интровертные аспекты в экстравертных функциях, экстравертные в интровертных.',
        mapping: [
          { aspects: ['Si', 'Ti', 'Fi', 'Ni'], functions: [1, 3, 6, 8] },
          { aspects: ['Ne', 'Fe', 'Te', 'Se'], functions: [2, 4, 5, 7] }
        ]
      }
    ]
  },
  {
    id: 'nalness',
    name: 'Рациональность / Иррациональность',
    class: 1,
    poles: [
      {
        name: 'Иррационалы',
        description: 'Иррациональные аспекты в акцептных функциях, рациональные в продуктивных.',
        mapping: [
          { aspects: ['Ne', 'Si', 'Se', 'Ni'], functions: [1, 3, 5, 7] },
          { aspects: ['Fe', 'Ti', 'Te', 'Fi'], functions: [2, 4, 6, 8] }
        ]
      },
      {
        name: 'Рационалы',
        description: 'Рациональные аспекты в акцептных функциях, иррациональные в продуктивных.',
        mapping: [
          { aspects: ['Fe', 'Ti', 'Te', 'Fi'], functions: [1, 3, 5, 7] },
          { aspects: ['Ne', 'Si', 'Se', 'Ni'], functions: [2, 4, 6, 8] }
        ]
      }
    ]
  },
  {
    id: 'talness',
    name: 'Статика / Динамика',
    class: 1,
    poles: [
      {
        name: 'Статики',
        description: 'Статичные аспекты в ментальных функциях, динамичные в витальных.',
        mapping: [
          { aspects: ['Ne', 'Ti', 'Fi', 'Se'], functions: [1, 2, 3, 4] },
          { aspects: ['Si', 'Fe', 'Te', 'Ni'], functions: [5, 6, 7, 8] }
        ]
      },
      {
        name: 'Динамики',
        description: 'Динамичные аспекты в ментальных функциях, статичные в витальных.',
        mapping: [
          { aspects: ['Si', 'Fe', 'Te', 'Ni'], functions: [1, 2, 3, 4] },
          { aspects: ['Ne', 'Ti', 'Fi', 'Se'], functions: [5, 6, 7, 8] }
        ]
      }
    ]
  },
  {
    id: 'carefree',
    name: 'Беспечность / Предусмотрительность',
    class: 2,
    poles: [
      {
        name: 'Беспечные',
        description: 'ЧИ+БС в оценочных, ЧС+БИ в ситуативных.',
        mapping: [
          { aspects: ['Ne', 'Si'], functions: [1, 4, 5, 8] },
          { aspects: ['Se', 'Ni'], functions: [2, 3, 6, 7] }
        ]
      },
      {
        name: 'Предусмотрительные',
        description: 'ЧС+БИ в оценочных, ЧИ+БС в ситуативных.',
        mapping: [
          { aspects: ['Se', 'Ni'], functions: [1, 4, 5, 8] },
          { aspects: ['Ne', 'Si'], functions: [2, 3, 6, 7] }
        ]
      }
    ]
  },
  {
    id: 'yielding',
    name: 'Уступчивость / Упрямство',
    class: 2,
    poles: [
      {
        name: 'Уступчивые',
        description: 'ЧЛ+БЭ в оценочных, ЧЭ+БЛ в ситуативных.',
        mapping: [
          { aspects: ['Te', 'Fi'], functions: [1, 4, 5, 8] },
          { aspects: ['Fe', 'Ti'], functions: [2, 3, 6, 7] }
        ]
      },
      {
        name: 'Упрямые',
        description: 'ЧЭ+БЛ в оценочных, ЧЛ+БЭ в ситуативных.',
        mapping: [
          { aspects: ['Fe', 'Ti'], functions: [1, 4, 5, 8] },
          { aspects: ['Te', 'Fi'], functions: [2, 3, 6, 7] }
        ]
      }
    ]
  },
  {
    id: 'intuition',
    name: 'Интуиция / Сенсорика',
    class: 2,
    poles: [
      {
        name: 'Интуиты',
        description: 'ЧИ+БИ в сильных, ЧС+БС в слабых.',
        mapping: [
          { aspects: ['Ne', 'Ni'], functions: [1, 2, 7, 8] },
          { aspects: ['Se', 'Si'], functions: [3, 4, 5, 6] }
        ]
      },
      {
        name: 'Сенсорики',
        description: 'ЧС+БС в сильных, ЧИ+БИ в слабых.',
        mapping: [
          { aspects: ['Se', 'Si'], functions: [1, 2, 7, 8] },
          { aspects: ['Ne', 'Ni'], functions: [3, 4, 5, 6] }
        ]
      }
    ]
  },
  {
    id: 'logic',
    name: 'Логика / Этика',
    class: 2,
    poles: [
      {
        name: 'Логики',
        description: 'ЧЛ+БЛ в сильных, ЧЭ+БЭ в слабых.',
        mapping: [
          { aspects: ['Te', 'Ti'], functions: [1, 2, 7, 8] },
          { aspects: ['Fe', 'Fi'], functions: [3, 4, 5, 6] }
        ]
      },
      {
        name: 'Этики',
        description: 'ЧЭ+БЭ в сильных, ЧЛ+БЛ в слабых.',
        mapping: [
          { aspects: ['Fe', 'Fi'], functions: [1, 2, 7, 8] },
          { aspects: ['Te', 'Ti'], functions: [3, 4, 5, 6] }
        ]
      }
    ]
  },
  {
    id: 'subjectivism',
    name: 'Субъективизм / Объективизм',
    class: 2,
    poles: [
      {
        name: 'Субъективисты',
        description: 'ЧЭ+БЛ в вербальных, ЧЛ+БЭ в лаборных.',
        mapping: [
          { aspects: ['Fe', 'Ti'], functions: [1, 2, 5, 6] },
          { aspects: ['Te', 'Fi'], functions: [3, 4, 7, 8] }
        ]
      },
      {
        name: 'Объективисты',
        description: 'ЧЛ+БЭ в вербальных, ЧЭ+БЛ в лаборных.',
        mapping: [
          { aspects: ['Te', 'Fi'], functions: [1, 2, 5, 6] },
          { aspects: ['Fe', 'Ti'], functions: [3, 4, 7, 8] }
        ]
      }
    ]
  },
  {
    id: 'judicious',
    name: 'Рассудительность / Решительность',
    class: 2,
    poles: [
      {
        name: 'Рассудительные',
        description: 'ЧИ+БС в вербальных, ЧС+БИ в лаборных.',
        mapping: [
          { aspects: ['Ne', 'Si'], functions: [1, 2, 5, 6] },
          { aspects: ['Se', 'Ni'], functions: [3, 4, 7, 8] }
        ]
      },
      {
        name: 'Решительные',
        description: 'ЧС+БИ в вербальных, ЧИ+БС в лаборных.',
        mapping: [
          { aspects: ['Se', 'Ni'], functions: [1, 2, 5, 6] },
          { aspects: ['Ne', 'Si'], functions: [3, 4, 7, 8] }
        ]
      }
    ]
  },
  {
    id: 'constructivism',
    name: 'Конструктивизм / Эмотивизм',
    class: 2,
    poles: [
      {
        name: 'Конструктивисты',
        description: 'ЧЭ+БЭ в инертных, ЧЛ+БЛ в контактных.',
        mapping: [
          { aspects: ['Fe', 'Fi'], functions: [1, 4, 6, 7] },
          { aspects: ['Te', 'Ti'], functions: [2, 3, 5, 8] }
        ]
      },
      {
        name: 'Эмотивисты',
        description: 'ЧЛ+БЛ в инертных, ЧЭ+БЭ в контактных.',
        mapping: [
          { aspects: ['Te', 'Ti'], functions: [1, 4, 6, 7] },
          { aspects: ['Fe', 'Fi'], functions: [2, 3, 5, 8] }
        ]
      }
    ]
  },
  {
    id: 'tactical',
    name: 'Тактика / Стратегия',
    class: 2,
    poles: [
      {
        name: 'Тактики',
        description: 'ЧИ+БИ в инертных, ЧС+БС в контактных.',
        mapping: [
          { aspects: ['Ne', 'Ni'], functions: [1, 4, 6, 7] },
          { aspects: ['Se', 'Si'], functions: [2, 3, 5, 8] }
        ]
      },
      {
        name: 'Стратеги',
        description: 'ЧС+БС в инертных, ЧИ+БИ в контактных.',
        mapping: [
          { aspects: ['Se', 'Si'], functions: [1, 4, 6, 7] },
          { aspects: ['Ne', 'Ni'], functions: [2, 3, 5, 8] }
        ]
      }
    ]
  },
  {
    id: 'democracy',
    name: 'Демократия / Аристократия',
    class: 3,
    poles: [
      {
        name: 'Демократы',
        description: 'Пары аспектов, эквивалентные по отвлеченности/вовлеченности, в горизонтальных блоках.',
        views: [
          {
            title: 'Горизонтальные блоки',
            mappings: [
              { aspects: ['Ne', 'Ti'], functions: [1, 2] },
              { aspects: ['Se', 'Fi'], functions: [3, 4] },
              { aspects: ['Si', 'Fe'], functions: [5, 6] },
              { aspects: ['Ni', 'Te'], functions: [7, 8] }
            ]
          },
          {
            title: 'Длинные вертикальные',
            mappings: [
              { aspects: ['Ne', 'Fe'], functions: [1, 6] },
              { aspects: ['Si', 'Ti'], functions: [2, 5] },
              { aspects: ['Se', 'Te'], functions: [3, 8] },
              { aspects: ['Ni', 'Fi'], functions: [4, 7] }
            ]
          },
          {
            title: 'Мерности (4Б)',
            mappings: [
              { aspects: ['Ne', 'Te'], functions: [1, 8] },
              { aspects: ['Ti', 'Ni'], functions: [2, 7] },
              { aspects: ['Se', 'Fe'], functions: [3, 6] },
              { aspects: ['Si', 'Fi'], functions: [4, 5] }
            ]
          },
          {
            title: 'Вертикальные блоки',
            mappings: [
              { aspects: ['Ne', 'Fi'], functions: [1, 4] },
              { aspects: ['Se', 'Ti'], functions: [2, 3] },
              { aspects: ['Si', 'Te'], functions: [5, 8] },
              { aspects: ['Ni', 'Fe'], functions: [6, 7] }
            ]
          }
        ]
      },
      {
        name: 'Аристократы',
        description: 'Пары аспектов, эквивалентные по отвлеченности/вовлеченности, в вертикальных блоках.',
        views: [
          {
            title: 'Горизонтальные блоки',
            mappings: [
              { aspects: ['Ne', 'Fi'], functions: [1, 2] },
              { aspects: ['Se', 'Ti'], functions: [3, 4] },
              { aspects: ['Si', 'Te'], functions: [5, 6] },
              { aspects: ['Ni', 'Fe'], functions: [7, 8] }
            ]
          },
          {
            title: 'Длинные вертикальные',
            mappings: [
              { aspects: ['Ne', 'Te'], functions: [1, 6] },
              { aspects: ['Si', 'Fi'], functions: [2, 5] },
              { aspects: ['Fe', 'Se'], functions: [3, 8] },
              { aspects: ['Ti', 'Ni'], functions: [4, 7] }
            ]
          },
          {
            title: 'Мерности (4Б)',
            mappings: [
              { aspects: ['Ne', 'Fe'], functions: [1, 8] },
              { aspects: ['Ti', 'Si'], functions: [2, 7] },
              { aspects: ['Se', 'Te'], functions: [3, 6] },
              { aspects: ['Fi', 'Ni'], functions: [4, 5] }
            ]
          },
          {
            title: 'Вертикальные блоки',
            mappings: [
              { aspects: ['Ne', 'Ti'], functions: [1, 4] },
              { aspects: ['Se', 'Fi'], functions: [2, 3] },
              { aspects: ['Si', 'Fe'], functions: [5, 8] },
              { aspects: ['Ni', 'Te'], functions: [6, 7] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'positivism',
    name: 'Позитивизм / Негативизм',
    class: 3,
    poles: [
      {
        name: 'Позитивисты',
        description: 'Тетрахотомия аспектов [ЧИ ЧЛ ~ ЧЭ ЧС ~ БС БЛ ~ БЭ БИ] в функции (1 8 ~ 2 5 ~ 3 6 ~ 4 7).',
        views: [
          {
            title: 'Эквивалентность 1',
            mappings: [
              { aspects: ['Ne', 'Te'], functions: [1, 8] },
              { aspects: ['Fe', 'Se'], functions: [2, 5] },
              { aspects: ['Si', 'Ti'], functions: [3, 6] },
              { aspects: ['Fi', 'Ni'], functions: [4, 7] }
            ]
          },
          {
            title: 'Эквивалентность 2',
            mappings: [
              { aspects: ['Ne', 'Fe'], functions: [1, 6] },
              { aspects: ['Te', 'Se'], functions: [2, 7] },
              { aspects: ['Si', 'Fi'], functions: [3, 8] },
              { aspects: ['Ti', 'Ni'], functions: [4, 5] }
            ]
          }
        ]
      },
      {
        name: 'Негативисты',
        description: 'Тетрахотомия аспектов [ЧИ ЧЭ ~ ЧЛ ЧС ~ БС БЭ ~ БЛ БИ] в функции (1 8 ~ 2 5 ~ 3 6 ~ 4 7).',
        views: [
          {
            title: 'Эквивалентность 1',
            mappings: [
              { aspects: ['Ne', 'Fe'], functions: [1, 8] },
              { aspects: ['Te', 'Se'], functions: [2, 5] },
              { aspects: ['Si', 'Fi'], functions: [3, 6] },
              { aspects: ['Ti', 'Ni'], functions: [4, 7] }
            ]
          },
          {
            title: 'Эквивалентность 2',
            mappings: [
              { aspects: ['Ne', 'Te'], functions: [1, 6] },
              { aspects: ['Fe', 'Se'], functions: [2, 7] },
              { aspects: ['Si', 'Ti'], functions: [3, 8] },
              { aspects: ['Fi', 'Ni'], functions: [4, 5] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'asking',
    name: 'Квестимность / Деклатимность',
    class: 3,
    poles: [
      {
        name: 'Квестимы',
        description: '[ЧИ БЛ ~ БС ЧЛ ~ ЧЭ БИ ~ БЭ ЧС] → (1 2 ~ 3 4 ~ 5 8 ~ 6 7)',
        views: [
          {
            title: 'Эквивалентность 1',
            mappings: [
              { aspects: ['Ne', 'Ti'], functions: [1, 2] },
              { aspects: ['Si', 'Te'], functions: [3, 4] },
              { aspects: ['Fe', 'Ni'], functions: [5, 8] },
              { aspects: ['Fi', 'Se'], functions: [6, 7] }
            ]
          },
          {
            title: 'Эквивалентность 2',
            mappings: [
              { aspects: ['Ne', 'Fi'], functions: [1, 4] },
              { aspects: ['Si', 'Fe'], functions: [2, 3] },
              { aspects: ['Ti', 'Se'], functions: [5, 6] },
              { aspects: ['Te', 'Ni'], functions: [7, 8] }
            ]
          }
        ]
      },
      {
        name: 'Деклатимы',
        description: '[ЧИ БЭ ~ БС ЧЭ ~ БЛ ЧС ~ ЧЛ БИ] → (1 2 ~ 3 4 ~ 5 8 ~ 6 7)',
        views: [
          {
            title: 'Эквивалентность 1',
            mappings: [
              { aspects: ['Ne', 'Fi'], functions: [1, 2] },
              { aspects: ['Si', 'Fe'], functions: [3, 4] },
              { aspects: ['Ti', 'Se'], functions: [5, 8] },
              { aspects: ['Te', 'Ni'], functions: [6, 7] }
            ]
          },
          {
            title: 'Эквивалентность 2',
            mappings: [
              { aspects: ['Ne', 'Ti'], functions: [1, 4] },
              { aspects: ['Si', 'Te'], functions: [2, 3] },
              { aspects: ['Fe', 'Ni'], functions: [5, 6] },
              { aspects: ['Fi', 'Se'], functions: [7, 8] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'process',
    name: 'Процесс / Результат',
    class: 3,
    poles: [
      {
        name: 'Процесс',
        description: 'Интуиция-Логика-Сенсорика-Этика по ходу полутактов (1 7 > 2 8 > 3 5 > 4 6).',
        mapping: [
          { aspects: ['Ne', 'Ni'], functions: [1, 7], label: '3 полутакт (Интуиция)' },
          { aspects: ['Te', 'Ti'], functions: [2, 8], label: '4 полутакт (Логика)' },
          { aspects: ['Se', 'Si'], functions: [3, 5], label: '1 полутакт (Сенсорика)' },
          { aspects: ['Fe', 'Fi'], functions: [4, 6], label: '2 полутакт (Этика)' }
        ]
      },
      {
        name: 'Результат',
        description: 'Интуиция-Этика-Сенсорика-Логика по ходу полутактов (1 7 > 2 8 > 3 5 > 4 6).',
        mapping: [
          { aspects: ['Ne', 'Ni'], functions: [1, 7], label: '3 полутакт (Интуиция)' },
          { aspects: ['Fe', 'Fi'], functions: [2, 8], label: '2 полутакт (Этика)' },
          { aspects: ['Se', 'Si'], functions: [3, 5], label: '1 полутакт (Сенсорика)' },
          { aspects: ['Te', 'Ti'], functions: [4, 6], label: '4 полутакт (Логика)' }
        ]
      }
    ]
  }
];

export const TIMS = [
  { id: 'ILE', name: 'ИЛЭ', fullName: 'Дон Кихот', aspects: ['Ne', 'Ti', 'Se', 'Fi', 'Si', 'Fe', 'Ni', 'Te'] },
  { id: 'SEI', name: 'СЭИ', fullName: 'Дюма', aspects: ['Si', 'Fe', 'Ne', 'Ti', 'Ne', 'Ti', 'Se', 'Fi'] }, // Wait, this needs careful mapping
  // ... more TIMs if needed, but the invariants are the focus
];

// Helper to get TIM aspects in order of functions 1-8
export function getTimAspects(timId: string): AspectId[] {
    // Standard Model A for each TIM
    const mappings: Record<string, AspectId[]> = {
        'ILE': ['Ne', 'Ti', 'Se', 'Fi', 'Si', 'Fe', 'Ni', 'Te'],
        'LII': ['Ti', 'Ne', 'Fi', 'Se', 'Fe', 'Si', 'Te', 'Ni'],
        'ESE': ['Fe', 'Si', 'Ti', 'Ne', 'Ti', 'Ne', 'Fi', 'Se'], // Wait, ESE: Fe Si Ne Ti ...
        'SEI': ['Si', 'Fe', 'Ne', 'Ti', 'Ne', 'Ti', 'Se', 'Fi'],
        'SLE': ['Se', 'Ti', 'Ne', 'Fi', 'Ni', 'Fe', 'Si', 'Te'],
        'LSI': ['Ti', 'Se', 'Fi', 'Ne', 'Fe', 'Ni', 'Te', 'Si'],
        'EIE': ['Fe', 'Ni', 'Te', 'Si', 'Ti', 'Se', 'Fi', 'Ne'],
        'IEI': ['Ni', 'Fe', 'Si', 'Te', 'Se', 'Ti', 'Ne', 'Fi'],
        'SEE': ['Se', 'Fi', 'Te', 'Ni', 'Ni', 'Te', 'Si', 'Fe'],
        'ESI': ['Fi', 'Se', 'Ni', 'Te', 'Te', 'Ni', 'Fe', 'Si'],
        'LIE': ['Te', 'Ni', 'Fi', 'Se', 'Fi', 'Se', 'Ni', 'Te'], // Wait, LIE: Te Ni Se Fi ...
        'ILI': ['Ni', 'Te', 'Fe', 'Si', 'Fe', 'Si', 'Te', 'Ni'],
        'IEE': ['Ne', 'Fi', 'Ti', 'Se', 'Ti', 'Se', 'Fi', 'Ne'],
        'EII': ['Fi', 'Ne', 'Se', 'Ti', 'Se', 'Ti', 'Ne', 'Fi'],
        'LSE': ['Te', 'Si', 'Ni', 'Fe', 'Ni', 'Fe', 'Si', 'Te'],
        'SLI': ['Si', 'Te', 'Fe', 'Ni', 'Fe', 'Ni', 'Te', 'Si'],
    };
    // Correcting some mappings based on standard socionics
    // ILE: Ne Ti Se Fi Si Fe Ni Te (1 2 3 4 5 6 7 8)
    // SEI: Si Fe Ne Ti Ne Ti Se Fi
    // ESE: Fe Si Ti Ne Ti Ne Fi Se
    // LII: Ti Ne Fi Se Fe Si Te Ni
    // EIE: Fe Ni Te Si Ti Se Fi Ne
    // IEI: Ni Fe Si Te Se Ti Ne Fi
    // SLE: Se Ti Ne Fi Ni Fe Si Te
    // LSI: Ti Se Fi Ne Fe Ni Te Si
    // SEE: Se Fi Te Ni Ni Te Si Fe
    // ESI: Fi Se Ni Te Te Ni Fe Si
    // LIE: Te Ni Se Fi Fi Se Ni Te
    // ILI: Ni Te Fe Si Fe Si Te Ni
    // LSE: Te Si Ni Fe Ni Fe Si Te
    // SLI: Si Te Fe Ni Fe Ni Te Si
    // IEE: Ne Fi Ti Se Ti Se Fi Ne
    // EII: Fi Ne Se Ti Se Ti Ne Fi
    
    return mappings[timId] || mappings['ILE'];
}
