import React, { useState } from 'react';

const translations = {
  en: {
    premiumTag: 'Premium Student Support',
    heroTitle: 'Study abroad support from first application to final arrival.',
    heroDesc: 'We help you choose the right university, secure admission, prepare your visa package, legalize documents, and find safe accommodation — all under one trusted service.',
    service1Title: 'Guidance to select universities',
    service1Desc: 'We review your profile and recommend programs with the best acceptance and scholarship potential.',
    service2Title: 'Guaranteed acceptance support',
    service2Desc: 'We help build a profile that meets university requirements and strengthens your chances of approval.',
    service3Title: 'Visa assistance',
    service3Desc: 'Our team prepares every supporting document and ensures your visa submission is complete and accurate.',
    service4Title: 'Legalization & paperwork',
    service4Desc: 'From authentication to translations, we handle every document so your file is ready for university and visa review.',
    service5Title: 'Finding accommodation',
    service5Desc: 'We connect you with trusted student housing and help secure the best location for your budget.',
    fullServiceTitle: 'End-to-end support with affordable service fees',
    fullServiceLead: 'We offer a complete consulting experience for international study applicants:',
    list1: 'Guidance to select the best university and degree program for your profile.',
    list2: 'Admission strategy that increases the chance of acceptance based on your academic profile.',
    list3: 'Complete visa assistance and document preparation for a smooth submission.',
    list4: 'Help with legalization, translations, and official paperwork at every stage.',
    list5: 'Assistance securing student accommodation in your destination city.',
    summary: 'In brief: we support you from start to end with transparent, affordable service fees and premium dedicated guidance.',
    applyNow: 'Apply Now',
    trackPlaceholder: 'Enter File ID or Key Code',
    trackButton: 'Track',
    fullServicePromise: 'Full service promise',
  },
  ar: {
    premiumTag: 'دعم طلابي متميز',
    heroTitle: 'دعم للدراسة في الخارج من أول تقديم حتى الوصول النهائي.',
    heroDesc: 'نساعدك في اختيار الجامعة المناسبة، وتأمين القبول، وتحضير ملف التأشيرة، وتوثيق الأوراق، والعثور على السكن الآمن — كل ذلك ضمن خدمة موثوقة.',
    service1Title: 'إرشاد لاختيار الجامعات',
    service1Desc: 'نراجع ملفك ونوصي بالبرامج التي تحقق أفضل فرص قبول ومنح دراسية.',
    service2Title: 'دعم قبول مضمون',
    service2Desc: 'نساعد في بناء ملف يلبي متطلبات الجامعة ويعزز فرص قبولك.',
    service3Title: 'مساعدة في التأشيرة',
    service3Desc: 'فريقنا يحضر جميع المستندات الداعمة ويضمن أن طلب التأشيرة مكتمل ودقيق.',
    service4Title: 'التوثيق والإجراءات',
    service4Desc: 'من التوثيق إلى الترجمة، نتولى كل الأوراق حتى يكون ملفك جاهزًا للمراجعة.',
    service5Title: 'العثور على السكن',
    service5Desc: 'نربطك بسكن طلابي موثوق ونساعدك في اختيار الموقع الأفضل لميزانيتك.',
    fullServiceTitle: 'دعم شامل برسوم خدمة ميسرة',
    fullServiceLead: 'نقدم تجربة استشارية كاملة للمتقدمين للدراسة الدولية:',
    list1: 'إرشاد لاختيار أفضل جامعة وبرنامج مناسب لملفك.',
    list2: 'استراتيجية قبول تزيد فرص القبول بناءً على ملفك الأكاديمي.',
    list3: 'مساعدة كاملة في التأشيرة وتحضير المستندات لتقديم سلس.',
    list4: 'مساعدة في التوثيق والترجمة والأوراق الرسمية في كل مرحلة.',
    list5: 'مساعدة في تأمين سكن طلابي موثوق في مدينة وجهتك.',
    summary: 'باختصار: ندعمك من البداية إلى النهاية برسوم خدمة شفافة وميسرة مع توجيه متميز.',
    applyNow: 'قدِّم الآن',
    trackPlaceholder: 'أدخل رقم الملف أو رمز الدخول',
    trackButton: 'تتبع',
    fullServicePromise: 'وعد الخدمة الشاملة',
  },
};

export default function Services({ onTrack, isDarkMode, lang = 'en' }) {
  const [trackId, setTrackId] = useState('');
  const t = translations[lang] || translations.en;
  const isRtl = lang === 'ar';
  const gridLayout = isRtl ? 'lg:grid-cols-[0.8fr_1.2fr]' : 'lg:grid-cols-[1.2fr_0.8fr]';

  const handleLocalTrack = async (event) => {
    event.preventDefault();
    if (!trackId.trim()) return;
    await onTrack(trackId.trim());
  };

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-[#0b1120] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <section className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className={`grid gap-10 ${gridLayout} items-center`}>
          <div className={`rounded-[2rem] border p-8 shadow-[0_40px_100px_-70px_rgba(0,0,0,0.5)] ${isDarkMode ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <p className="text-sm uppercase tracking-[0.3em] text-red-500">{t.fullServicePromise}</p>
                <h2 className="mt-2 text-3xl font-semibold">{t.fullServiceTitle}</h2>
              </div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-rose-400 text-white shadow-xl shadow-red-500/20">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.9 6.3 6.9 1-5 4.8 1.2 6.8L12 17.5 5 20.9l1.2-6.8-5-4.8 6.9-1L12 2z" />
                </svg>
              </div>
            </div>

            <div className={`space-y-4 text-sm leading-7 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              <p>{t.fullServiceLead}</p>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">✓</span>
                  <span>{t.list1}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">✓</span>
                  <span>{t.list2}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">✓</span>
                  <span>{t.list3}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">✓</span>
                  <span>{t.list4}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">✓</span>
                  <span>{t.list5}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-4">
              <div className={`rounded-3xl p-5 ${isDarkMode ? 'bg-slate-900/60 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.summary}</p>
              </div>

              <form onSubmit={handleLocalTrack} className="grid gap-3">
                <input
                  type="text"
                  placeholder={t.trackPlaceholder}
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition-colors ${
                    isDarkMode
                      ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full rounded-3xl bg-gradient-to-r from-red-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:scale-[1.01] hover:shadow-red-500/35"
                >
                  {t.trackButton}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 shadow-sm shadow-red-500/10">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-red-500 text-white">★</span>
              {t.premiumTag}
            </div>

            <div className={`space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{t.heroTitle}</h1>
              <p className={`max-w-2xl text-sm sm:text-base leading-7 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.heroDesc}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ServiceCard isDarkMode={isDarkMode} color="red" title={t.service1Title} description={t.service1Desc} />
              <ServiceCard isDarkMode={isDarkMode} color="amber" title={t.service2Title} description={t.service2Desc} />
              <ServiceCard isDarkMode={isDarkMode} color="cyan" title={t.service3Title} description={t.service3Desc} />
              <ServiceCard isDarkMode={isDarkMode} color="violet" title={t.service4Title} description={t.service4Desc} />
              <ServiceCard isDarkMode={isDarkMode} color="emerald" title={t.service5Title} description={t.service5Desc} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ isDarkMode, color, title, description }) {
  const colorMap = {
    red: 'bg-red-500/10 text-red-400',
    amber: 'bg-amber-500/10 text-amber-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    violet: 'bg-violet-500/10 text-violet-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
  };

  const iconMap = {
    red: 'M9 11l3 3L22 4 M21 12v7a4 4 0 0 1-4 4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    amber: 'M12 2l3 6 6 .7-4.5 4.5 1.1 6.3L12 17l-5.6 2.9L7.5 13 3 8.5 9 8z',
    cyan: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    violet: 'M4 7h16 M4 12h16 M4 17h16',
    emerald: 'M3 22h18 M7 10l5 5 5-5 M12 5v10',
  };

  return (
    <div className={`rounded-3xl border p-6 shadow-xl ${isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className={`rounded-2xl p-3 ${colorMap[color]}`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={iconMap[color]} />
          </svg>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</span>
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
