/* =========================================================
   GARAGE — ניחוחות (מקור אמת יחיד)
   נטען לפני products.js בכל דף.
   מנהל: admin.html → שומר ל-localStorage garage_scents_v1
   ========================================================= */
(function () {
  var SCENTS_KEY = 'garage_scents_v1';

  var DEFAULT_SCENTS = [
    { id: 'eilat',     name: 'אילת',            desc: 'הניחוח שתמיד מזכיר חופשה בהשראת מלון הרויאל ביץ\'' },
    { id: 'amsterdam', name: 'אמסטרדם',          desc: 'ניחוח וניל עשיר ומפתה — ונילה בלאק' },
    { id: 'borabora',  name: 'בורה בורה',        desc: 'בניחוח ספא יוקרתי מפנק' },
    { id: 'berlin',    name: 'ברלין',            desc: 'הניחוח הסקסי המבוסס על הבושם אברקומבי' },
    { id: 'barcelona', name: 'ברצלונה',          desc: 'ניחוח ספורטיבי ונמרץ ממש כמו רשת חנויות אדידס' },
    { id: 'dubai',     name: 'דובאי',            desc: 'ניחוח רענן עם נגיעות יוקרה בהשראת החנות דלתא' },
    { id: 'havana',    name: 'הוואנה',           desc: 'ניחוח בהשראת חנות הבגדים קסטרו' },
    { id: 'venice',    name: 'ונציה',            desc: 'בהשראת מלון כרמים' },
    { id: 'jerusalem', name: 'ירושלים',          desc: 'ניחוח מרגיע של ספא יוקרתי, בהשראת מלון בראשית' },
    { id: 'laguna',    name: 'לגונה ביץ\'',      desc: 'בהשראת שמפו פינוק' },
    { id: 'miami',     name: 'מיאמי',            desc: 'בהשראת הבושם קריד' },
    { id: 'milano',    name: 'מילאנו',           desc: 'ניחוח מושלם על בסיס הריח ברשת חנויות נאוטיקה' },
    { id: 'ny',        name: 'ניו יורק',         desc: 'בהשראת הבושם טום פורד בלאק' },
    { id: 'santorini', name: 'סנטוריני',         desc: 'ניחוח משכר של חופשה חלומית' },
    { id: 'palma',     name: 'פלמה דה מיורקה',   desc: 'בהשראת ניחוח של מרכך כביסה עדין' },
    { id: 'paris',     name: 'פריז',             desc: 'ניחוח בלתי נשכח בהשראת חנות הבגדים רנואר' },
    { id: 'kofifi',    name: 'קופיפי',           desc: 'בניחוח מתקתק ממש כמו בלובי בית מלון יוקרתי' },
    { id: 'premium',   name: 'ריח פרימיום',      desc: 'ניחוח הבית שאסור לכם לפספס', price: 20 },
  ];

  var stored = null;
  try { stored = localStorage.getItem(SCENTS_KEY); } catch (e) {}

  window.SCENTS         = stored ? JSON.parse(stored) : DEFAULT_SCENTS;
  window.SCENTS_DEFAULT = DEFAULT_SCENTS;
  window.SCENTS_KEY     = SCENTS_KEY;
})();
