// ==============================================
// back-link.js
// כפתור קטן "חזרה לכיתה" לאפליקציות שאין להן קישור חזרה משלהן.
//
// שימוש (בסוף ה-body של האפליקציה):
//   <script src="../../back-link.js" data-back="grade-6.html"></script>
//
// data-back   = עמוד הכיתה שאליו חוזרים (ביחס לשורש האתר).
// data-pos    = "flow" כדי שהכפתור יהיה שורה רגילה בראש העמוד (לא צף) —
//               לעמודים שבהם הכפתור הצף מכסה את הכותרת.
// אם הגיעו לאפליקציה מעמוד כיתה אחר (אותה אפליקציה מופיעה בכמה כיתות) —
// הכפתור מחזיר לעמוד שממנו הגיעו.
// ==============================================
(function () {
    'use strict';
    var script = document.currentScript;
    if (!script) return;

    var NAMES = {
        'grade-1.html': "כיתה א'", 'grade-3.html': "כיתה ג'", 'grade-4.html': "כיתה ד'",
        'grade-5.html': "כיתה ה'", 'grade-6.html': "כיתה ו'", 'kindergarten.html': 'גן חובה',
        'index.html': 'העמוד הראשי'
    };

    var root = script.src.replace(/back-link\.js.*$/, '');
    var target = script.getAttribute('data-back') || 'index.html';

    // אם הגענו מעמוד כיתה באתר — חוזרים אליו
    try {
        var m = (document.referrer || '').match(/\/(grade-\d\.html|kindergarten\.html)(?:[?#]|$)/);
        if (m && NAMES[m[1]] && document.referrer.indexOf(root) === 0) target = m[1];
    } catch (e) { /* נשארים עם ברירת המחדל */ }

    function add() {
        var a = document.createElement('a');
        a.id = 'site-back-link';
        a.href = root + target;
        a.textContent = '→ חזרה ל' + (NAMES[target] || 'אתר');
        var base =
            'direction:rtl;font:600 13px/1 Rubik,"Segoe UI",Arial,sans-serif;' +
            'background:rgba(255,255,255,0.92);color:#444;text-decoration:none;' +
            'padding:7px 12px;border-radius:16px;border:1px solid rgba(0,0,0,0.15);' +
            'box-shadow:0 2px 6px rgba(0,0,0,0.15);';
        if (script.getAttribute('data-pos') === 'flow') {
            // שורה רגילה בראש העמוד
            var row = document.createElement('div');
            row.id = 'site-back-row';
            row.style.cssText = 'direction:rtl;text-align:right;padding:8px 8px 4px;' +
                'width:100%;flex:0 0 100%;box-sizing:border-box;';
            a.style.cssText = 'display:inline-block;' + base;
            row.appendChild(a);
            document.body.insertBefore(row, document.body.firstChild);
        } else {
            a.style.cssText = 'position:fixed;top:8px;right:8px;z-index:9000;' + base;
            document.body.appendChild(a);
        }

        var style = document.createElement('style');
        style.textContent = '@media print { #site-back-link, #site-back-row { display: none !important; } }';
        document.head.appendChild(style);
    }

    if (document.body) add();
    else document.addEventListener('DOMContentLoaded', add);
})();
