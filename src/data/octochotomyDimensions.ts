import type { AspectId } from './socionics';

export interface OctochotomySourceRow {
  aspectIds: readonly AspectId[];
  aspectText: string;
  aspectFeaturesText: string;
  functionBlockLabel: string;
  functionIds: readonly number[];
  functionFeaturesText: string;
}

// Direct transcription: harness/theory/Октохотомии.md, section 8, lines 1197–1333.
// Blocks follow the eight source pairs; rows follow dimensionalities 4, 3, 2, 1.
export const QUASI_IDENTITY_DIMENSION_ROWS: readonly (readonly OctochotomySourceRow[])[] = [
  [
    {
      "aspectIds": [
        "Ne",
        "Te"
      ],
      "aspectText": "ЧИ ЧЛ",
      "aspectFeaturesText": "экстравертные дельта отвлеченные",
      "functionBlockLabel": "мерность 4",
      "functionIds": [
        1,
        8
      ],
      "functionFeaturesText": "экстравертные оценочные сильные"
    },
    {
      "aspectIds": [
        "Ni",
        "Ti"
      ],
      "aspectText": "БИ БЛ",
      "aspectFeaturesText": "интровертные бета отвлеченные",
      "functionBlockLabel": "мерность 3",
      "functionIds": [
        2,
        7
      ],
      "functionFeaturesText": "интровертные ситуационные сильные"
    },
    {
      "aspectIds": [
        "Se",
        "Fe"
      ],
      "aspectText": "ЧС ЧЭ",
      "aspectFeaturesText": "экстравертные бета вовлеченные",
      "functionBlockLabel": "мерность 2",
      "functionIds": [
        3,
        6
      ],
      "functionFeaturesText": "экстравертные ситуационные слабые"
    },
    {
      "aspectIds": [
        "Si",
        "Fi"
      ],
      "aspectText": "БС БЭ",
      "aspectFeaturesText": "интровертные дельта вовлеченные",
      "functionBlockLabel": "мерность 1",
      "functionIds": [
        4,
        5
      ],
      "functionFeaturesText": "интровертные оценочные слабые"
    }
  ],
  [
    {
      "aspectIds": [
        "Si",
        "Fi"
      ],
      "aspectText": "БС БЭ",
      "aspectFeaturesText": "интровертные дельта вовлеченные",
      "functionBlockLabel": "мерность 4",
      "functionIds": [
        1,
        8
      ],
      "functionFeaturesText": "экстравертные оценочные сильные"
    },
    {
      "aspectIds": [
        "Se",
        "Fe"
      ],
      "aspectText": "ЧС ЧЭ",
      "aspectFeaturesText": "экстравертные бета вовлеченные",
      "functionBlockLabel": "мерность 3",
      "functionIds": [
        2,
        7
      ],
      "functionFeaturesText": "интровертные ситуационные сильные"
    },
    {
      "aspectIds": [
        "Ni",
        "Ti"
      ],
      "aspectText": "БИ БЛ",
      "aspectFeaturesText": "интровертные бета отвлеченные",
      "functionBlockLabel": "мерность 2",
      "functionIds": [
        3,
        6
      ],
      "functionFeaturesText": "экстравертные ситуационные слабые"
    },
    {
      "aspectIds": [
        "Ne",
        "Te"
      ],
      "aspectText": "ЧИ ЧЛ",
      "aspectFeaturesText": "экстравертные дельта отвлеченные",
      "functionBlockLabel": "мерность 1",
      "functionIds": [
        4,
        5
      ],
      "functionFeaturesText": "интровертные оценочные слабые"
    }
  ],
  [
    {
      "aspectIds": [
        "Se",
        "Fe"
      ],
      "aspectText": "ЧС ЧЭ",
      "aspectFeaturesText": "экстравертные бета вовлеченные",
      "functionBlockLabel": "мерность 4",
      "functionIds": [
        1,
        8
      ],
      "functionFeaturesText": "экстравертные оценочные сильные"
    },
    {
      "aspectIds": [
        "Si",
        "Fi"
      ],
      "aspectText": "БС БЭ",
      "aspectFeaturesText": "интровертные дельта вовлеченные",
      "functionBlockLabel": "мерность 3",
      "functionIds": [
        2,
        7
      ],
      "functionFeaturesText": "интровертные ситуационные сильные"
    },
    {
      "aspectIds": [
        "Ne",
        "Te"
      ],
      "aspectText": "ЧИ ЧЛ",
      "aspectFeaturesText": "экстравертные дельта отвлеченные",
      "functionBlockLabel": "мерность 2",
      "functionIds": [
        3,
        6
      ],
      "functionFeaturesText": "экстравертные ситуационные слабые"
    },
    {
      "aspectIds": [
        "Ni",
        "Ti"
      ],
      "aspectText": "БИ БЛ",
      "aspectFeaturesText": "интровертные бета отвлеченные",
      "functionBlockLabel": "мерность 1",
      "functionIds": [
        4,
        5
      ],
      "functionFeaturesText": "интровертные оценочные слабые"
    }
  ],
  [
    {
      "aspectIds": [
        "Ni",
        "Ti"
      ],
      "aspectText": "БИ БЛ",
      "aspectFeaturesText": "интровертные бета отвлеченные",
      "functionBlockLabel": "мерность 4",
      "functionIds": [
        1,
        8
      ],
      "functionFeaturesText": "экстравертные оценочные сильные"
    },
    {
      "aspectIds": [
        "Ne",
        "Te"
      ],
      "aspectText": "ЧИ ЧЛ",
      "aspectFeaturesText": "экстравертные дельта отвлеченные",
      "functionBlockLabel": "мерность 3",
      "functionIds": [
        2,
        7
      ],
      "functionFeaturesText": "интровертные ситуационные сильные"
    },
    {
      "aspectIds": [
        "Si",
        "Fi"
      ],
      "aspectText": "БС БЭ",
      "aspectFeaturesText": "интровертные дельта вовлеченные",
      "functionBlockLabel": "мерность 2",
      "functionIds": [
        3,
        6
      ],
      "functionFeaturesText": "экстравертные ситуационные слабые"
    },
    {
      "aspectIds": [
        "Se",
        "Fe"
      ],
      "aspectText": "ЧС ЧЭ",
      "aspectFeaturesText": "экстравертные бета вовлеченные",
      "functionBlockLabel": "мерность 1",
      "functionIds": [
        4,
        5
      ],
      "functionFeaturesText": "интровертные оценочные слабые"
    }
  ],
  [
    {
      "aspectIds": [
        "Ne",
        "Fe"
      ],
      "aspectText": "ЧИ ЧЭ",
      "aspectFeaturesText": "экстравертные альфа неявные",
      "functionBlockLabel": "мерность 4",
      "functionIds": [
        1,
        8
      ],
      "functionFeaturesText": "экстравертные оценочные сильные"
    },
    {
      "aspectIds": [
        "Ni",
        "Fi"
      ],
      "aspectText": "БИ БЭ",
      "aspectFeaturesText": "интровертные гамма неявные",
      "functionBlockLabel": "мерность 3",
      "functionIds": [
        2,
        7
      ],
      "functionFeaturesText": "интровертные ситуационные сильные"
    },
    {
      "aspectIds": [
        "Se",
        "Te"
      ],
      "aspectText": "ЧС ЧЛ",
      "aspectFeaturesText": "экстравертные гамма явные",
      "functionBlockLabel": "мерность 2",
      "functionIds": [
        3,
        6
      ],
      "functionFeaturesText": "экстравертные ситуационные слабые"
    },
    {
      "aspectIds": [
        "Si",
        "Ti"
      ],
      "aspectText": "БС БЛ",
      "aspectFeaturesText": "интровертные альфа явные",
      "functionBlockLabel": "мерность 1",
      "functionIds": [
        4,
        5
      ],
      "functionFeaturesText": "интровертные оценочные слабые"
    }
  ],
  [
    {
      "aspectIds": [
        "Si",
        "Ti"
      ],
      "aspectText": "БС БЛ",
      "aspectFeaturesText": "интровертные альфа явные",
      "functionBlockLabel": "мерность 4",
      "functionIds": [
        1,
        8
      ],
      "functionFeaturesText": "экстравертные оценочные сильные"
    },
    {
      "aspectIds": [
        "Se",
        "Te"
      ],
      "aspectText": "ЧС ЧЛ",
      "aspectFeaturesText": "экстравертные гамма явные",
      "functionBlockLabel": "мерность 3",
      "functionIds": [
        2,
        7
      ],
      "functionFeaturesText": "интровертные ситуационные сильные"
    },
    {
      "aspectIds": [
        "Ni",
        "Fi"
      ],
      "aspectText": "БИ БЭ",
      "aspectFeaturesText": "интровертные гамма неявные",
      "functionBlockLabel": "мерность 2",
      "functionIds": [
        3,
        6
      ],
      "functionFeaturesText": "экстравертные ситуационные слабые"
    },
    {
      "aspectIds": [
        "Ne",
        "Fe"
      ],
      "aspectText": "ЧИ ЧЭ",
      "aspectFeaturesText": "экстравертные альфа неявные",
      "functionBlockLabel": "мерность 1",
      "functionIds": [
        4,
        5
      ],
      "functionFeaturesText": "интровертные оценочные слабые"
    }
  ],
  [
    {
      "aspectIds": [
        "Se",
        "Te"
      ],
      "aspectText": "ЧС ЧЛ",
      "aspectFeaturesText": "экстравертные гамма явные",
      "functionBlockLabel": "мерность 4",
      "functionIds": [
        1,
        8
      ],
      "functionFeaturesText": "экстравертные оценочные сильные"
    },
    {
      "aspectIds": [
        "Si",
        "Ti"
      ],
      "aspectText": "БС БЛ",
      "aspectFeaturesText": "интровертные альфа явные",
      "functionBlockLabel": "мерность 3",
      "functionIds": [
        2,
        7
      ],
      "functionFeaturesText": "интровертные ситуационные сильные"
    },
    {
      "aspectIds": [
        "Ne",
        "Fe"
      ],
      "aspectText": "ЧИ ЧЭ",
      "aspectFeaturesText": "экстравертные альфа неявные",
      "functionBlockLabel": "мерность 2",
      "functionIds": [
        3,
        6
      ],
      "functionFeaturesText": "экстравертные ситуационные слабые"
    },
    {
      "aspectIds": [
        "Ni",
        "Fi"
      ],
      "aspectText": "БИ БЭ",
      "aspectFeaturesText": "интровертные гамма неявные",
      "functionBlockLabel": "мерность 1",
      "functionIds": [
        4,
        5
      ],
      "functionFeaturesText": "интровертные оценочные слабые"
    }
  ],
  [
    {
      "aspectIds": [
        "Ni",
        "Fi"
      ],
      "aspectText": "БИ БЭ",
      "aspectFeaturesText": "интровертные гамма неявные",
      "functionBlockLabel": "мерность 4",
      "functionIds": [
        1,
        8
      ],
      "functionFeaturesText": "экстравертные оценочные сильные"
    },
    {
      "aspectIds": [
        "Ne",
        "Fe"
      ],
      "aspectText": "ЧИ ЧЭ",
      "aspectFeaturesText": "экстравертные альфа неявные",
      "functionBlockLabel": "мерность 3",
      "functionIds": [
        2,
        7
      ],
      "functionFeaturesText": "интровертные ситуационные сильные"
    },
    {
      "aspectIds": [
        "Si",
        "Ti"
      ],
      "aspectText": "БС БЛ",
      "aspectFeaturesText": "интровертные альфа явные",
      "functionBlockLabel": "мерность 2",
      "functionIds": [
        3,
        6
      ],
      "functionFeaturesText": "экстравертные ситуационные слабые"
    },
    {
      "aspectIds": [
        "Se",
        "Te"
      ],
      "aspectText": "ЧС ЧЛ",
      "aspectFeaturesText": "экстравертные гамма явные",
      "functionBlockLabel": "мерность 1",
      "functionIds": [
        4,
        5
      ],
      "functionFeaturesText": "интровертные оценочные слабые"
    }
  ]
];
