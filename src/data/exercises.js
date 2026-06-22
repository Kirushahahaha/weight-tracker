// Exercise library.
// gif  — full-motion looping animation, self-hosted in public/gifs/<key>.gif
//        (originally from fitnessprogramer.com). Self-hosting avoids hotlink
//        blocking and makes them load reliably for everyone, even offline.
// imgs — two position photos (free-exercise-db), used as a fallback animation
//        for exercises without a gif, and as static thumbnails in the list.

const IMG = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises';
const img = (folder) => [`${IMG}/${folder}/0.jpg`, `${IMG}/${folder}/1.jpg`];

export const EXERCISES = {
  // ─── Ноги / ягодицы ───
  squat: {
    name: 'Приседания', muscle: 'Ноги, ягодицы', imgs: img('Bodyweight_Squat'),
    tips: 'Стопы на ширине плеч. Опускайся, отводя таз назад, спина прямая. Колени смотрят в стороны носков.',
  },
  jumpSquat: {
    name: 'Приседания с прыжком', muscle: 'Ноги, кардио', imgs: img('Freehand_Jump_Squat'),
    tips: 'Присядь и выпрыгни вверх. Мягко приземляйся обратно в присед.',
  },
  sitSquat: {
    name: 'Глубокие приседания', muscle: 'Ноги, ягодицы', imgs: img('Sit_Squats'),
    tips: 'Опускайся как можно ниже, держи спину прямой и пятки на полу.',
  },
  lunge: {
    name: 'Выпады', muscle: 'Ноги, ягодицы', imgs: img('Bodyweight_Walking_Lunge'),
    tips: 'Шаг вперёд, опускайся пока заднее колено почти не коснётся пола. Спина прямая.',
  },
  splitSquat: {
    name: 'Сплит-приседания', muscle: 'Ноги, ягодицы', imgs: img('Split_Squats'),
    tips: 'Одна нога впереди, другая сзади. Опускайся вниз сгибая обе ноги.',
  },
  stepUp: {
    name: 'Зашагивания', muscle: 'Ноги, ягодицы', imgs: img('Step-up_with_Knee_Raise'),
    tips: 'Зашагивай на возвышение, поднимая колено второй ноги вверх. Чередуй ноги.',
  },
  bridge: {
    name: 'Ягодичный мостик', muscle: 'Ягодицы', imgs: img('Butt_Lift_Bridge'),
    tips: 'Лёжа на спине, колени согнуты. Поднимай таз упираясь пятками, сжимай ягодицы наверху.',
  },
  pelvicBridge: {
    name: 'Мостик с наклоном таза', muscle: 'Ягодицы, поясница', imgs: img('Pelvic_Tilt_Into_Bridge'),
    tips: 'Прижми поясницу к полу, затем плавно поднимай таз вверх по позвонкам.',
  },
  calfRaise: {
    name: 'Подъём на носки', muscle: 'Икры', imgs: img('Standing_Calf_Raises'),
    tips: 'Стоя, поднимайся на носки максимально высоко, затем плавно опускайся.',
  },

  // ─── Грудь / отжимания ───
  pushup: {
    name: 'Отжимания', muscle: 'Грудь, трицепс', imgs: img('Pushups'),
    tips: 'Тело прямое от головы до пяток. Локти под углом ~45° к корпусу. Опускайся до груди.',
  },
  inclinePush: {
    name: 'Отжимания с опоры', muscle: 'Грудь (легче)', imgs: img('Incline_Push-Up'),
    tips: 'Руки на возвышении (диван, стол). Легче обычных — для начала или добивки.',
  },
  declinePush: {
    name: 'Отжимания ноги выше', muscle: 'Верх груди, плечи', imgs: img('Decline_Push-Up'),
    tips: 'Ноги на возвышении. Сложнее обычных, акцент на верх груди и плечи.',
  },
  closePush: {
    name: 'Узкие отжимания', muscle: 'Трицепс, грудь', imgs: img('Push-Ups_-_Close_Triceps_Position'),
    tips: 'Руки уже плеч, локти вдоль тела. Сильнее нагружают трицепс.',
  },

  // ─── Руки ───
  dips: {
    name: 'Обратные отжимания', muscle: 'Трицепс', imgs: img('Bench_Dips'),
    tips: 'Руки на опоре за спиной. Опускайся сгибая локти до ~90°, затем выжимайся вверх.',
  },
  bodyUp: {
    name: 'Подъём корпуса на руках', muscle: 'Трицепс', imgs: img('Body-Up'),
    tips: 'Из положения на предплечьях выжимайся на прямые руки и обратно.',
  },
  tricepPress: {
    name: 'Трицепсовый жим телом', muscle: 'Трицепс', imgs: img('Body_Tricep_Press'),
    tips: 'Контролируемо опускайся и выжимайся за счёт трицепсов.',
  },

  // ─── Плечи ───
  shoulderRaise: {
    name: 'Отжимания «домиком»', muscle: 'Плечи', imgs: img('Shoulder_Raise'),
    tips: 'Таз вверх, тело домиком. Опускай голову к полу — мощная нагрузка на плечи.',
  },
  armCircles: {
    name: 'Круги руками', muscle: 'Плечи', imgs: img('Arm_Circles'),
    tips: 'Прямыми руками делай круги вперёд и назад. Разогрев и выносливость плеч.',
  },

  // ─── Спина ───
  superman: {
    name: 'Супермен', muscle: 'Спина, ягодицы', imgs: img('Superman'),
    tips: 'Лёжа на животе, одновременно поднимай руки и ноги вверх, задержись наверху.',
  },
  hyperext: {
    name: 'Гиперэкстензия на полу', muscle: 'Поясница, спина', imgs: img('Hyperextensions_With_No_Hyperextension_Bench'),
    tips: 'Лёжа на животе, поднимай корпус вверх за счёт мышц спины, не рывком.',
  },
  invertedRow: {
    name: 'Тяга под столом', muscle: 'Спина, бицепс', imgs: img('Inverted_Row'),
    tips: 'Возьмись за край прочного стола снизу и подтягивай корпус к нему. Тело прямое.',
  },
  pullup: {
    name: 'Подтягивания', muscle: 'Спина, бицепс', imgs: img('Pullups'),
    tips: 'Нужен турник. Подтягивайся до подбородка над перекладиной, плавно опускайся.',
  },
  chinup: {
    name: 'Подтягивания обратным хватом', muscle: 'Спина, бицепс', imgs: img('Chin-Up'),
    tips: 'Хват ладонями к себе — сильнее работает бицепс. Нужен турник.',
  },

  // ─── Пресс / кор ───
  plank: {
    name: 'Планка', muscle: 'Пресс, кор', imgs: img('Plank'),
    tips: 'Упор на предплечья. Тело прямое, таз не проваливается. Напряги пресс.',
  },
  sideBridge: {
    name: 'Боковая планка', muscle: 'Косые, кор', imgs: img('Side_Bridge'),
    tips: 'Упор на одно предплечье, тело прямое в линию. Держи таз поднятым.',
  },
  crunches: {
    name: 'Скручивания на пресс', muscle: 'Верхний пресс', imgs: img('Crunches'),
    tips: 'Лёжа, руки за головой. Отрывай лопатки за счёт пресса, поясница прижата.',
  },
  situp: {
    name: 'Подъёмы корпуса', muscle: 'Пресс', imgs: img('3_4_Sit-Up'),
    tips: 'Лёжа, колени согнуты. Поднимай корпус к коленям, не тяни шею руками.',
  },
  crossCrunch: {
    name: 'Велосипед', muscle: 'Косые мышцы', imgs: img('Cross-Body_Crunch'),
    tips: 'Лёжа на спине, тянись локтём к противоположному колену поочерёдно.',
  },
  legRaise: {
    name: 'Подъём ног', muscle: 'Нижний пресс', imgs: img('Flat_Bench_Lying_Leg_Raise'),
    tips: 'Лёжа на спине, поднимай прямые ноги вверх и плавно опускай не касаясь пола.',
  },
  reverseCrunch: {
    name: 'Обратные скручивания', muscle: 'Нижний пресс', imgs: img('Reverse_Crunch'),
    tips: 'Лёжа на спине, подтягивай колени к груди, отрывая таз от пола.',
  },

  // ─── Кардио ───
  climber: {
    name: 'Скалолаз', muscle: 'Пресс, кардио', imgs: img('Mountain_Climbers'),
    tips: 'Упор лёжа. Поочерёдно подтягивай колени к груди в быстром темпе.',
  },
  jumpKnee: {
    name: 'Бег с высоким подъёмом колен', muscle: 'Кардио, ноги', imgs: img('Knee_Tuck_Jump'),
    tips: 'Бег на месте, высоко поднимая колени. Держи быстрый темп.',
  },
  starJump: {
    name: 'Прыжки звездой', muscle: 'Кардио, всё тело', imgs: img('Star_Jump'),
    tips: 'Из приседа выпрыгивай разводя руки и ноги в стороны. Энергичный темп.',
  },
  rocketJump: {
    name: 'Выпрыгивания вверх', muscle: 'Кардио, ноги', imgs: img('Rocket_Jump'),
    tips: 'Из полуприседа взрывно выпрыгивай вверх, подтягивая колени.',
  },
};

// Attach self-hosted GIFs (public/gifs/<key>.gif) to the exercises that have one.
const WITH_GIF = [
  'squat', 'jumpSquat', 'lunge', 'splitSquat', 'bridge', 'pelvicBridge', 'calfRaise',
  'pushup', 'inclinePush', 'declinePush', 'closePush', 'dips', 'tricepPress',
  'shoulderRaise', 'armCircles', 'superman', 'invertedRow', 'pullup', 'chinup',
  'plank', 'sideBridge', 'crunches', 'situp', 'crossCrunch', 'legRaise',
  'reverseCrunch', 'climber', 'jumpKnee', 'starJump', 'rocketJump',
];
WITH_GIF.forEach(k => { if (EXERCISES[k]) EXERCISES[k].gif = `${process.env.PUBLIC_URL || ''}/gifs/${k}.gif`; });

// Difficulty levels scale exercise time, rest time and number of rounds.
export const DIFFICULTIES = [
  { id: 'easy',   label: 'Лёгкий',  timeMul: 1.0, restMul: 1.0, rounds: 1 },
  { id: 'medium', label: 'Средний', timeMul: 1.3, restMul: 0.7, rounds: 2 },
  { id: 'hard',   label: 'Сложный', timeMul: 1.6, restMul: 0.5, rounds: 3 },
];

// Builds an adjusted program for the chosen difficulty.
export function buildProgram(program, diffId) {
  const d = DIFFICULTIES.find(x => x.id === diffId) || DIFFICULTIES[0];
  const scaled = program.items.map(it => ({
    ...it,
    time: Math.max(15, Math.round((it.time * d.timeMul) / 5) * 5),
  }));
  let items = [];
  for (let r = 0; r < d.rounds; r++) items = items.concat(scaled);
  return {
    ...program,
    items,
    rest: Math.max(8, Math.round(program.rest * d.restMul)),
    rounds: d.rounds,
    difficulty: d.label,
  };
}

// Ready-made programs. Each item: { ex, time } (seconds).
export const PROGRAMS = [
  {
    id: 'fullbody', name: 'Всё тело', desc: 'Базовая тренировка на основные группы мышц', rest: 20,
    items: [
      { ex: 'squat', time: 40 }, { ex: 'pushup', time: 30 }, { ex: 'lunge', time: 40 },
      { ex: 'plank', time: 40 }, { ex: 'bridge', time: 40 }, { ex: 'climber', time: 30 },
    ],
  },
  {
    id: 'abs', name: 'Пресс', desc: 'Прокачка живота и кора', rest: 15,
    items: [
      { ex: 'crunches', time: 40 }, { ex: 'legRaise', time: 35 }, { ex: 'crossCrunch', time: 40 },
      { ex: 'reverseCrunch', time: 35 }, { ex: 'sideBridge', time: 30 }, { ex: 'plank', time: 45 },
      { ex: 'situp', time: 40 },
    ],
  },
  {
    id: 'legs', name: 'Ноги и ягодицы', desc: 'Нагрузка на низ тела', rest: 20,
    items: [
      { ex: 'squat', time: 45 }, { ex: 'lunge', time: 40 }, { ex: 'splitSquat', time: 40 },
      { ex: 'bridge', time: 45 }, { ex: 'calfRaise', time: 35 }, { ex: 'jumpSquat', time: 30 },
    ],
  },
  {
    id: 'arms', name: 'Руки', desc: 'Трицепс и бицепс дома без железа', rest: 18,
    items: [
      { ex: 'closePush', time: 35 }, { ex: 'dips', time: 35 }, { ex: 'tricepPress', time: 30 },
      { ex: 'pushup', time: 30 }, { ex: 'invertedRow', time: 35 }, { ex: 'declinePush', time: 30 },
    ],
  },
  {
    id: 'back', name: 'Спина', desc: 'Укрепление спины и осанки', rest: 18,
    items: [
      { ex: 'superman', time: 35 }, { ex: 'hyperext', time: 35 }, { ex: 'invertedRow', time: 35 },
      { ex: 'pelvicBridge', time: 35 }, { ex: 'bridge', time: 40 }, { ex: 'plank', time: 40 },
    ],
  },
  {
    id: 'chest', name: 'Грудь и плечи', desc: 'Верх тела: грудь, плечи, трицепс', rest: 18,
    items: [
      { ex: 'pushup', time: 35 }, { ex: 'declinePush', time: 30 }, { ex: 'inclinePush', time: 35 },
      { ex: 'shoulderRaise', time: 30 }, { ex: 'armCircles', time: 30 }, { ex: 'closePush', time: 30 },
    ],
  },
  {
    id: 'cardio', name: 'Кардио', desc: 'Жиросжигающая интенсивная серия', rest: 15,
    items: [
      { ex: 'jumpKnee', time: 30 }, { ex: 'starJump', time: 35 }, { ex: 'climber', time: 40 },
      { ex: 'rocketJump', time: 30 }, { ex: 'jumpSquat', time: 30 }, { ex: 'lunge', time: 35 },
    ],
  },
  {
    id: 'upper', name: 'Верх тела', desc: 'Комплекс на грудь, спину, руки и плечи', rest: 18,
    items: [
      { ex: 'pushup', time: 35 }, { ex: 'invertedRow', time: 35 }, { ex: 'dips', time: 30 },
      { ex: 'superman', time: 30 }, { ex: 'declinePush', time: 30 }, { ex: 'shoulderRaise', time: 30 },
      { ex: 'closePush', time: 30 },
    ],
  },
];
