(function(){
const $=(s,c=document)=>c.querySelector(s);
window.$=$;window.$$=(s,c=document)=>[...c.querySelectorAll(s)];

const main=$('main');
if(main){
 main.id=main.id||'main-content';
 main.tabIndex=-1;
 const skip=document.createElement('a');
 skip.className='skip-link';
 skip.href='#'+main.id;
 skip.textContent='Skip to main content';
 document.body.insertBefore(skip,document.body.firstChild);
}

const translations={
 en:{
  nav:{
   home:'Home',
   about:'About Us',
   programs:'Programs',
   news:'News & Events',
   gallery:'Gallery',
   downloads:'Downloads',
   contact:'Contact Us',
   register:'Register',
   fees:'Tuition Fees',
   faq:'FAQ',
   admin:'Admin'
  },
  cta:{
   apply:'Apply Now',
   explore:'Explore Programs'
  },
  hero:{
   schoolYear:'School Year',
   starts:'Starts September 2026',
   summary:'Secure your place at KTSS for O\'Level, Software Development or Accounting, with practical training that prepares you for work and further study.',
   why:'Why Choose KTSS?',
   whyLead:'Joining KTSS today will pave your way to a successful and bright future in your career.',
   programsTitle:'Our Programs',
   programsLead:"KTSS offers O'Level, Software Development and Accounting."
  },
  about:{
   pageTitle:'About Us',
   pageIntro:'Who we are and what we stand for.',
   tabs:{principal:"Principal's Message",mission:'Mission and Vision',staff:'Staff',youth:'KTSS Youth'},
   panels:{principalTitle:"Principal's Message",missionTitle:'Mission and Vision',missionLabel:'Mission',visionLabel:'Vision',staffTitle:'Staff',youthTitle:'KTSS Youth'},
   principalText:"Add the principal's welcome message here. Say who the school serves, what students can expect, and an invitation to apply.",
   principalRole:'Principal, KTSS',
   missionText:"Add the school's mission statement here.",
   visionText:"Add the school's vision statement here.",
   youthText:'Describe the student clubs, groups and activities here, and how new students can join.'
  },
  programsPage:{
   pageTitle:'Programs',
   pageIntro:'Choose a program to see what you will learn and what you need to apply.',
   search:'Search programs',
   empty:'No program matches your search.'
  },
  programPage:{
   pageTitle:'Program details',
   pageIntro:'Duration, level and admission requirements.',
   back:'← All programs',
   duration:'Duration',
   level:'Level',
   start:'Start',
   learn:'What you will learn',
   requirements:'Admission requirements',
   notFound:'Program not found.',
   seeAll:'See all programs',
   applyFor:'Apply for',
   startMonth:'September 2026'
  },
  register:{
   pageTitle:'Apply to KTSS',
   pageIntro:'Complete the three steps. Required fields are marked *.',
   formTitle:'Application Form',
   steps:{personal:'Personal Info',contact:'Contact Info',docs:'Documents & Submit'},
   personalTitle:'Personal Information',
   contactTitle:'Contact Information',
   docsTitle:'Documents & Submit',
   labels:{firstName:'First Name',lastName:'Last Name',gender:'Gender',dob:'Date of Birth',program:'Program',nationality:'Nationality',residence:'Place of Residence',phone:'Phone',email:'Email',parentName:'Parent / Guardian Name',parentPhone:'Parent / Guardian Phone',health:'Health Insurance',photo:'Passport Photo'},
   placeholders:{firstName:'First Name',lastName:'Last Name',nationality:'Your Nationality',residence:'Your Place of Residence',phone:'+250 ...',email:'name@example.com',parentName:'Parent or guardian',parentPhone:'+250 ...',health:'e.g. RSSB'},
   optionSelect:'Select an Option',
   errors:{firstName:'Enter your first name.',lastName:'Enter your last name.',gender:'Select a gender.',dob:'Choose a valid date of birth.',program:'Select a program.',phone:'Enter a phone number with at least 9 digits.',email:'Enter a valid email address.',parentName:'Enter a parent or guardian name.',parentPhone:'Enter a phone number with at least 9 digits.'},
   feeHint:'Select a program to see its tuition fee.',
   upload:'Upload Passport Photo',
   uploadInfo:'JPG, PNG, WEBP allowed. Maximum size: 2MB.',
   uploadError:'Use a JPG, PNG or WEBP image.',
   uploadTooBig:'Image is larger than 2MB. Choose a smaller one.',
   uploadReadError:'Could not read the selected passport photo. Please try another file.',
   submitError:'We could not submit your application. Please try again.',
   serviceUnavailable:'The application service is unavailable. Please try again later.',
   next:'Next',
   back:'Back',
   submit:'Submit Application',
   successTitle:'Application received',
   successText:'Thank you. KTSS will contact you using the phone number you provided.',
   successNote:'Keep this request reference for follow-up.',
   selectProgram:'Select a program',
   programFee:'RWF per term',
   fileLabel:'Passport photo upload'
  },
  admin:{
   loginTitle:'Admin sign in',
   staffOnly:'For KTSS staff only.',
   username:'Username',
   password:'Password',
   signIn:'Sign in',
   workspace:'KTSS ADMIN WORKSPACE',
   dashboardTitle:'Application requests',
   dashboardIntro:'Review submissions, track decisions, and export your records.',
   refresh:'Refresh',
   export:'Export CSV',
   logout:'Sign out',
   total:'Total requests',
   new:'New',
   reviewing:'In review',
   accepted:'Accepted',
   rejected:'Declined',
   allRequests:'All requests',
   search:'Search',
   searchPlaceholder:'Name, email, phone, or request ID',
   status:'Status',
   allStatuses:'All statuses',
   program:'Program',
   allPrograms:'All programs',
   from:'From',
   to:'To',
   applicant:'Applicant',
   submitted:'Submitted',
   actions:'Actions',
   loading:'Loading requests...',
   previous:'Previous',
   next:'Next',
   requestDetail:'REQUEST DETAIL',
   passportPhoto:'Passport photo',
   updateStatus:'Update status',
   internalNotes:'Internal notes',
   notesPlaceholder:'Notes visible only to signed-in administrators',
   close:'Close',
   save:'Save changes',
   showing:'Showing',
   of:'of',
   requests:'requests',
   page:'Page',
   noRequests:'No requests match these filters.',
   viewRequest:'View',
   requestId:'Request ID',
   gender:'Gender',
   dateOfBirth:'Date of birth',
   nationality:'Nationality',
   residence:'Residence',
   phone:'Phone',
   email:'Email',
   guardianName:'Parent / guardian',
   guardianPhone:'Parent / guardian phone',
   healthInsurance:'Health insurance',
   lastUpdated:'Last updated',
   loadingDetail:'Loading request...',
   detailUnavailable:'Request unavailable',
   sessionExpired:'Your admin session has ended. Please sign in again.',
   requestFailed:'Request failed. Please try again.',
   exportFailed:'Could not export applications.',
   statusNames:{new:'New',reviewing:'In review',accepted:'Accepted',rejected:'Declined'}
  },
  faq:{
   title:'Frequently Asked Questions',
   intro:'Quick answers about joining KTSS.',
   search:'Search questions',
   empty:'No question matches.',
   ask:'Ask the school'
  },
  textSize:'Text size',
  openTextControls:'Open text size controls',
  decrease:'Decrease text size',
  increase:'Increase text size',
  reset:'Reset',
  skip:'Skip to main content',
  openMenu:'Open menu',
  backTop:'Back to top',
  language:'Language',
  prevSlide:'Previous photo',
  nextSlide:'Next photo',
  pause:'Pause slideshow',
  play:'Play slideshow',
  photo:'Photo',
  of:'of'
 },
 rw:{
  nav:{
   home:'Ahabanza',
   about:'Ibyerekeye KTSS',
   programs:'Amashami',
   news:'Amakuru n\'ibikorwa',
   gallery:'Amafoto',
   downloads:'Ibyo gukuramo',
   contact:'Tuvugane',
   register:'Kwiyandikisha',
   fees:"Amafaranga y'ishuri",
   faq:'Ibibazo bikunze kubazwa',
   admin:'Ubuyobozi'
  },
  text:{
   'Quick links':'Ihuza ryihuse',
   'Reading preferences':'Ibyo guhitamo mu gusoma',
   'Language switcher':'Guhindura ururimi',
   'KTSS in action':'KTSS mu bikorwa',
   'KTSS home':'Ahabanza ha KTSS',
   'TECHNICAL SECONDARY SCHOOL':"ISHURI RYISUMBUYE RY'IMYUGA N'UBUMENYI",
   'KTSS students collaborating in the computer lab':'Abanyeshuri ba KTSS bafatanyiriza mu cyumba cya mudasobwa',
   "KTSS O'Level students learning together":'Abanyeshuri ba KTSS biga amasomo yisumbuye bafatanyije',
   'KTSS students studying accounting together':'Abanyeshuri ba KTSS biga ibaruramari bafatanyije',
   '| All Rights Reserved — KTSS Technical Secondary School':'| Uburenganzira bwose ni ubwa KTSS',
   'Main':'Ibikubiyemo',
   'Admin login':'Kwinjira kw\'ubuyobozi',
   'For KTSS staff only.':'Bigenewe abakozi ba KTSS gusa.',
   'Username':'Izina ry\'ukoresha',
   'Password':'Ijambo ry\'ibanga',
   'Log in':'Injira',
   'Contact Us':'Tuvugane',
   'We reply during office hours, Monday to Friday.':'Dusubiza mu masaha y\'akazi, kuva kuwa mbere kugeza kuwa gatanu.',
   'Visit or call':'Dusuure cyangwa uduhamagare',
   'Phone':'Telefoni',
   'Email':'Imeyili',
   'Hours':'Amasaha',
   'Monday - Friday: 8:00 AM - 5:00 PM':'Kuwa mbere - kuwa gatanu: 8:00 - 17:00',
   'Address':'Aderesi',
   'Your address, Rwanda':'Aderesi yanyu, u Rwanda',
   'Send a message':'Ohereza ubutumwa',
   'Your name':'Amazina yawe',
   'Enter your name.':'Andika amazina yawe.',
   'Enter a valid email address.':'Andika imeyili yemewe.',
   'First name is required.':'Izina rya mbere rirakenewe.',
   'Last name is required.':'Izina ry\'umuryango rirakenewe.',
   'Choose a valid gender.':'Hitamo igitsina cyemewe.',
   'Choose a valid date of birth.':'Hitamo itariki y\'amavuko yemewe.',
   'Choose a valid program.':'Hitamo ishami ryemewe.',
   'Enter a valid phone number.':'Andika nimero ya telefoni yemewe.',
   'Enter a valid parent or guardian phone number.':'Andika nimero ya telefoni y\'umubyeyi cyangwa umurera yemewe.',
   'Parent or guardian name is required.':'Izina ry\'umubyeyi cyangwa umurera rirakenewe.',
   'Passport photo must be smaller than 2 MB.':'Ifoto ya pasiporo igomba kuba iri munsi ya 2 MB.',
   'Passport photo must be a JPG, PNG, or WEBP image.':'Ifoto ya pasiporo igomba kuba JPG, PNG cyangwa WEBP.',
   'The passport photo file does not match its image type.':'Ubwoko bw\'ifoto ntibuhuye n\'ubwoko bwatoranyijwe.',
   'Could not save your application. Please try again later.':'Ubusabe ntibwabitswe. Ongera ugerageze nyuma.',
   'The application service is unavailable. Please try again later.':'Serivisi yo kwakira ubusabe ntiboneka ubu. Ongera ugerageze nyuma.',
   'Request failed. Please try again.':'Ubusabe ntibwakunze. Ongera ugerageze.',
   'Message':'Ubutumwa',
   'Write at least 10 characters.':'Andika nibura inyuguti 10.',
   'Send message':'Ohereza ubutumwa',
   'Message received':'Ubutumwa bwakiriwe',
   'Thank you. We will reply by email.':'Murakoze. Tuzabasubiza kuri imeyili.',
   'Demo only: this form does not send data anywhere yet.':'Urugero gusa: iyi fomu ntirashyikiriza amakuru ahandi.',
   'Frequently Asked Questions':'Ibibazo bikunze kubazwa',
   'Quick answers about joining KTSS.':'Ibisubizo byihuse ku bijyanye no kwiga muri KTSS.',
   'Search questions':'Shakisha ibibazo',
   'Fees for the 2026-2027 school year.':'Amafaranga y\'amashuri y\'umwaka wa 2026-2027.',
   'Per term':'Buri gihembwe',
   'Per year (3 terms)':'Buri mwaka (ibihembwe 3)',
   'Fee calculator':'Kubara amafaranga y\'ishuri',
   'Number of terms':'Umubare w\'ibihembwe',
   'Total':'Igiteranyo',
   'Other costs':'Andi mafaranga',
   'Uniform and school materials':'Imyambaro n\'ibikoresho by\'ishuri',
   'Registration fee (one time)':'Amafaranga yo kwiyandikisha (rimwe gusa)',
   'Health insurance (e.g. RSSB)':'Ubwishingizi bw\'ubuzima (urugero RSSB)',
   'How to pay':'Uko wishyura',
   'Bank deposit: add bank name and account number':'Kohereza muri banki: andika izina rya banki na nimero ya konti',
   'Mobile money: add the payment number':'Kohereza kuri telefoni: andika nimero yo kwishyuriraho',
   'Keep your receipt and bring it to the school office':'Bika inyemezabwishyu uyizane ku biro by\'ishuri',
   'Apply now':'Saba ubu',
   'Forms and documents for students and parents.':'Amafomu n\'inyandiko bigenewe abanyeshuri n\'ababyeyi.',
   'Downloads':'Ibyo gukuramo',
   'Life at KTSS. Click a photo to enlarge it.':'Ubuzima muri KTSS. Kanda ku ifoto kugira ngo uyigire nini.',
   'News & Events':'Amakuru n\'ibikorwa',
   'Announcements and upcoming events at KTSS.':'Amatangazo n\'ibikorwa biteganyijwe muri KTSS.',
   'Announcements and upcoming events at KTSS.':'Amatangazo n\'ibikorwa biteganyijwe muri KTSS.',
   'All':'Byose',
   'Announcements':'Amatangazo',
   'Events':'Ibikorwa',
   'Choose a program to see what you will learn and what you need to apply.':'Hitamo ishami urebe ibyo uziga n\'ibisabwa kugira ngo usabe.',
   'Search programs':'Shakisha amashami',
   'Program details':'Ibisobanuro by\'ishami',
   'Duration, level and admission requirements.':'Igihe rimara, urwego n\'ibisabwa mu kwinjira.',
   'Frequently Asked Questions':'Ibibazo bikunze kubazwa',
   'About KTSS':'Ibyerekeye KTSS',
   'About Us':'Ibyerekeye ishuri',
   'Who we are and what we stand for.':'Turi bande n\'ibyo duharanira.',
   'Principal name':'Izina ry\'umuyobozi',
   'Principal, KTSS':'Umuyobozi wa KTSS',
   'Add the principal\'s welcome message here. Say who the school serves, what students can expect, and an invitation to apply.':'Shyiramo ubutumwa bw\'ikaze bw\'umuyobozi. Sobanura abo ishuri ryakira, ibyo abanyeshuri bakwitega, unabatere inkunga yo gusaba.',
   'Mission and Vision':'Intego n\'icyerekezo',
   'Mission':'Intego',
   'Vision':'Icyerekezo',
   'Add the school\'s mission statement here.':'Shyiramo intego y\'ishuri.',
   'Add the school\'s vision statement here.':'Shyiramo icyerekezo cy\'ishuri.',
   'Staff':'Abakozi',
   'Staff name':'Izina ry\'umukozi',
   'Deputy Principal':'Umuyobozi wungirije',
   'Software Development teacher':'Mwarimu w\'ishami ryo gukora porogaramu za mudasobwa',
   'Accounting teacher':'Mwarimu w\'ibaruramari',
   'KTSS Youth':'Urubyiruko rwa KTSS',
   'Describe the student clubs, groups and activities here, and how new students can join.':'Sobanura amatsinda n\'ibikorwa by\'abanyeshuri, n\'uko abanyeshuri bashya bashobora kubyitabira.',
   'KTSS Technical Secondary School. Add a short history and mission statement here.':'Ishuri ryisumbuye rya tekiniki rya KTSS. Shyiramo amateka magufi n\'intego yaryo.',
   'Trades Offered':'Amashami atangwa',
   'Quick Links':'Amakuru yihuse',
   'External Links':'Imiyoboro yo hanze',
   'Brochure':'Agatabo k\'ishuri',
   'Home':'Ahabanza',
   'News':'Amakuru',
   'Register':'Kwiyandikisha',
   'Apply Now':'Saba ubu',
   'Programs':'Amashami',
   'O\'Level':'Amashuri yisumbuye rusange',
   'Software Development':'Gukora porogaramu za mudasobwa',
   'Accounting':'Ibaruramari',
   'Tuition Fees':'Amafaranga y\'ishuri',
   'FAQ':'Ibibazo bikunze kubazwa',
   'Gallery':'Amafoto',
   'Contact Us':'Tuvugane',
   'Search programs':'Shakisha amashami',
   'Search questions':'Shakisha ibibazo',
   'Apply to KTSS':'Saba kwiga muri KTSS',
   'Complete the three steps. Required fields are marked *.':'Uzuza intambwe eshatu. Ibice bigomba kuzuzwa birangwa na *.',
   'Application Form':'Ifishi yo gusaba',
   'Personal Info':'Amakuru bwite',
   'Contact Info':'Amakuru yo guhamagara',
   'Documents & Submit':'Inyandiko no kohereza',
   'Personal Information':'Amakuru bwite',
   'Contact Information':'Amakuru yo guhamagara',
   'First Name':'Izina rya mbere',
   'Last Name':'Izina ry\'umuryango',
   'Gender':'Igitsina',
   'Select an Option':'Hitamo',
   'Female':'Gore',
   'Male':'Gabo',
   'Date of Birth':'Itariki y\'amavuko',
   'Program':'Ishami',
   'Select a program':'Hitamo ishami',
   'Select a program to see its tuition fee.':'Hitamo ishami kugira ngo urebe amafaranga yaryo.',
   'Nationality':'Ubwenegihugu',
   'Place of Residence':'Aho utuye',
   'Next':'Komeza',
   'Back':'Subira inyuma',
   'Enter your first name.':'Andika izina ryawe rya mbere.',
   'Enter your last name.':'Andika izina ry\'umuryango wawe.',
   'Select a gender.':'Hitamo igitsina.',
   'Choose a valid date of birth.':'Hitamo itariki y\'amavuko yemewe.',
   'Select a program.':'Hitamo ishami.',
   'Phone':'Telefoni',
   'Enter a phone number with at least 9 digits.':'Andika nimero ya telefoni ifite nibura imibare 9.',
   'Email':'Imeyili',
   'Parent / Guardian Name':'Izina ry\'umubyeyi cyangwa umurera',
   'Parent / Guardian Phone':'Telefoni y\'umubyeyi cyangwa umurera',
   'Enter a parent or guardian name.':'Andika izina ry\'umubyeyi cyangwa umurera.',
   'Health Insurance':'Ubwishingizi bw\'ubuzima',
   'Passport Photo':'Ifoto ya pasiporo',
   'Upload passport photo':'Shyiramo ifoto ya pasiporo',
   'Upload Passport Photo':'Shyiramo ifoto ya pasiporo',
   'Drag & drop image here or':'Kurura ifoto uyishyire hano cyangwa',
   'Browse File':'Hitamo ifoto',
   'JPG, PNG, WEBP allowed. Maximum size: 2MB.':'JPG, PNG na WEBP biremewe. Ingano ntarengwa: 2MB.',
   'Use a JPG, PNG or WEBP image.':'Koresha ifoto ya JPG, PNG cyangwa WEBP.',
   'Image is larger than 2MB. Choose a smaller one.':'Ifoto irengeje 2MB. Hitamo ntoya.',
   'Submit Application':'Ohereza ubusabe',
   'Application received':'Ubusabe bwakiriwe',
   'Thank you. KTSS will contact you using the phone number you provided.':'Murakoze. KTSS izabahamagara kuri nimero mwatanze.',
   'Admin':'Ubuyobozi',
   'Enter your username and password.':'Andika izina ukoresha n\'ijambo ry\'ibanga.',
   'Admin login is not connected yet. It needs a backend to check passwords.':'Kwinjira kw\'ubuyobozi ntibirakora. Bisaba sisitemu yo kugenzura amagambo y\'ibanga.',
   'This file has not been added yet.':'Iyi dosiye ntirashyirwamo.',
   'Download':'Kuramo',
   'School brochure':'Agatabo k\'ishuri',
   'Application form (printable)':'Ifishi yo gusaba (yo gucapwa)',
   'Fee structure 2026-2027':'Imbonerahamwe y\'amafaranga 2026-2027',
   'School calendar':'Kalendari y\'ishuri',
   'School photo':'Ifoto y\'ishuri',
   'Demo only: this form does not send data anywhere yet.':'Urugero gusa: iyi fomu ntirashyikiriza amakuru ahandi.',
   'Open':'Fungura',
   'Photo viewer':'Irebere amafoto',
   'Close':'Funga',
   'Previous':'Ibanjirije',
   'Next':'Ikurikira',
   'View requirements →':'Reba ibisabwa →',
   'Nothing here yet.':'Nta makuru arahari.',
   'Applications are open':'Kwiyandikisha byaratangiye',
   'Applications are open for the 2026-2027 school year.':'Kwiyandikisha ku mwaka w\'amashuri wa 2026-2027 byaratangiye.',
   'Apply online for the 2026-2027 school year using the Register page.':'Saba kuri interineti mu mwaka w\'amashuri wa 2026-2027 ukoresheje urupapuro rwo kwiyandikisha.',
   'Open day for parents and students':'Umunsi wo gusura ishuri ku babyeyi n\'abanyeshuri',
   'Meet the teachers, see the classrooms and ask questions about each program.':'Mumenye abarimu, murebe ibyumba by\'ishuri kandi mubaze ibibazo ku mashami.',
   'Fee payment reminder':'Ibutsa ryo kwishyura amafaranga y\'ishuri',
   'Please pay first-term fees and keep your receipt. See the Tuition Fees page.':'Mwishyure amafaranga y\'igihembwe cya mbere kandi mubike inyemezabwishyu. Reba urupapuro rw\'amafaranga y\'ishuri.',
   'Software Development showcase':'Imurikagurisha ry\'ishami ryo gukora porogaramu',
   'Students present the websites and apps they built this term.':'Abanyeshuri berekana imbuga na porogaramu bakoze muri iki gihembwe.',
   'Nothing here yet.':'Nta makuru arahari.',
   'Applications are open for the 2026-2027 school year.':'Kwiyandikisha ku mwaka w\'amashuri wa 2026-2027 byaratangiye.',
   'See the Tuition Fees page for fees and how to pay.':'Reba amafaranga y\'ishuri n\'uburyo bwo kwishyura ku rupapuro rwabigenewe.',
   'Questions? Read the FAQ or contact the school office.':'Ufite ibibazo? Soma ibibazo bikunze kubazwa cyangwa uvugane n\'ibiro by\'ishuri.',
   'Seamless Advancement':'Amahirwe yo gukomeza amashuri',
   'Start a learning journey that can continue to higher technical programs.':'Tangira urugendo rwo kwiga rushobora kugukomeza mu mashami ya tekiniki yo hejuru.',
   'Job-Ready Skills':'Ubumenyi bugutegurira akazi',
   'Acquire the expertise needed for your dream job.':'Gira ubumenyi bukenewe mu kazi wifuza.',
   'Stay Updated':'Kumenya ibigezweho',
   'Keep pace with the latest in technology and industry trends.':'Kurikirana ikoranabuhanga n\'ibigezweho mu nganda.',
   'Entrepreneurship':'Kwishakamo ibisubizo',
   'Empower yourself to start your own business.':'Witegure gutangiza umushinga wawe bwite.',
   'Real-World Solutions':'Gukemura ibibazo bifatika',
   'Become a professional at solving practical problems.':'Ba umuhanga mu gukemura ibibazo bifatika.',
   'Lifelong Learning':'Kwiga ubuzima bwose',
   'Stay relevant in our tech-driven world with continuous learning.':'Komeza kugira ubumenyi bujyanye n\'isi y\'ikoranabuhanga wiga ubudahwema.',
   'KTSS offers O\'Level, Software Development and Accounting.':'KTSS itanga amashami y\'amashuri yisumbuye rusange, gukora porogaramu no kubara imari.',
   'Secure your place at KTSS for O\'Level, Software Development or Accounting, with practical training that prepares you for work and further study.':'Wiyandikishe muri KTSS mu mashami y\'amashuri yisumbuye rusange, gukora porogaramu cyangwa ibaruramari; uzahabwa ubumenyi ngiro bukugutegurira akazi no gukomeza kwiga.',
   'Starts September 2026':'Bitangira muri Nzeri 2026',
   'Start September 2026':'Bitangira muri Nzeri 2026',
   'Starts September 2026':'Bitangira muri Nzeri 2026',
   'School Year':'Umwaka w\'amashuri',
   'Why Choose KTSS?':'Kuki wahitamo KTSS?',
   'Joining KTSS today will pave your way to a successful and bright future in your career.':'Kwiga muri KTSS uyu munsi bizagufasha kugira ahazaza heza mu mwuga wawe.',
   'Our Programs':'Amashami yacu',
   'View requirements →':'Reba ibisabwa →',
   'View':'Reba',
   'Duration':'Igihe rimara',
   'Level':'Urwego',
   'Start':'Gutangira',
   'What you will learn':'Ibyo uziga',
   'Admission requirements':'Ibisabwa mu kwinjira',
   '← All programs':'← Amashami yose',
   'See all programs':'Reba amashami yose',
   'Program not found.':'Ishami ntiryabonetse.',
   'No program matches your search.':'Nta shami rihuye n\'ibyo washakishije.',
   'Lower secondary education that builds a strong base for further studies and technical training.':'Amashuri yisumbuye y\'habanza atanga umusingi ukomeye wo gukomeza amasomo n\'amahugurwa ya tekiniki.',
   'Practical training in building websites, apps and other software.':'Amahugurwa ngiro yo gukora imbuga za interineti, porogaramu za telefoni n\'izindi porogaramu.',
   'Training in bookkeeping, financial records and business accounts.':'Amahugurwa mu ibaruramari, inyandiko z\'imari na konti z\'ubucuruzi.',
   'Core subjects such as mathematics, sciences, languages and social studies':'Amasomo y\'ingenzi nk\'imibare, ubumenyi, indimi n\'amasomo mbonezamubano',
   'Basic ICT and practical skills':'Ubumenyi bw\'ibanze mu ikoranabuhanga n\'ubumenyi ngiro',
   'Preparation for the national O\'Level exam':'Imyiteguro y\'ikizamini cya Leta cya O\'Level',
   'Programming fundamentals and problem solving':'Iby\'ibanze mu gukora porogaramu no gukemura ibibazo',
   'Web and mobile app development':'Gukora porogaramu z\'imbuga na telefoni',
   'Databases and software testing':'Ububiko bw\'amakuru no kugerageza porogaramu',
   'Real projects and workplace practice':'Imishinga ifatika n\'imyitozo ku kazi',
   'Bookkeeping and financial statements':'Ibaruramari n\'inyandiko z\'imari',
   'Business mathematics and taxation basics':'Imibare y\'ubucuruzi n\'iby\'ibanze ku misoro',
   'Accounting software and spreadsheets':'Porogaramu z\'ibaruramari n\'imbonerahamwe',
   'Preparation':'Imyiteguro',
   'Primary Leaving Certificate (completed Primary 6)':'Icyemezo cyo kurangiza amashuri abanza (P6)',
   'Birth certificate or national ID':'Icyemezo cy\'amavuko cyangwa indangamuntu',
   'Previous school report or transfer letter (for transfers)':'Raporo y\'ishuri wize mbere cyangwa ibaruwa yo kwimuka',
   'Recent passport photo':'Ifoto ya pasiporo iherutse gufatwa',
   'Health insurance card (e.g. RSSB)':'Ikarita y\'ubwishingizi bw\'ubuzima (urugero RSSB)',
   'Parent or guardian contact details':'Amakuru yo guhamagara umubyeyi cyangwa umurera',
   'O\'Level certificate (completed Senior 3)':'Icyemezo cy\'amashuri yisumbuye rusange (warangije S3)',
   'Transcript or school report showing your marks':'Inyandiko y\'amanota cyangwa raporo y\'ishuri',
   'Interest in computers and logical thinking':'Gukunda mudasobwa no gutekereza mu buryo bwumvikana',
   'Good basic mathematics':'Kumenya imibare y\'ibanze neza',
   '3 years':'Imyaka 3',
   'Lower secondary (S1-S3)':'Amashuri yisumbuye y\'habanza (S1-S3)',
   'Upper secondary technical (S4-S6)':'Amashuri yisumbuye ya tekiniki (S4-S6)',
   'Applications are open':'Kwiyandikisha byaratangiye',
   'When does the school year start?':'Umwaka w\'amashuri utangira ryari?',
   'The 2026-2027 school year starts in September 2026.':'Umwaka w\'amashuri wa 2026-2027 utangira muri Nzeri 2026.',
   'How do I apply?':'Ndasaba nte?',
   'Open the Register page, complete the three steps (personal info, contact info, documents) and submit. The school will contact you by phone.':'Fungura urupapuro rwo kwiyandikisha, uzuze intambwe eshatu (amakuru bwite, ayo guhamagara n\'inyandiko) maze wohereze. Ishuri rizaguhamagara.',
   'What are the admission requirements?':'Ni ibihe bisabwa kugira ngo umuntu yemererwe?',
   'They depend on the program. Open a program from the Programs menu to see its full list.':'Biterwa n\'ishami. Fungura ishami mu mashami kugira ngo urebe ibisabwa byose.',
   'Can I transfer from another school?':'Ese nshobora kwimuka mvuye ku rindi shuri?',
   'Yes. Bring your last school report and a transfer letter, and apply using the same form.':'Yego. Zana raporo y\'ishuri uheruka n\'ibaruwa yo kwimuka, maze usabe ukoresheje ifishi imwe.',
   'How much are the tuition fees?':'Amafaranga y\'ishuri ni angahe?',
   'See the Tuition Fees page for the fee table and payment methods.':'Reba urupapuro rw\'amafaranga y\'ishuri kugira ngo urebe imbonerahamwe n\'uburyo bwo kwishyura.',
   'Does the school offer boarding?':'Ese ishuri rifite amacumbi?',
   'Add your answer here.':'Shyiramo igisubizo hano.',
   'How can I contact the school?':'Nabona nte ishuri?',
   'Call or email using the details at the bottom of any page, Monday to Friday, 8:00 AM - 5:00 PM.':'Hamagara cyangwa wohereze imeyili ukoresheje amakuru ari hasi kuri buri rupapuro, kuva kuwa mbere kugeza kuwa gatanu, 8:00-17:00.',
   'No question matches.':'Nta kibazo gihuye n\'ibyo washakishije.',
   'Ask the school':'Baza ishuri',
   'There is no question matching your search.':'Nta kibazo gihuye n\'ibyo washakishije.',
   'Per term':'Buri gihembwe',
   'RWF per term':'RWF kuri buri gihembwe',
   'per term':'kuri buri gihembwe',
   'RWF per year':'RWF ku mwaka',
   ' per term':' kuri buri gihembwe',
   ' per year':' ku mwaka',
   'Default text size':'Ingano isanzwe y\'inyandiko',
   'text size':'ingano y\'inyandiko',
   'Open menu':'Fungura menu',
   'Back to top':'Subira hejuru',
   'Skip to main content':'Jya ku bikubiye mu rupapuro',
   'Open text size controls':'Fungura igenzura ry\'ingano y\'inyandiko',
   'Reset text size':'Subiza ingano y\'inyandiko uko yari isanzwe',
   'Decrease text size':'Gabanya ingano y\'inyandiko',
   'Increase text size':'Ongera ingano y\'inyandiko',
   'Reset':'Subiza uko byari bisanzwe',
   'Language':'Ururimi',
   'Previous photo':'Ifoto ibanza',
   'Next photo':'Ifoto ikurikira',
   'Pause slideshow':'Hagarika guhindura amafoto',
   'Play slideshow':'Komeza guhindura amafoto',
   'Photo viewer':'Kureba ifoto',
   'Facebook':'Facebook',
   'Instagram':'Instagram',
   'YouTube':'YouTube',
   'LinkedIn':'LinkedIn',
   'WhatsApp':'WhatsApp',
   'Monday - Friday: 8:00 AM - 5:00 PM':'Kuwa mbere - kuwa gatanu: 8:00 - 17:00',
   'Apply for O\'Level':'Saba ishami ry\'amashuri yisumbuye rusange',
   'Apply for Software Development':'Saba ishami ryo gukora porogaramu',
   'Apply for Accounting':'Saba ishami ry\'ibaruramari',
   'No program matches your search.':'Nta shami rihuye n\'ibyo washakishije.',
   'No question matches.':'Nta kibazo gihuye n\'ibyo washakishije.',
   'Download':'Kuramo',
   'Starts September 2026':'Bitangira muri Nzeri 2026',
   'Home – KTSS':'Ahabanza – KTSS',
   'About Us – KAGEYO TSS':'Ibyerekeye KAGEYO TSS',
   'Admin Login – KTSS':'Kwinjira kw\'ubuyobozi – KTSS',
   'Contact Us – KTSS':'Tuvugane – KTSS',
   'Downloads – KTSS':'Ibyo gukuramo – KTSS',
   'FAQ – KTSS':'Ibibazo bikunze kubazwa – KTSS',
   'Tuition Fees – KTSS':'Amafaranga y\'ishuri – KTSS',
   'Gallery – KAGEYO TSS':'Amafoto – KAGEYO TSS',
   'News & Events – KTSS':'Amakuru n\'ibikorwa – KTSS',
   'Program – KTSS':'Ishami – KTSS',
   'Programs – KTSS':'Amashami – KTSS',
   'Register – KTSS':'Kwiyandikisha – KTSS',
   'Search questions':'Shakisha ibibazo',
   'Photo viewer':'Kureba amafoto'
  },
  cta:{
   apply:'Saba ubu',
   explore:'Reba amashami'
  },
  hero:{
   schoolYear:'Umwaka w\'amashuri',
   starts:'Bitangira muri Nzeri 2026',
   summary:'Wiyandikishe muri KTSS mu mashami y\'amashuri yisumbuye rusange, gukora porogaramu za mudasobwa cyangwa ibaruramari, maze ubone ubumenyi ngiro bukugutegurira akazi no gukomeza kwiga.',
   why:'Kuki uhitamo KTSS?',
   whyLead:'Gushyira KTSS uyu munsi bizagushakira inzira y\'ubuzima bwo guhangana n\'ibikorwa by\'imari n\'ubuhanga.',
   programsTitle:'Amashami yacu',
   programsLead:'KTSS itanga amashuri yisumbuye rusange, gukora porogaramu za mudasobwa n\'ibaruramari.'
  },
  about:{
   pageTitle:'Ibyerekeye KTSS',
   pageIntro:'Turi nde kandi dukora iki.',
   tabs:{principal:'Ubutumwa bw\'Ushinzwe',mission:'Intego n\'Icyerekezo',staff:'Abakozi',youth:'Urubyiruko rwa KTSS'},
   panels:{principalTitle:'Ubutumwa bw\'Ushinzwe',missionTitle:'Intego n\'Icyerekezo',missionLabel:'Intego',visionLabel:'Icyerekezo',staffTitle:'Abakozi',youthTitle:'Urubyiruko rwa KTSS'},
   principalText:'Shyiramo ubutumwa bw\'ubuyobozi. Menyesha abiga, ibyo babategereje, n\'itumu ry\'ubushake.',
   principalRole:'Ushinzwe, KTSS',
   missionText:'Shyiramo intego y\'ishuri.',
   visionText:'Shyiramo icyerekezo cy\'ishuri.',
   youthText:'Sobanura amakipe, ibikorwa, n\'ukuntu abanyeshuri bashya bashobora kujya biga.'
  },
  programsPage:{
   pageTitle:'Amashami',
   pageIntro:'Hitamo ishami urebe ibyo uziga n\'ibisabwa kugira ngo usabe.',
   search:'Shakisha amashami',
   empty:'Nta shami rihuye n\'ibyo washakishije.'
  },
  programPage:{
   pageTitle:'Ibisobanuro by\'ishami',
   pageIntro:'Igihe rimara, urwego n\'ibisabwa kugira ngo winjire.',
   back:'← Amashami yose',
   duration:'Igihe',
   level:'Urwego',
   start:'Gutangira',
   learn:'Ibyo uziga',
   requirements:'Ibisabwa kugira ngo winjire',
   notFound:'Ishami ntiryabonetse.',
   seeAll:'Reba amashami yose',
   applyFor:'Saba',
   startMonth:'Nzeri 2026'
  },
  register:{
   pageTitle:'Saba muri KTSS',
   pageIntro:'Kora intambwe eshatu. Uzuza ibice by\'ibanze.',
   formTitle:'Fomu yo gusaba',
   steps:{personal:'Amakuru y\'umuntu',contact:'Amakuru yo guhamagara',docs:'Ibikoresho & Kohereza'},
   personalTitle:'Amakuru y\'umuntu',
   contactTitle:'Amakuru yo guhamagara',
   docsTitle:'Ibikoresho & Kohereza',
   labels:{firstName:'Izina rya mbere',lastName:'Izina ry\'umuryango',gender:'Igitsina',dob:'Itariki y\'amavuko',program:'Ishami',nationality:'Ubwenegihugu',residence:'Aho utuye',phone:'Telefoni',email:'Imeyili',parentName:'Izina ry\'umubyeyi cyangwa umurera',parentPhone:'Telefoni y\'umubyeyi cyangwa umurera',health:'Ubwishingizi bw\'ubuzima',photo:'Ifoto ya pasiporo'},
   placeholders:{firstName:'Izina rya mbere',lastName:'Izina ry\'umuryango',nationality:'Ubwenegihugu bwawe',residence:'Aho utuye',phone:'+250 ...',email:'izina@example.com',parentName:'Umubyeyi cyangwa umurera',parentPhone:'+250 ...',health:'urugero RSSB'},
   optionSelect:'Hitamo',
   errors:{firstName:'Andika izina rya mbere.',lastName:'Andika izina rya kabiri.',gender:'Hitamo igitsina.',dob:'Hitamo itariki y\'amavuko.',program:'Hitamo igenewe.',phone:'Andika nimero ya telefoni ifite nibura nimero 9.',email:'Andika imeri y\'ukuri.',parentName:'Andika izina ry\'ababyeyi cyangwa umurinzi.',parentPhone:'Andika nimero ya telefoni ifite nibura nimero 9.'},
   feeHint:'Hitamo ishami kugira ngo urebe amafaranga yaryo.',
   upload:'Shyiramo ifoto ya pasiporo',
   uploadInfo:'JPG, PNG, WEBP zemewe. Ingano ntarenze 2MB.',
   uploadError:'Koresha ifoto ya JPG, PNG cyangwa WEBP.',
   uploadTooBig:'Ifoto irenze 2MB. Hitamo ifoto ntoya.',
   uploadReadError:'Ifoto ya pasiporo ntiyasomeka. Gerageza indi foto.',
   submitError:'Ubusabe ntibwashoboye koherezwa. Ongera ugerageze.',
   serviceUnavailable:'Serivisi yo kwakira ubusabe ntiboneka ubu. Ongera ugerageze nyuma.',
   next:'Komeza',
   back:'Subira inyuma',
   submit:'Ohereza gusaba',
   successTitle:'Ibyasabwe byakiriwe',
   successText:'Urakoze. KTSS izaguhamagara ku numero watanze.',
   successNote:'Bika nimero y\'ubusabe kugira ngo uzayikoreshe mu gukurikirana.',
   selectProgram:'Hitamo ishami',
   programFee:'RWF kuri buri gihembwe',
   fileLabel:'Ifoto ya pasiporo'
  },
  admin:{
   loginTitle:'Kwinjira kw\'ubuyobozi',
   staffOnly:'Bigenewe abakozi ba KTSS gusa.',
   username:'Izina ukoresha',
   password:'Ijambo ry\'ibanga',
   signIn:'Injira',
   workspace:'AHO UBUYOBOZI BUKORERA',
   dashboardTitle:'Ubusabe bwo kwiga',
   dashboardIntro:'Suzuma ubusabe, ukurikirane ibyemezo kandi ukuremo raporo.',
   refresh:'Ongera urebe',
   export:'Kuramo CSV',
   logout:'Sohoka',
   total:'Ubusabe bwose',
   new:'Bushya',
   reviewing:'Burimo gusuzumwa',
   accepted:'Bwemewe',
   rejected:'Butemewe',
   allRequests:'Ubusabe bwose',
   search:'Shakisha',
   searchPlaceholder:'Izina, imeyili, telefoni cyangwa nimero y\'ubusabe',
   status:'Imiterere',
   allStatuses:'Imiterere yose',
   program:'Ishami',
   allPrograms:'Amashami yose',
   from:'Kuva',
   to:'Kugeza',
   applicant:'Usaba',
   submitted:'Byatanzwe',
   actions:'Ibikorwa',
   loading:'Birimo gupakurura ubusabe...',
   previous:'Ibanza',
   next:'Ikurikira',
   requestDetail:'IBISOBANURO BY\'UBUSABE',
   passportPhoto:'Ifoto ya pasiporo',
   updateStatus:'Hindura imiterere',
   internalNotes:'Ibyitonderwa by\'ubuyobozi',
   notesPlaceholder:'Ibyitonderwa bibonwa n\'abakozi binjiye gusa',
   close:'Funga',
   save:'Bika impinduka',
   showing:'Hagaragajwe',
   of:'kuri',
   requests:'ubusabe',
   page:'Urupapuro',
   noRequests:'Nta busabe buhuye n\'ibyo wahisemo.',
   viewRequest:'Reba',
   requestId:'Nimero y\'ubusabe',
   gender:'Igitsina',
   dateOfBirth:'Itariki y\'amavuko',
   nationality:'Ubwenegihugu',
   residence:'Aho atuye',
   phone:'Telefoni',
   email:'Imeyili',
   guardianName:'Umubyeyi cyangwa umurera',
   guardianPhone:'Telefoni y\'umubyeyi cyangwa umurera',
   healthInsurance:'Ubwishingizi bw\'ubuzima',
   lastUpdated:'Byaherukaga kuvugururwa',
   loadingDetail:'Birimo gupakurura ubusabe...',
   detailUnavailable:'Ubusabe ntibubonetse',
   sessionExpired:'Igihe cyo kwinjira cyarangiye. Ongera winjire.',
   requestFailed:'Ubusabe ntibwakunze. Ongera ugerageze.',
   exportFailed:'Ntabwo ubusabe bwabashije gukurwamo.',
   statusNames:{new:'Bushya',reviewing:'Burimo gusuzumwa',accepted:'Bwemewe',rejected:'Butemewe'}
  },
  textSize:"Ingano y'inyandiko",
  openTextControls:"Fungura igenzura ry'inyandiko",
  decrease:'Gabanya ingano y\'inyandiko',
  increase:'Ongera ingano y\'inyandiko',
  reset:'Kugarura',
  skip:'Jya ku byatanzwe',
  openMenu:'Fungura menu',
  backTop:'Gusubira hejuru',
  language:'Ururimi',
  prevSlide:'Ifoto ibanza',
  nextSlide:'Ifoto ikurikira',
  pause:'Hagarika amashusho',
  play:'Tangira amashusho',
  photo:'Ifoto',
  of:'ya'
 }
};

const LANG_KEY='ktss-language';
const fontSizes=['100','112.5','125'];
const fontSizeKey='ktss-font-size';
let fontSizeIndex=fontSizes.indexOf('100');

const getFromPath=(obj,path)=>{
 if(!obj) return null;
 return path.split('.').reduce((value,key)=>value && value[key], obj) ?? null;
};

window.ktssTranslations = translations;
window.ktssT = (path, fallback='') => {
 const locale = document.body && document.body.dataset && document.body.dataset.lang ? document.body.dataset.lang : 'en';
 const value = getFromPath(translations[locale], path) ?? getFromPath(translations.en, path);
 return value ?? fallback;
};

const originalText = new WeakMap();
const originalAttributes = new WeakMap();
const originalTitle = document.title;
const translateText = (value, locale) => {
 if(locale !== 'rw') return value;
 const exact = translations.rw.text[value.trim()];
 if(exact) return value.replace(value.trim(), exact);
 const pageTitle = value.match(/^(.+?) – KTSS$/);
 if(pageTitle) return `${translateText(pageTitle[1],locale)} – KTSS`;
 const fee = value.match(/^([\d,.]+\s*RWF)\s+per term$/i);
 if(fee) return `${fee[1]} kuri buri gihembwe`;
 const photoCount = value.match(/^Photo (\d+) of (\d+)$/i);
 if(photoCount) return `Ifoto ${photoCount[1]} kuri ${photoCount[2]}`;
 const galleryPhoto = value.match(/^School photo (\d+)$/i);
 if(galleryPhoto) return `Ifoto y'ishuri ${galleryPhoto[1]}`;
 const openPhoto = value.match(/^Open School photo (\d+)$/i);
 if(openPhoto) return `Fungura ifoto y'ishuri ${openPhoto[1]}`;
 return value;
};
window.ktssTranslateText = (value, locale=document.body.dataset.lang) => translateText(value,locale);

const translateTextNode = (node, locale) => {
 if(!node.parentElement || node.parentElement.closest('[data-i18n],[data-i18n-html],[data-nav],.skip-link,.font-tools,[data-slide]')) return;
 if(!originalText.has(node)) originalText.set(node,node.nodeValue);
 const original = originalText.get(node);
 const translated = translateText(original,locale);
 if(node.nodeValue!==translated) node.nodeValue=translated;
};

const translateTree = (root, locale) => {
 if(root.nodeType===Node.TEXT_NODE){
  translateTextNode(root,locale);
  return;
 }
 const elements = [];
 if(root.nodeType === Node.ELEMENT_NODE) elements.push(root);
 if(root.querySelectorAll) elements.push(...root.querySelectorAll('*'));
 elements.forEach((element)=>{
  if(element.matches('[data-i18n],[data-i18n-html],[data-nav],.skip-link')) return;
  const attrOriginals = originalAttributes.get(element) || new Map();
  ['placeholder','aria-label','title','alt'].forEach((attribute)=>{
   if(attribute==='placeholder' && element.hasAttribute('data-i18n-placeholder')) return;
   if(!element.hasAttribute(attribute)) return;
   if(!attrOriginals.has(attribute)) attrOriginals.set(attribute,element.getAttribute(attribute));
   const original = attrOriginals.get(attribute);
   const translated = translateText(original,locale);
   if(element.getAttribute(attribute)!==translated) element.setAttribute(attribute,translated);
  });
  originalAttributes.set(element,attrOriginals);
 });

 const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())) translateTextNode(node,locale);
};

const translationObserver = new MutationObserver((mutations)=>{
 const locale=document.body.dataset.lang||'en';
 mutations.forEach((mutation)=>{
  if(mutation.type==='childList') mutation.addedNodes.forEach((node)=>{
   if(node.nodeType===Node.ELEMENT_NODE||node.nodeType===Node.TEXT_NODE) translateTree(node,locale);
  });
  else if(mutation.type==='characterData') translateTree(mutation.target,locale);
  else if(mutation.type==='attributes') translateTree(mutation.target,locale);
 });
});
translationObserver.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','alt']});

const updateFontSize=()=>{
 document.documentElement.dataset.textSize=String(fontSizeIndex);
 const panelStatus=$('.font-tools-status');
 if(panelStatus){
  const locale=document.body.dataset.lang||'en';
  panelStatus.textContent=fontSizeIndex===0
   ? (locale==='rw'?'Ingano isanzwe y\'inyandiko':'Default text size')
   : fontSizes[fontSizeIndex]+'% '+(locale==='rw'?'ingano y\'inyandiko':'text size');
 }
 $$('[data-font-size]').forEach(button=>{
  const isSmaller=button.dataset.fontSize==='smaller';
  const isLarger=button.dataset.fontSize==='larger';
  button.disabled=(isSmaller&&fontSizeIndex===0)||(isLarger&&fontSizeIndex===fontSizes.length-1);
 });
 try{localStorage.setItem(fontSizeKey,fontSizes[fontSizeIndex]);}catch(error){console.warn('Could not save the text size preference.',error);}
};

const applyTranslations=(lang)=>{
 const locale = translations[lang] ? lang : 'en';
 document.documentElement.lang = locale === 'rw' ? 'rw' : 'en';
 document.body.dataset.lang = locale;
 try{localStorage.setItem(LANG_KEY, locale);}catch(error){console.warn('Could not save the language preference.',error);}

 document.querySelectorAll('[data-i18n]').forEach((node)=>{
  const value = getFromPath(translations[locale], node.dataset.i18n);
  if(value !== null && value !== undefined){
   node.textContent = value;
  }
 });

 document.querySelectorAll('[data-i18n-html]').forEach((node)=>{
  const value = getFromPath(translations[locale], node.dataset.i18nHtml);
  if(value !== null && value !== undefined){
   node.innerHTML = value;
  }
 });

 document.querySelectorAll('[data-i18n-placeholder]').forEach((node)=>{
  const value = getFromPath(translations[locale], node.dataset.i18nPlaceholder);
  if(value !== null && value !== undefined){
   node.placeholder = value;
  }
 });

 document.querySelectorAll('option[data-i18n-option]').forEach((node)=>{
  const value = getFromPath(translations[locale], node.dataset.i18nOption);
  if(value !== null && value !== undefined){
   node.textContent = value;
  }
 });

 document.querySelectorAll('[data-nav]').forEach((link)=>{
  const key = link.dataset.nav;
  const val = getFromPath(translations[locale], 'nav.' + key);
  if(val) link.textContent = val;
 });

 document.querySelectorAll('.top nav a').forEach((link)=>{
  const page=link.getAttribute('href');
  const map={'register.html':'register','fees.html':'fees','faq.html':'faq','admin.html':'admin'};
  const key=map[page];
  if(key){
   link.dataset.i18n='nav.'+key;
   link.textContent=getFromPath(translations[locale],'nav.'+key)||link.textContent;
  }
 });

 translateTree(document.body,locale);

 const skipLink=$('.skip-link');
 if(skipLink) skipLink.textContent = translations[locale].skip;

 const fontToggle=$('.font-tools-toggle');
 if(fontToggle) fontToggle.setAttribute('aria-label', translations[locale].openTextControls);
 const fontTitle=$('.font-tools-panel p');
 if(fontTitle) fontTitle.textContent = translations[locale].textSize;
 $$('[data-font-size]').forEach((button)=>{
  const label = button.dataset.fontSize;
  const map = {smaller: translations[locale].decrease, reset: translations[locale].reset, larger: translations[locale].increase};
  if(map[label]) button.setAttribute('aria-label', map[label]);
  if(label==='reset') button.textContent=translations[locale].reset;
 });

 const fontStatus=$('.font-tools-status');
 if(fontStatus){
  fontStatus.textContent = fontSizeIndex===0 ? (locale === 'rw' ? 'Ingano isanzwe y\'inyandiko' : 'Default text size') : (fontSizes[fontSizeIndex] + '% ' + (locale === 'rw' ? 'inyandiko' : 'text size'));
 }

 const burger=$('#burger');
 if(burger) burger.setAttribute('aria-label', translations[locale].openMenu);
 const toTop=$('.totop');
 if(toTop) toTop.setAttribute('aria-label', translations[locale].backTop);

 document.querySelectorAll('.lang-switch button').forEach((button)=>{
  const active = button.dataset.lang === locale;
  button.classList.toggle('is-active', active);
  button.setAttribute('aria-pressed', String(active));
 });

 const slideToggle=$('[data-slide="toggle"]');
 if(slideToggle){
  const showPlay = slideToggle.dataset.paused === 'true';
  const label = showPlay ? translations[locale].play : translations[locale].pause;
  slideToggle.textContent = label;
  slideToggle.setAttribute('aria-label', label);
 }

 document.title=translateText(originalTitle,locale);
 if(window.updateSlideStatus) window.updateSlideStatus(locale);
 window.dispatchEvent(new CustomEvent('ktss-language-change',{detail:{locale}}));
};

try{
 const storedFontSize=localStorage.getItem(fontSizeKey);
 const savedIndex=fontSizes.indexOf(storedFontSize);
 if(savedIndex>=0) fontSizeIndex=savedIndex;
}catch(error){console.warn('Could not load the saved text size preference.',error);}

const fontTools=document.createElement('section');
fontTools.className='font-tools';
fontTools.setAttribute('aria-label','Reading preferences');
fontTools.innerHTML='<button class="font-tools-toggle" type="button" aria-expanded="false" aria-controls="font-tools-panel" aria-label="Open text size controls">Aa</button><div class="font-tools-panel" id="font-tools-panel" hidden><p>Text size</p><div><button type="button" data-font-size="smaller" aria-label="Decrease text size">A−</button><button type="button" data-font-size="reset" aria-label="Reset text size">Reset</button><button type="button" data-font-size="larger" aria-label="Increase text size">A+</button></div><span class="font-tools-status" aria-live="polite"></span></div>';
document.body.appendChild(fontTools);

const fontToggle=$('.font-tools-toggle',fontTools);
const fontPanel=$('#font-tools-panel',fontTools);
fontToggle.onclick=()=>{
 const open=fontToggle.getAttribute('aria-expanded')!=='true';
 fontToggle.setAttribute('aria-expanded',String(open));
 fontPanel.hidden=!open;
};
$$('[data-font-size]',fontTools).forEach((button)=>button.onclick=()=>{
 if(button.dataset.fontSize==='reset') fontSizeIndex=0;
 else fontSizeIndex=Math.max(0,Math.min(fontSizes.length-1,fontSizeIndex+(button.dataset.fontSize==='larger'?1:-1)));
 updateFontSize();
});
updateFontSize();

const langSwitch=document.createElement('div');
langSwitch.className='lang-switch';
langSwitch.setAttribute('aria-label','Language switcher');
langSwitch.innerHTML='<button type="button" data-lang="en" aria-pressed="true" class="is-active">EN</button><button type="button" data-lang="rw" aria-pressed="false">KIN</button>';
const topWrap=$('.top .wrap');
if(topWrap && !topWrap.querySelector('.lang-switch')) topWrap.appendChild(langSwitch);

document.querySelectorAll('.lang-switch button').forEach((button)=>{
 button.onclick=()=>applyTranslations(button.dataset.lang);
});

let initialLang='en';
try{const savedLang=localStorage.getItem(LANG_KEY); if(savedLang && translations[savedLang]) initialLang=savedLang;}catch(error){console.warn('Could not load the language preference.',error);}
applyTranslations(initialLang);

const b=$('#burger'),m=$('#menu');
if(b)b.onclick=()=>{const expanded=m.classList.toggle('open');b.setAttribute('aria-expanded',String(expanded));};
const activeNav=$('[data-nav="'+document.body.dataset.page+'"]'); if(activeNav) activeNav.classList.add('on');
$$('[data-year]').forEach((el)=>el.textContent=new Date().getFullYear());
const toTop=document.createElement('button');
toTop.className='totop';
toTop.textContent='↑';
toTop.hidden=true;
toTop.setAttribute('aria-label','Back to top');
toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'}); document.body.appendChild(toTop);
addEventListener('scroll',()=>{toTop.hidden=scrollY<500;},{passive:true});

window.toast=msg=>{const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2600);};
window.validRow=(el,bad)=>{const r=el.closest('.row'); if(r) r.classList.toggle('bad',bad); return !bad;};
})();