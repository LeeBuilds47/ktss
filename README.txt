KTSS website and application dashboard

The site now uses a small Node.js server for application submissions, private
request storage, and the admin dashboard. Opening index.html directly will not
send applications to the server; start the server and browse to its local URL.

Run locally on Windows:

1. Install Node.js 18 or newer.
2. Copy backend\.env.example to backend\.env.
3. Edit backend\.env and set a unique ADMIN_USERNAME and a strong,
   private ADMIN_PASSWORD. Never share or commit backend\.env.
4. Open PowerShell in the backend folder and run:
       npm start
5. Open http://127.0.0.1:3000 in a browser. Use the Admin link and the
   credentials configured in backend\.env.

The server stores applications in backend\data\applications.json and optional
passport images in backend\data\uploads\. That data is excluded from Git and
must be backed up securely. Admin access supports search, status/program/date
filters, paginated results, request details, private notes, status updates,
passport-photo viewing, and CSV export.

For a public deployment, host the Node server over HTTPS and configure the
deployment's HOST, PORT, and a private persistent KTSS_DATA_DIR. Keep the
application data directory outside public static hosting and protect admin
credentials as server secrets. A static-only host cannot accept or store
application requests.

Pages:

index.html      Home            js/home.js        rotating notice and slideshow
about.html      About Us        js/about.js       tabs
programs.html   Programs        js/programs.js    search and program cards
program.html    Program details js/program.js     reads ?p=olevel|software|accounting
news.html       News & Events   js/news.js        event filters
gallery.html    Gallery         js/gallery.js     photo viewer
downloads.html  Downloads       js/downloads.js   file list
contact.html    Contact Us      js/contact.js     contact form validation
fees.html       Tuition Fees    js/fees.js        fee table and calculator
faq.html        FAQ             js/faq.js         search and accordion
register.html   Application     js/register.js    three-step application form
admin.html      Admin           js/admin.js       secured application dashboard

js/main.js      shared navigation, translation, accessibility and preferences
js/data.js      shared program descriptions and admission requirements
css/style.css   site theme and page styles
