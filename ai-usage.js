// ==============================================
// ai-usage.js
// רישום של כל בדיקה חכמה (Gemini) ל-Realtime Database, לדוח השימוש (usage-report.html)
//
// שימוש מתוך <script type="module"> של אפליקציה עם AI (טעינה דינמית, כדי שתקלה כאן לא תשבור את הבדיקה):
//   import("../../ai-usage.js").then(m => m.logAIUsage(app, auth.currentUser, modelIndex, ok, error)).catch(() => {});
//
// נשמר תחת ai_usage/{uid}/{pushId}: { t, app, name, model, ok, err? }
// ==============================================

import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

// לפי הסדר בשרשרת המודלים באפליקציות (ראשי, גיבוי 1, גיבוי 2)
export const MODEL_NAMES = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

// modelIndex: איזה מודל ענה (0/1/2), או -1 אם כולם נכשלו
export function logAIUsage(app, user, modelIndex, ok, error) {
    if (!user) return;
    const appName = location.pathname.split('/').pop().replace(/\.html$/, '') || 'unknown';
    const entry = {
        t: serverTimestamp(),
        app: appName,
        name: user.displayName || '',
        model: modelIndex >= 0 ? MODEL_NAMES[modelIndex] : 'none',
        ok: !!ok
    };
    if (!ok && error) {
        const msg = String(error);
        entry.err = (msg.match(/\[(\d{3})/) || [])[1] || msg.slice(0, 60);
    }
    return push(ref(getDatabase(app), 'ai_usage/' + user.uid), entry)
        .catch(err => console.warn('AI usage log failed:', err.message));
}
