require('dotenv').config();
const { 
  Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, Routes 
} = require('discord.js');
const { REST } = require('@discordjs/rest');

// ✅ أضف هذا الجزء هنا (سيرفر ويب صغير ليبقي Replit شغال)
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('✅ Bot is online and running 24/7!'));
app.listen(3000, () => console.log('🌐 Web server is running to keep bot alive.'));
// ✅ انتهى الجزء الذي يخص التشغيل الدائم

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
});

const token = process.env.TOKEN;
const guildId = process.env.GUILD_ID;
const clientId = process.env.CLIENT_ID;

// ==================== بيانات الألعاب (بدون تغيير المحتوى الذي أعطيته سابقاً) ====================
const games = {
  '🧮 رياضيات': [
    { question: '7 × 6 - 2 = ?', choices: ['41', '40', '42'], answer: '40' },
    { question: '12 ÷ 4 + 5 = ?', choices: ['10', '9', '8'], answer: '8' },
    { question: '15 − 3 × 7 = ?', choices: ['-5', '-6', '-7'], answer: '-6' },
    { question: '8 + 8 ÷ 2 = ?', choices: ['12', '16', '14'], answer: '12' },
    { question: '7 × 7 − 7 + 7 ÷ 7 = ?', choices: ['7', '0', '43'], answer: '43' },
    { question: '20 ÷ 5 + 15 = ?', choices: ['17', '19', '18'], answer: '19' },
    { question: '9 × 3 − 8 = ?', choices: ['19', '27', '20'], answer: '19' },
    { question: '10 + 4 × 3 + 1 = ?', choices: ['23', '20', '27'], answer: '23' },
    { question: '18 ÷ 3 + 7 = ?', choices: ['13', '14', '15'], answer: '13' },
    { question: '100 − 9 × 8 = ?', choices: ['27', '26', '28'], answer: '28' },
  ],
  '🔤 حروف': [
    { question: 'الحروف: ي ف ض و ت →', choices: ['تفويض','توفيض','يفوضت'], answer: 'تفويض' },
    { question: 'الحروف: ك ا م ا ح ة →', choices: ['محاكاة','كاحامة','مكاحة'], answer: 'محاكاة' },
    { question: 'الحروف: ن ت ق ض ا →', choices: ['تناقض','نقادت','قنادت'], answer: 'تناقض' },
    { question: 'الحروف: ص ا ا ء ت س ع →', choices: ['استعصاء','عصاءاست','ساعاءت'], answer: 'استعصاء' },
    { question: 'الحروف: ب س ت ع ا ي →', choices: ['استيعاب','يعابست','استيعب'], answer: 'استيعاب' },
    { question: 'الحروف: ل م ة ض ع →', choices: ['معضلة','ضلمعه','دمعلة'], answer: 'معضلة' },
    { question: 'الحروف: ط ر ا د س ت →', choices: ['استطراد','طرادست','راداستط'], answer: 'استطراد' },
    { question: 'الحروف: ل ة و م ي ت ا →', choices: ['متوالية','تواليمة','واليةمت'], answer: 'متوالية' },
    { question: 'الحروف: ؤ ط ت و ا →', choices: ['تواطؤ','وطأتو','ؤطاوت'], answer: 'تواطؤ' },
    { question: 'الحروف: ر ب ا ت ص ا س →', choices: ['استبصار','صبراست','راباستص'], answer: 'استبصار' },
    { question: 'الحروف: ر ة ا ت ع س →', choices: ['استعارة','عارةست','رعةاست'], answer: 'استعارة' },
    { question: 'الحروف: ز ل ا خ ت →', choices: ['اختزال','زالخـت','تلخـاز'], answer: 'اختزال' },
    { question: 'الحروف: ر م ة غ ا ي →', choices: ['مغايرة','غايرةم','يرامغه'], answer: 'مغايرة' },
    { question: 'الحروف: ق ط ت ا ع →', choices: ['تقاطع','قاطتع','عتقاق'], answer: 'تقاطع' },
    { question: 'الحروف: ح ا ر ا س ض ت →', choices: ['استحضار','حضراست','رحادست'], answer: 'استحضار' },
    { question: 'الحروف: ب ت ع م ش →', choices: ['متشعب','شعبمت','بمتشع'], answer: 'متشعب' },
    { question: 'الحروف: ض ن ت م ا ق →', choices: ['متناقض','نقدمتا','ضمتناق'], answer: 'متناقض' },
    { question: 'الحروف: خ س ا ن ا ت →', choices: ['استنساخ','نساخاست','سانخاست'], answer: 'استنساخ' },
    { question: 'الحروف: ا ض ت د →', choices: ['تضاد','دادت','ضدت'], answer: 'تضاد' },
    { question: 'الحروف: ل ا ا ل ت ه س →', choices: ['استهلال','هللاسته','للاهست'], answer: 'استهلال' },
    { question: 'الحروف: ف ر ع ت م →', choices: ['متفرع','فرمعت','عفتمر'], answer: 'متفرع' },
    { question: 'الحروف: ا س ن ف ت ا ء →', choices: ['استئناف','نفااست','فناسئت'], answer: 'استئناف' },
    { question: 'الحروف: د ت ر ج →', choices: ['تدرج','درجت','جردت'], answer: 'تدرج' },
    { question: 'الحروف: ت ي ن ب ا م →', choices: ['متباين','ينبتم','باتينم'], answer: 'متباين' },
    { question: 'الحروف: ط ا ن ا س ت ب →', choices: ['استبطان','بطاناست','نابطاست'], answer: 'استبطان' },
    { question: 'الحروف: ت ف ظ ح م →', choices: ['متحفظ','تحفمظ','مفتحث'], answer: 'متحفظ' },
    { question: 'الحروف: ء ز ا س ه ت ا →', choices: ['استهزاء','هزاءست','أستهزا'], answer: 'استهزاء' },
    { question: 'الحروف: ج ر ت د →', choices: ['تجرد','درجت','جترد'], answer: 'تجرد' },
    { question: 'الحروف: ف ف ت ش ا س →', choices: ['استشفاف','شفافست','فاستشف'], answer: 'استشفاف' },
    { question: 'الحروف: ر ب ا ت ض →', choices: ['تضارب','رابتض','ضربات'], answer: 'تضارب' },
  ],
  '✅❌ صح أم خطأ': [
    { question: 'الاستنارة هي قدرة العقل على فهم الأمور بوضوح.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'التناقض يعني اتفاق فكرتين متعارضتين.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'المعضلة هي حل بسيط وواضح.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'الاستبطان هو النظر داخل النفس لتفسير السلوك.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'الاستدلال هو عملية اتخاذ قرار بدون أي دليل.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'الاستطراد يعني الابتعاد عن الموضوع الأساسي في الحديث.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'الاستعارة لغةً هي التشبيه باستخدام كلمة بشكل حرفي فقط.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'الاستعصاء يعني سهولة الحل.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'التواطؤ يعني تعاون مجموعة على فعل شيء خفي أو غير قانوني.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'الاستبصار يعني القدرة على رؤية المستقبل بدقة.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'الاستنباط يعني استنتاج الحقائق من الأدلة.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'الاستنساخ هو إنشاء نسخة مطابقة كليًا من شيء معين.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'المتشعب يعني شيء بسيط ومباشر.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'الاستشفاف يعني فهم الأمور عن طريق الاستنتاج والملاحظة.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'التضارب يعني اتفاق كامل بين وجهات النظر.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'الاستطلاع يعني جمع المعلومات قبل اتخاذ أي قرار.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'التدرج يعني الانتقال من مرحلة إلى أخرى بشكل مفاجئ.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'التفكيك يعني تحليل الشيء إلى أجزائه لتسهيل الفهم.', choices: ['✅', '❌'], answer: '✅' },
    { question: 'الاستثناء يعني شمول كل الحالات دون استبعاد أي شيء.', choices: ['✅', '❌'], answer: '❌' },
    { question: 'المتباين يعني اختلاف واضح بين عناصر الشيء.', choices: ['✅', '❌'], answer: '✅' },
  ],
  '🔍 ألغاز': [
    { question: 'شيء كلما أخذت منه كبر، ما هو؟', choices: ['الحفرة', 'الظل', 'الوقت'], answer: 'الحفرة' },
    { question: 'ما هو الشيء الذي يمشي ويقف وليس له أرجل؟', choices: ['الساعة', 'الطاولة', 'السيارة'], answer: 'الساعة' },
    { question: 'شيء يوجد في السماء وليس على الأرض، ما هو؟', choices: ['السحاب', 'الحجر', 'الماء'], answer: 'السحاب' },
    { question: 'أنا شيئان متضادان، ولكن لا يمكنك الفصل بينهما، ما هما؟', choices: ['الظلام والنور', 'الحرارة والبرودة', 'الحياة والموت'], answer: 'الظلام والنور' },
      { question: 'كلما حاولت السيطرة علي، أفلت منك، وما زلت موجوداً في كل لحظة، ما أنا؟', choices: ['الزمن', 'الوعي', 'القدر'], answer: 'الزمن' },
      { question: 'أنا بداية كل قرار ونهاية كل فكرة، لا يمكنك رؤيتي لكن تحدد مصيرك، ما أنا؟', choices: ['العقل', 'الإرادة', 'الزمان'], answer: 'الإرادة' },
      { question: 'أنا شيء لا يُرى، لكن كل ما حولك يتأثر بي، ما أنا؟', choices: ['الوعي', 'القدر', 'الزمن'], answer: 'الوعي' },
      { question: 'أنا حر بلا حدود، وأحيانًا قيودك تزيد من قوتي، ما أنا؟', choices: ['الفكر', 'الروح', 'الإرادة'], answer: 'الفكر' },
      { question: 'أنا موجود في كل شيء، وأحيانًا لا تشعر بي، لكني أغير كل شيء، ما أنا؟', choices: ['الزمن', 'المعرفة', 'الحياة'], answer: 'المعرفة' },
      { question: 'أحيانًا أكون ضوءًا وأحيانًا ظلامًا، أؤثر على كل روح، ما أنا؟', choices: ['الأخلاق', 'الوعي', 'القدر'], answer: 'الأخلاق' },
      { question: 'أنا شيء يربط الماضي بالحاضر والمستقبل، لا يمكن لمسه لكن يُحس، ما أنا؟', choices: ['الزمن', 'الوعي', 'الذاكرة'], answer: 'الزمن' },
      { question: 'أنا مفتاح الحرية ولكن لا يمكن امتلاكي، ما أنا؟', choices: ['المعرفة', 'الإرادة', 'الحقيقة'], answer: 'المعرفة' },
      { question: 'كل شخص يسعى إليّ، ومع ذلك لا يمكن الإمساك بي، ما أنا؟', choices: ['السعادة', 'الحقيقة', 'النجاح'], answer: 'السعادة' },
      { question: 'أنا الحقيقة التي تبحث عنها العقول، لكن لا يراها الجميع، ما أنا؟', choices: ['الواقع', 'الحكمة', 'الوعي'], answer: 'الواقع' },
      { question: 'أنا شيء يولد من الفكر وأحيانًا يقتل الإيمان، ما أنا؟', choices: ['الشك', 'المعرفة', 'الإبداع'], answer: 'الشك' },
      { question: 'أنا لا أتحرك، لكن كل شيء يتحرك من حولي، ما أنا؟', choices: ['الزمان', 'العقل', 'القدر'], answer: 'القدر' },
      { question: 'أنا الشيء الذي يغير العالم رغم صمتي، ما أنا؟', choices: ['الفكرة', 'الروح', 'الوعي'], answer: 'الفكرة' },
      { question: 'أنا شيء موجود في كل قلب وعقل، أحيانًا أسيطر وأحيانًا أختفي، ما أنا؟', choices: ['الحب', 'الوعي', 'الطموح'], answer: 'الوعي' }
  ],
  '💡 معلومات عامة': [
  { question: 'ما عاصمة دولة بوتان؟', choices: ['تيمفو', 'كامبالا', 'فيينا'], answer: 'تيمفو' },
    { question: 'من كتب كتاب "الجمهورية"؟', choices: ['أفلاطون', 'أرسطو', 'سقراط'], answer: 'أفلاطون' },
    { question: 'أي دولة لها أكبر عدد من اللغات الرسمية؟', choices: ['جنوب أفريقيا', 'الهند', 'سويسرا'], answer: 'جنوب أفريقيا' },
    { question: 'في أي قارة تقع دولة بوروندي؟', choices: ['أفريقيا', 'آسيا', 'أمريكا الجنوبية'], answer: 'أفريقيا' },
    { question: 'ما اسم أول لعبة فيديو تم إطلاقها تجارياً؟', choices: ['Pong', 'Tennis for Two', 'Spacewar!'], answer: 'Pong' },
    { question: 'من هو مؤسس الديانة الزرادشتية؟', choices: ['زرادشت', 'بوذا', 'كونفوشيوس'], answer: 'زرادشت' },
    { question: 'أي بحر يفصل بين أوروبا وأفريقيا؟', choices: ['البحر الأبيض المتوسط', 'البحر الأسود', 'البحر الأحمر'], answer: 'البحر الأبيض المتوسط' },
    { question: 'ما اسم أطول نهر في قارة آسيا؟', choices: ['اليانغتسي', 'الهانغ', 'الغانج'], answer: 'اليانغتسي' },
    { question: 'من هو مؤلف كتاب "هكذا تكلم زرادشت"؟', choices: ['نيتشه', 'هيغل', 'كانط'], answer: 'نيتشه' },
    { question: 'أي دولة تُعرف باسم "أرض الفيلة والجبال"؟', choices: ['الهند', 'تايلاند', 'نيبال'], answer: 'نيبال' },
    { question: 'ما اسم العملة الرسمية لدولة نيبال؟', choices: ['روبية نيبالية', 'روبل', 'باوند'], answer: 'روبية نيبالية' },
    { question: 'ما هو أعلى جبل في قارة أمريكا الجنوبية؟', choices: ['أكونكاغوا', 'إيفرست', 'كليمنجارو'], answer: 'أكونكاغوا' },
    { question: 'ما الدولة التي اخترعت الورق؟', choices: ['الصين', 'اليابان', 'مصر'], answer: 'الصين' },
    { question: 'من هو مؤسس الفلسفة الرواقية؟', choices: ['زينون الرواقي', 'أفلاطون', 'أرسطو'], answer: 'زينون الرواقي' },
    { question: 'أي دولة لديها أطول خط ساحلي في العالم؟', choices: ['كندا', 'روسيا', 'أستراليا'], answer: 'كندا' },
    { question: 'ما اسم أول مدينة في العالم استخدمت الكهرباء العامة؟', choices: ['لندن', 'نيويورك', 'باريس'], answer: 'لندن' },
    { question: 'في أي دولة يقع معبد الكرنك؟', choices: ['مصر', 'اليونان', 'تركيا'], answer: 'مصر' },
    { question: 'ما اسم أكبر صحراء في العالم؟', choices: ['الصحراء الكبرى', 'صحراء غوبي', 'صحراء كالهاري'], answer: 'الصحراء الكبرى' },
    { question: 'أي دولة أسست الإمبراطورية العثمانية؟', choices: ['تركيا', 'اليونان', 'العراق'], answer: 'تركيا' },
    { question: 'من هو مؤسس المذهب الفلسفي الديكارتي؟', choices: ['ديكارت', 'أفلاطون', 'هيغل'], answer: 'ديكارت' }
  ],
  '🎮 Guess the Emoji': [
    { question: '🦁👑', choices: ['The Lion King', 'Simba', 'King of Beasts'], answer: 'The Lion King' },
    { question: '🎬🌆💥', choices: ['Casablanca', 'Marrakech Express', 'Razzia'], answer: 'Casablanca' },
    { question: '🧙‍♂️💍', choices: ['Harry Potter', 'The Lord of the Rings', 'Merlin'], answer: 'The Lord of the Rings' },
    { question: '🎵💃🏽🕺🏽', choices: ['Hoba Hoba Spirit - 7 Class', 'Hatim Ammor - Mchiti Fiha', 'Fnaire - L7al'], answer: 'Hoba Hoba Spirit - 7 Class' },
    { question: '🚗⚡', choices: ['Fast & Furious', 'Tesla', 'Lightning McQueen'], answer: 'Lightning McQueen' },
    { question: '🎤🇲🇦💔', choices: ['Cheb Khaled - C’est La Vie', 'Saad Lamjarred - Ghaltana', 'Douzi - Laayoune'], answer: 'Saad Lamjarred - Ghaltana' },
    { question: '👑💔💀', choices: ['Game of Thrones', 'Romeo & Juliet', 'Hamlet'], answer: 'Game of Thrones' },
    { question: '🎤👑🌟', choices: ['Saad Lamjarred - Lm3allem', 'Asmaa Lamnawar - Ma Tfarkesh', 'Douzi - Galbi'], answer: 'Saad Lamjarred - Lm3allem' },
    { question: '🦖🏝️', choices: ['Jurassic Park', 'King Kong', 'The Lost World'], answer: 'Jurassic Park' },
    { question: '🎬🕌🏙️', choices: ['Razzia', 'Ali Zaoua', 'Casablanca'], answer: 'Razzia' },
    { question: '👁️🌌', choices: ['Interstellar', 'Inception', '2001: A Space Odyssey'], answer: 'Interstellar' },
    { question: '🎵🌊🏖️', choices: ['Hatim Ammor - Douni Liya', 'Fnaire - Smahli', 'Manal - Slay'], answer: 'Fnaire - Smahli' },
    { question: '🎸👨‍🎤👨‍🎤', choices: ['Queen', 'The Beatles', 'Coldplay'], answer: 'Queen' },
    { question: '🎤❤️🔥', choices: ['Saad Lamjarred - Ana Machi Sahel', 'Douzi - Mazal', 'Asmaa Lamnawar - Hayati'], answer: 'Saad Lamjarred - Ana Machi Sahel' },
    { question: '🕷️🧑', choices: ['Spider-Man', 'Ant-Man', 'Batman'], answer: 'Spider-Man' },
    { question: '🎬🏜️🧭', choices: ['Ali Zaoua', 'Casablanca', 'Adieu Carmen'], answer: 'Ali Zaoua' },
    { question: '🧟‍♂️🏙️', choices: ['The Walking Dead', 'Resident Evil', 'World War Z'], answer: 'The Walking Dead' },
    { question: '🎵🎶💃', choices: ['Manal - T3ish', 'Hatim Ammor - 3lik', 'Hoba Hoba Spirit - 7 Class'], answer: 'Manal - T3ish' },
    { question: '🪐🚀🌑', choices: ['Apollo 11', 'Interstellar', 'Gravity'], answer: 'Apollo 11' },
    { question: '🎬🕵️‍♂️🔪', choices: ['Razzia', 'Zero', 'Marrakech Express'], answer: 'Zero' },
    { question: '🧙‍♂️⚡', choices: ['Harry Potter', 'The Hobbit', 'Merlin'], answer: 'Harry Potter' },
    { question: '🦊🦉🏞️', choices: ['Fantastic Mr. Fox', 'Zootopia', 'Robin Hood'], answer: 'Fantastic Mr. Fox' },
    { question: '🦄🌈', choices: ['My Little Pony', 'The Last Unicorn', 'Shrek'], answer: 'The Last Unicorn' },
    { question: '🦸‍♂️🛡️🇺🇸', choices: ['Captain America', 'Iron Man', 'Thor'], answer: 'Captain America' },
  ],
  '🌍 أعلام الدول': [
    { question: '🇲🇭', choices: ['مارشال', 'مالطا', 'موريشيوس'], answer: 'مارشال' },
    { question: '🇹🇱', choices: ['تيمور الشرقية', 'تونس', 'تركمانستان'], answer: 'تيمور الشرقية' },
    { question: '🇧🇿', choices: ['بليز', 'بوليفيا', 'بنغلاديش'], answer: 'بليز' },
    { question: '🇸🇹', choices: ['ساو تومي وبرينسيب', 'سان مارينو', 'سانت كيتس ونيفيس'], answer: 'ساو تومي وبرينسيب' },
    { question: '🇧🇶', choices: ['البونير الكاريبية', 'باربادوس', 'برمودا'], answer: 'البونير الكاريبية' },
    { question: '🇲🇩', choices: ['مولدوفا', 'مدغشقر', 'مالطا'], answer: 'مولدوفا' },
    { question: '🇱🇨', choices: ['سانت لوسيا', 'سانت فنسنت', 'سانت كيتس ونيفيس'], answer: 'سانت لوسيا' },
    { question: '🇹🇳', choices: ['تونس', 'ليبيا', 'الجزائر'], answer: 'تونس' },
    { question: '🇨🇲', choices: ['الكاميرون', 'غينيا الاستوائية', 'جزر القمر'], answer: 'الكاميرون' },
    { question: '🇲🇿', choices: ['موزمبيق', 'مدغشقر', 'موريشيوس'], answer: 'موزمبيق' },
    { question: '🇨🇾', choices: ['قبرص', 'جورجيا', 'مالطا'], answer: 'قبرص' },
    { question: '🇬🇶', choices: ['غينيا الاستوائية', 'غامبيا', 'غابون'], answer: 'غينيا الاستوائية' },
    { question: '🇦🇩', choices: ['أندورا', 'أرمينيا', 'أذربيجان'], answer: 'أندورا' },
    { question: '🇱🇹', choices: ['ليتوانيا', 'لاتفيا', 'لوكسمبورغ'], answer: 'ليتوانيا' },
    { question: '🇧🇲', choices: ['برمودا', 'باهاماس', 'باربادوس'], answer: 'برمودا' },
    { question: '🇳🇺', choices: ['نيوي', 'نورو', 'ناورو'], answer: 'نيوي' },
    { question: '🇰🇲', choices: ['جزر القمر', 'كيريباتي', 'كمبوديا'], answer: 'جزر القمر' },
    { question: '🇵🇲', choices: ['سانت بيير وميكلون', 'سانت لوسيا', 'سانت كيتس ونيفيس'], answer: 'سانت بيير وميكلون' },
    { question: '🇸🇲', choices: ['سان مارينو', 'سانت فنسنت', 'سانت كيتس ونيفيس'], answer: 'سان مارينو' },
    { question: '🇱🇧', choices: ['لبنان', 'الأردن', 'سوريا'], answer: 'لبنان' },
  ],
  '🔢 تسلسل الأرقام': [
    { question: '2, 4, 8, 16, ?', choices: ['20', '32', '18'], answer: '32' },
    { question: '5, 10, 15, 20, ?', choices: ['25', '30', '22'], answer: '25' },
    { question: '1, 1, 2, 3, 5, ?', choices: ['8', '7', '6'], answer: '8' },
    { question: '10, 20, 40, 80, ?', choices: ['160', '150', '120'], answer: '160' },
    { question: '3, 6, 9, 12, ?', choices: ['15', '16', '14'], answer: '15' },
    { question: '2, 4, 6, 8, ?', choices: ['10', '12', '9'], answer: '10' },
    { question: '1, 4, 9, 16, ?', choices: ['20', '25', '30'], answer: '25' },
    { question: '2, 3, 5, 7, 11, ?', choices: ['13', '12', '15'], answer: '13' },
    { question: '0, 1, 1, 2, 3, 5, ?', choices: ['7', '8', '6'], answer: '8' },
    { question: '1, 2, 4, 8, 16, ?', choices: ['24', '32', '30'], answer: '32' },
  ],
  // برا السالفة ليست بحاجة لقائمة أسئلة — الموضوع سيختار عشوائياً من القائمة الداخلية
  'برا السالفة': []
};

// ==================== متغيرات الحالة العامة ====================
let players = {}; // map userId -> { name, points }
let hostId = null;
let currentGame = null;
let currentQuestionIndex = 0;
let currentTimeout = null;
let playerAnswered = {}; // من أجاب في السؤال الحالي للألعاب العادية

// ==================== متغيرات برا السالفة ====================
let brasalfaImposterId = null;
let brasalfaTheme = null;
let brasalfaVotes = {}; // voterId -> votedId
let brasalfaVoteMessage = null;
let brasalfaTimerInterval = null;
let brasalfaTimerValue = 0;

// قائمة المواضيع لِبرا السالفة كما طلبت
const BRASALFA_THEMES = [
  'بقرة','حصان','طفل','حاسوب','هاتف','أكل','ماء','سيارة','طائرة','قنينة','مدينة','كتاب','منزل','VIP','سرير',
  'شاحن','كرسي','حانوت','ملابس','طقس','ساعة','حقيبة','مفتاح','شجرة','وردة','باب','نافذة','قلم','حقيبة سفر',
  'جبل','بحر','جسر','مطر','سماء','نجمة','قمر','سحاب','طريق','قط','كلب','أرنب','لعبة','حذاء','مطبخ','ثلاجة',
  'فاكهة','خضار','موسيقى','هاتف ذكي','بحيرة','نهر','شاطئ','صحراء','غابة','زهرة','حديقة','سوق','مطعم','مستشفى',
  'مدرسة','جامعة','مكتبة','مسرح','سينما','ملعب','مسبح','مطار','محطة','قطار','حافلة','سفينة','قارب','مفتاح سيارة',
  'محفظة','نظارة','قبعة','معطف','قفاز','حذاء رياضي','حقيبة مدرسية','بطاقة','جواز سفر','ساعة يد','كاميرا','ميكروفون',
  'لوحة','موسيقى هادئة','بيانو','غيتار','طبول','كمان','عود','ميكروفون لاسلكي','لوحة فنية','تمثال','صورة','مسبحة',
  'كتاب تاريخ','رواية','قصة قصيرة','شعر','قصيدة','دفتر','أقلام تلوين','مسطرة','محايات','مسطرة حديدية','آلة حاسبة',
  'كمبيوتر محمول','لوحة مفاتيح','فأرة','شاشة','سماعات','ميكروفون','كابل','بطارية','شاحن سريع','سماعة أذن','راوتر',
  'هاتف محمول','تابلت','ساعة ذكية','نظارات واقع افتراضي','كمبيوتر مكتبي','قرص صلب','ذاكرة USB','كاميرا رقمية',
  'كاميرا مراقبة','سماعة بلوتوث','حقيبة رياضية','ملابس سباحة','قفازات رياضية','حذاء تسلق','خوذة','حقيبة ظهر','خريطة',
  'بوصلة','منظار','خيمة','مخيم','موقد','قدر','ملاعق','سكاكين','شوكة','صحن','كوب','زجاجة ماء','وجبة','فطور','غداء',
  'عشاء','حلويات','كيك','شوكولاتة','حلوى','فواكه','خضروات','خبز','حليب','جبن','بيض','لحم','دجاج','سمك','أرز','معكرونة',
  'صلصة','زيت','خل','ملح','فلفل','بهارات','شاي','قهوة','عصير','ماء غازي','عصير طبيعي','مثلجات','شمس','قمر','نجوم',
  'سحاب','ريح','ثلج','مطر','عاصفة','برق','رعد','صيف','شتاء','خريف','ربيع','نهار','ليل','صباح','مساء','غروب','شروق',
  'جبال','تلال','سهول','وديان','صحراء','غابة','نهر','بحيرة','شلال','شاطئ','مرفأ','مدينة','قرية','بلدة','جزيرة',
  'سفينة','قارب','طائرة','مطار','محطة قطار','حافلة','سيارة أجرة','دراجة','حمار','حصان','جمل','طريق','جسر','نفق',
  'بوابة','باب','نافذة','سقف','حائط','أرضية','سلم','مصعد','شقة','منزل','فيلا','قصر','مطبخ','حمام','غرفة نوم','غرفة معيشة',
  'حديقة','شرفة','سطح','حوض سباحة','مصعد','مصعد كهربائي','باب حديدي','بوابة خشبية','نوافذ زجاجية'
];


// ==================== تسجيل أوامر سلاش ====================
const commands = [
  new SlashCommandBuilder().setName('startgames').setDescription('Start a game session!').toJSON()
];
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Commands registered.');
  } catch (error) {
    console.error('Register commands error:', error);
  }
})();

// ==================== جاهزية البوت ====================
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ==================== تفاعل مع الأوامر و الأزرار ====================
client.on('interactionCreate', async interaction => {
  try {
    // سلاش كوماند بدء لوب الألعاب
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'startgames') {
        hostId = interaction.user.id;
        players = {};
        currentGame = null;
        currentQuestionIndex = 0;

        const buttons = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder().setCustomId('join_game').setLabel('انضمام').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('start_game').setLabel('بدء اللعبة').setStyle(ButtonStyle.Success)
          );

        return interaction.reply({
          content: `🎮 **لوبي الألعاب**\nالمضيف: <@${hostId}>\nاللاعبون: لا أحد\nاختر فئة للعب:`,
          components: [buttons]
        });
      }
    }

    // أزرار
    if (interaction.isButton()) {

      // انضمام لاعب
      if (interaction.customId === 'join_game') {
        if (!players[interaction.user.id]) {
          players[interaction.user.id] = { name: interaction.user.username, points: 0 };
        }
        const playerNames = Object.values(players).map(p => p.name).join(', ') || 'None';
        return interaction.update({
          content: `🎮 **لوبي الألعاب**\nالمضيف: <@${hostId}>\nاللاعبون: ${playerNames}\nاختر فئة للعب:`,
          components: interaction.message.components
        });
      }

      // بدء اختيار الفئة (المضيف فقط)
      if (interaction.customId === 'start_game') {
        if (interaction.user.id !== hostId) return interaction.reply({ content: 'فقط المضيف يستطيع البدء!', ephemeral: true });

        const gameNames = Object.keys(games);
        const rows = [];
        let currentRow = new ActionRowBuilder();

        for (let i = 0; i < gameNames.length; i++) {
          currentRow.addComponents(
            new ButtonBuilder().setCustomId(`play_${i}`).setLabel(gameNames[i]).setStyle(ButtonStyle.Primary)
          );
          if ((i + 1) % 5 === 0 || i === gameNames.length - 1) {
            rows.push(currentRow);
            currentRow = new ActionRowBuilder();
          }
        }

        return interaction.update({
          content: 'اختر فئة للبدء:',
          components: rows
        });
      }

      // اختار فئة للعب
      if (interaction.customId.startsWith('play_')) {
        const idx = parseInt(interaction.customId.split('_')[1]);
        currentGame = Object.keys(games)[idx];
        currentQuestionIndex = 0;
        playerAnswered = {};
        // reset brasalfa state
        brasalfaImposterId = null;
        brasalfaTheme = null;
        brasalfaVotes = {};
        brasalfaVoteMessage = null;
        if (brasalfaTimerInterval) { clearInterval(brasalfaTimerInterval); brasalfaTimerInterval = null; }

        await interaction.update({ content: `🎮 بدء فئة **${currentGame}**!`, components: [] });

        // إذا الفئة برا السالفة، ابدأها بخاصيةها الخاصة
        if (currentGame === 'برا السالفة') {
          return startBrasalfaRound(interaction.channel);
        } else {
          return sendQuestion(interaction.channel);
        }
      }

      // إجابة على الألعاب العادية
      if (interaction.customId.startsWith('answer_') && currentGame && currentGame !== 'برا السالفة') {
        const player = players[interaction.user.id];
        if (!player) return interaction.reply({ content: 'أنت لست مشاركاً في اللعبة.', ephemeral: true });
        if (playerAnswered[interaction.user.id]) return interaction.reply({ content: 'لقد أجبت بالفعل على هذا السؤال!', ephemeral: true });

        playerAnswered[interaction.user.id] = true;
        const question = games[currentGame][currentQuestionIndex];
        const chosenIndex = parseInt(interaction.customId.replace('answer_', ''), 10);
        const selectedAnswer = question.choices[chosenIndex];
        const correct = question.answer;

        if (selectedAnswer === correct) {
          player.points += 10;
          return interaction.reply({ content: `✅ إجابة صحيحة! نقاطك الآن: ${player.points}`, ephemeral: true });
        } else {
          return interaction.reply({ content: `❌ إجابة خاطئة! الإجابة الصحيحة: **${correct}**`, ephemeral: true });
        }
      }

      // تصويت برا السالفة
      if (interaction.customId.startsWith('vote_') && currentGame === 'برا السالفة') {
        const voterId = interaction.user.id;
        const votedId = interaction.customId.replace('vote_', '');

        if (!players[voterId]) return interaction.reply({ content: 'أنت لست مشاركاً في اللعبة.', ephemeral: true });
        if (!players[votedId]) return interaction.reply({ content: 'اللاعب المصوت عليه غير موجود أو مُستبعد.', ephemeral: true });
        if (brasalfaVotes[voterId]) return interaction.reply({ content: 'لقد صوتت بالفعل!', ephemeral: true });

        brasalfaVotes[voterId] = votedId;
        await interaction.reply({ content: `✅ تم تسجيل صوتك ضد **${players[votedId].name}**`, ephemeral: true });

        // إن صوت كل اللاعبين الحاليين (باستثناء حالات استبعاد محتملة) ننهي الجولة فوراً
        const aliveIds = Object.keys(players);
        const totalAlive = aliveIds.length;
        const votesCount = Object.keys(brasalfaVotes).length;
        if (votesCount >= totalAlive) {
          // إذا صوت الجميع نُنهي الجولة الآن
          await finishBrasalfaRound(interaction.channel);
        }
      }
    }
  } catch (err) {
    console.error('interaction error:', err);
    // لا نُعيد إرسال استثناء للمستخدم (ephemeral) لأن بعض الأوقات التفاعل انتهى
  }
});

// ==================== إرسال أسئلة الفئات العادية ====================
async function sendQuestion(channel) {
  if (!currentGame) return channel.send('لم يتم اختيار فئة.');
  if (!games[currentGame]) return channel.send('الفئة المحددة غير موجودة.');

  if (currentQuestionIndex >= games[currentGame].length) {
    // إعلان نتائج الفئة
    const results = Object.values(players).map(p => `${p.name}: ${p.points} pts`).join('\n') || 'لا يوجد لاعبين';
    await channel.send(`🏁 **انتهت الفئة!**\n${results}`);

    // إعلان فائز الأعلى نقاط
    const arr = Object.values(players);
    if (arr.length > 0) {
      const top = arr.reduce((a,b) => (a.points > b.points ? a : b));
      await channel.send(`🎉 **${top.name}** فائز الفئة!`);
    }

    // إعادة تهيئة متواضعة
    players = {}; hostId = null; currentGame = null; currentQuestionIndex = 0;
    return;
  }

  // إرسال السؤال الحالي
  playerAnswered = {};
  const question = games[currentGame][currentQuestionIndex];
  const rows = [];
  let row = new ActionRowBuilder();

  // نستخدم index كـ customId لتجنب مشاكل النصوص/إيموجي
  for (let i = 0; i < question.choices.length; i++) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`answer_${i}`)
        .setLabel(question.choices[i])
        .setStyle(ButtonStyle.Primary)
    );
    if ((i+1) % 5 === 0 || i === question.choices.length - 1) {
      rows.push(row);
      row = new ActionRowBuilder();
    }
  }

  await channel.send({ content: `❓ ${question.question}\n⏳ لديك 10 ثوانٍ للإجابة!`, components: rows });

  if (currentTimeout) clearTimeout(currentTimeout);
  currentTimeout = setTimeout(() => {
    currentQuestionIndex++;
    sendQuestion(channel);
  }, 10000);
}

// ==================== بدء جولة برا السالفة ====================
async function startBrasalfaRound(channel) {
  const playerIds = Object.keys(players);
  if (playerIds.length < 3) {
    await channel.send('❗ يجب أن يكون هناك على الأقل 3 لاعبين للعب "برا السالفة".');
    return;
  }

  // تهيئة الأصوات/المتغيرات
  brasalfaVotes = {};
  if (brasalfaTimerInterval) { clearInterval(brasalfaTimerInterval); brasalfaTimerInterval = null; }

  // اختيار المخادع عشوائياً
  brasalfaImposterId = playerIds[Math.floor(Math.random() * playerIds.length)];

  // اختيار الموضوع عشوائياً
  brasalfaTheme = BRASALFA_THEMES[Math.floor(Math.random() * BRASALFA_THEMES.length)];

  // إرسال DM للّاعبين الذين يعرفون الموضوع (كل اللاعبين ما عدا المخادع)
  for (const id of playerIds) {
    if (id === brasalfaImposterId) continue; // لا نبعث للمخادع
    try {
      const user = await client.users.fetch(id);
      await user.send(`🔒 موضوع "برا السالفة": **${brasalfaTheme}**\n(هذا سرّي — لا تخبر المخادع!)`);
    } catch (err) {
      // فشل إرسال DM: نعلم المضيف كيّ يتأكد من تفعيل الرسائل الخاصة للاعب
      console.warn(`Failed to DM ${id}:`, err.message);
      try {
        await channel.send(`<@${id}> لم يتمكن البوت من إرسال رسالة خاصة له. اطلب منه تفعيل الرسائل الخاصة (DM).`);
      } catch {}
    }
  }

  // نعلن ان اللعبة قد بدأت (نذكر عدد اللاعبين، لكن لا نذكر الموضوع)
  await channel.send(`🎲 **برا السالفة**: اللعبة بدأت!\nهناك مخادع واحد بين ${playerIds.length} لاعبين. ابدأ التصويت لمعرفة من المخادع.\n(الموضوع مُرسَل سرّياً للاعبين غير المخادع)`);

  // إرسال رسالة التايمر (ستُحدّث كل 10 ثواني)
  brasalfaTimerValue = 300;
  brasalfaVoteMessage = await channel.send(`⏳ الوقت المتبقي: ${brasalfaTimerValue}s`);

  // إرسال أزرار التصويت (أسماء اللاعبين الحيين)
  const voteRows = [];
  let row = new ActionRowBuilder();
  for (let i = 0; i < playerIds.length; i++) {
    const pid = playerIds[i];
    row.addComponents(
      new ButtonBuilder().setCustomId(`vote_${pid}`).setLabel(players[pid].name).setStyle(ButtonStyle.Danger)
    );
    if ((i+1) % 5 === 0 || i === playerIds.length - 1) {
      voteRows.push(row);
      row = new ActionRowBuilder();
    }
  }
  await channel.send({ content: '🗳️ صوت الآن: اختر من تعتقد أنه المخادع', components: voteRows });

  // بدء الإنترفال لتحديث التايمر كل 10 ثواني
  brasalfaTimerInterval = setInterval(async () => {
    brasalfaTimerValue -= 10;
    if (brasalfaVoteMessage && !brasalfaVoteMessage.deleted) {
      try {
        await brasalfaVoteMessage.edit(`⏳ الوقت المتبقي: ${brasalfaTimerValue}s`);
      } catch (_) {}
    }
    if (brasalfaTimerValue <= 0) {
      clearInterval(brasalfaTimerInterval);
      brasalfaTimerInterval = null;
      await finishBrasalfaRound(channel);
    }
  }, 10000);
}

// ==================== إنهاء جولة برا السالفة (بما في ذلك الاستبعاد أو الفوز) ====================
async function finishBrasalfaRound(channel) {
  // إيقاف الإنترفال إن كان شغالا
  if (brasalfaTimerInterval) { clearInterval(brasalfaTimerInterval); brasalfaTimerInterval = null; }

  // إبطال أزرار التصويت (إذا كنا نحتفظ برسالة الاصوات)
  try {
    // نبحث أخر رسالة تحتوي على أزرار (قد لا نمتلك المرجع في بعض الحالات)، لذا نحاول تحرير brasalfaVoteMessage إذا موجود
    if (brasalfaVoteMessage) {
      const msg = await channel.messages.fetch(brasalfaVoteMessage.id).catch(() => null);
      if (msg) {
        // نُعطِّل كل المكونات
        const disabled = msg.components.map(row => {
          // لكل زر ننسخ وضعه كـ disabled
          const newRow = ActionRowBuilder.from(row);
          newRow.components = newRow.components.map(c => ButtonBuilder.from(c).setDisabled(true));
          return newRow;
        });
        await msg.edit({ components: disabled }).catch(() => {});
      }
    }
  } catch (err) {
    // تجاهل الأخطاء عند تعطيل الأزرار
    console.warn('Failed to disable vote buttons:', err.message);
  }

  // إذا لم يصوّت أحد => اللاعبون يفوزون
  if (Object.keys(brasalfaVotes).length === 0) {
    await channel.send(`✅ لم يصوّت أحد. **اللاعبون يفوزون!** المخادع كان: **${players[brasalfaImposterId].name}**`);
    // إعادة التهيئة النهائية
    players = {}; hostId = null; currentGame = null; currentQuestionIndex = 0;
    brasalfaImposterId = null; brasalfaTheme = null; brasalfaVotes = {}; brasalfaVoteMessage = null;
    return;
  }

  // عدّ الأصوات
  const counts = {}; // votedId -> count
  for (const voter in brasalfaVotes) {
    const voted = brasalfaVotes[voter];
    if (!counts[voted]) counts[voted] = 0;
    counts[voted]++;
  }

  // من حصل على أعلى أصوات
  let max = 0;
  let topId = null;
  for (const id in counts) {
    if (counts[id] > max) { max = counts[id]; topId = id; }
  }

  // إذا الأكثر أصوات هو المخادع => يفوز اللاعبون
  if (topId && topId === brasalfaImposterId) {
    await channel.send(`🏆 اللاعبون اكتشفوا المخادع! المخادع كان: **${players[brasalfaImposterId].name}**`);
    // إعادة تهيئة اللعبة
    players = {}; hostId = null; currentGame = null; currentQuestionIndex = 0;
    brasalfaImposterId = null; brasalfaTheme = null; brasalfaVotes = {}; brasalfaVoteMessage = null;
    return;
  }

  // خلاف ذلك: يُستبعد اللاعب المصوت عليه (topId) من اللعبة، وتستمر اللعبة
  if (topId && players[topId]) {
    const eliminatedName = players[topId].name;
    // نحذف اللاعب من القائمة
    delete players[topId];

    await channel.send(`🔻 تم استبعاد اللاعب **${eliminatedName}** (لم يكن المخادع). اللعبة تستمر...`);

    // إذا بقى فقط المخادع وآخر واحد => المخادع يفوز
    const remainingIds = Object.keys(players);
    if (remainingIds.length <= 2) {
      // إذا تبقى 2 أو أقل (عادة المخادع + لاعب واحد) نعتبر المخادع فائزاً
      await channel.send(`💀 المخادع يفوز! المخادع كان: **${players[brasalfaImposterId] ? players[brasalfaImposterId].name : 'مجهول'}**`);
      // إعادة تهيئة
      players = {}; hostId = null; currentGame = null; currentQuestionIndex = 0;
      brasalfaImposterId = null; brasalfaTheme = null; brasalfaVotes = {}; brasalfaVoteMessage = null;
      return;
    }

    // غير ذلك: نبدأ جولة جديدة بنفس المخادع ونفس الموضوع مع اللاعبين المتبقين
    brasalfaVotes = {};
    brasalfaVoteMessage = null;
    // نبعث الموضوع سرّياً للاعبين المتبقين (ما عدا المخادع)
    for (const id of remainingIds) {
      if (id === brasalfaImposterId) continue;
      try {
        const user = await client.users.fetch(id);
        await user.send(`🔒 [جولة جديدة] موضوع "برا السالفة": **${brasalfaTheme}**`);
      } catch (err) {
        // تجاهل مشكلة DM
      }
    }

    // نعرض رسالة توضيحية ثم نرسل أزرار تصويت جديدة ونعيد التايمر
    await channel.send(`🔁 جولة جديدة: ابدأوا التصويت مرة أخرى لاستبعاد المخادع.\n(الموضوع ما زال: سرّي لدى اللاعبين غير المخادع)`);

    // إرسال زر التصويت الجديد
    const newVoteRows = [];
    let row = new ActionRowBuilder();
    let i = 0;
    for (const pid of remainingIds) {
      row.addComponents(new ButtonBuilder().setCustomId(`vote_${pid}`).setLabel(players[pid].name).setStyle(ButtonStyle.Danger));
      i++;
      if (i % 5 === 0) { newVoteRows.push(row); row = new ActionRowBuilder(); }
    }
    if (row.components && row.components.length > 0) newVoteRows.push(row);
    brasalfaVoteMessage = await channel.send({ content: '🗳️ صوت الآن (جولة جديدة)', components: newVoteRows });

    // إعادة تشغيل التايمر
    brasalfaTimerValue = 180;
    const timerMsg = await channel.send(`⏳ الوقت المتبقي: ${brasalfaTimerValue}s`);
    brasalfaTimerInterval = setInterval(async () => {
      brasalfaTimerValue -= 10;
      try { await timerMsg.edit(`⏳ الوقت المتبقي: ${brasalfaTimerValue}s`); } catch {}
      if (brasalfaTimerValue <= 0) {
        clearInterval(brasalfaTimerInterval);
        brasalfaTimerInterval = null;
        await finishBrasalfaRound(channel);
      }
    }, 10000);
    return;
  } else {
    // لا يوجد topId (نادرة) -> نعلن تعادل/لا فائز -> نعيد التهيئة
    await channel.send('❗ تعذّر تحديد لاعب مصوّت عليه - تنهي الجولة بدون فائز واضح.');
    players = {}; hostId = null; currentGame = null; currentQuestionIndex = 0;
    brasalfaImposterId = null; brasalfaTheme = null; brasalfaVotes = {}; brasalfaVoteMessage = null;
    return;
  }
}

// ==================== تسجيل الدخول للبوت ====================
client.login(token);
