// ==============================================
// ai-access.js
// מי מקבל בדיקה חכמה (AI)? רק משתמשים שמופיעים ב-ai_users/{uid} = true ב-Realtime Database.
// כל השאר מקבלים בדיקה עצמית (תשובה לדוגמה).
//
// את הרשימה מנהלים ידנית ב-Firebase Console ← Realtime Database ← Data.
// כלל המסד: "ai_users": { "$uid": { ".read": "auth != null && auth.uid === $uid", ".write": false } }
//
// שימוש מתוך <script type="module"> של אפליקציה עם AI (טעינה דינמית):
//   const ok = await import("../../ai-access.js").then(m => m.isAIAllowed(app, user)).catch(() => false);
//
// הערה: זו הגבלה בצד הדפדפן – מי שמבין בקוד יכול לעקוף אותה. את העלות מגבילה המכסה היומית ב-Google Cloud.
// ==============================================

import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

export async function isAIAllowed(app, user) {
    if (!user) return false;
    try {
        const snap = await get(ref(getDatabase(app), 'ai_users/' + user.uid));
        return snap.val() === true;
    } catch (err) {
        console.warn('AI access check failed:', err.message);
        return false;
    }
}
