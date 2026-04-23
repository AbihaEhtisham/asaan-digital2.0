asaan-digital/
│
├── 📁 database/
│   ├── 📜 01_schema.sql           
│   ├── 📜 02_indexes.sql           
│   ├── 📜 03_functions.sql         
│   ├── 📜 04_triggers.sql          
│   ├── 📜 05_views.sql             
│   ├── 📜 06_seed_data.sql         
│   └── 📜 07_partitions.sql        
│
├── 📁 server/                      # Backend (Node.js + Express)
│   ├── 📜 package.json
│   ├── 📜 .env                     
│   ├── 📜 .env.example             
│   ├── 📜 server.js                
│   │
│   ├── 📁 config/
│   │   ├── 📜 database.js          # PostgreSQL connection pool
│   │   └── 📜 constants.js         
│   │
│   ├── 📁 routes/
│   │   ├── 📜 api.js               
│   │   ├── 📜 search.js     
│   │   ├── 📜 tutorial.js   
│   │   ├── 📜 admin.js      
│   │   └── 📜 analytics.js  
│   │
│   ├── 📁 controllers/
│   │   ├── 📜 searchController.js
│   │   ├── 📜 tutorialController.js
│   │   ├── 📜 adminController.js
│   │   └── 📜 analyticsController.js
│   │
│   ├── 📁 services/
│   │   ├── 📜 queryEngine.js   
│   │   ├── 📜 analytics.js     
│   │   └── 📜 cache.js         
│   │
│   ├── 📁 middleware/
│   │   ├── 📜 auth.js       
│   │   ├── 📜 logger.js     
│   │   ├── 📜 errorHandler.js
│   │   ├── 📜 session.js    
│   │   └── 📜 validation.js 
│   │
│   ├── 📁 utils/
│   │   ├── 📜 responseFormatter.js
│   │   ├── 📜 validators.js            
│   │   └── 📜 helpers.js               
│   │
│   ├── 📁 models/                      # Data access layer
│   │   ├── 📜 Tutorial.js
│   │   ├── 📜 Intent.js
│   │   ├── 📜 Keyword.js
│   │   ├── 📜 QueryLog.js
│   │   └── 📜 Analytics.js
│   │
│   └── 📁 jobs/
│       ├── 📜 refreshMVs.job.js        
│       └── 📜 cleanupLogs.job.js       
│
├── 📁 client/                          # Frontend (React)
│   ├── 📜 package.json
│   ├── 📜 vite.config.js               # Using Vite for faster builds
│   ├── 📜 index.html
│   │
│   ├── 📁 public/
│   │   ├── 📁 images/
│   │   │   ├── 📜 pic1.png
│   │   │   ├── 📜 pic2.png
│   │   │   └── ... (all your images)
│   │   └── 📜 favicon.ico
│   │
│   ├── 📁 src/
│   │   ├── 📜 App.jsx
│   │   ├── 📜 main.jsx
│   │   ├── 📜 index.css
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── 📜 Home.jsx
│   │   │   ├── 📜 Poochna.jsx
│   │   │   ├── 📜 Seekhna.jsx
│   │   │   ├── 📜 Impact.jsx
│   │   │   ├── 📜 About.jsx
│   │   │   ├── 📜 Admin.jsx
│   │   │   ├── 📜 AdminAnalytics.jsx
│   │   │   ├── 📜 AdminContent.jsx
│   │   │   └── 📜 TutorialDetail.jsx
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   │   ├── 📜 Navbar.jsx
│   │   │   │   ├── 📜 Footer.jsx
│   │   │   │   ├── 📜 Loader.jsx
│   │   │   │   ├── 📜 ErrorBoundary.jsx
│   │   │   │   └── 📜 LanguageSelector.jsx
│   │   │   │
│   │   │   ├── 📁 home/
│   │   │   │   ├── 📜 Hero.jsx
│   │   │   │   ├── 📜 Stats.jsx
│   │   │   │   ├── 📜 Features.jsx
│   │   │   │   └── 📜 ProblemSection.jsx
│   │   │   │
│   │   │   ├── 📁 search/
│   │   │   │   ├── 📜 SearchBar.jsx
│   │   │   │   ├── 📜 VoiceSearch.jsx
│   │   │   │   ├── 📜 SearchResults.jsx
│   │   │   │   └── 📜 ConfidenceIndicator.jsx
│   │   │   │
│   │   │   ├── 📁 tutorial/
│   │   │   │   ├── 📜 TutorialCard.jsx
│   │   │   │   ├── 📜 TutorialSteps.jsx
│   │   │   │   ├── 📜 ProgressTracker.jsx
│   │   │   │   └── 📜 CategoryFilter.jsx
│   │   │   │
│   │   │   └── 📁 admin/
│   │   │       ├── 📜 DashboardStats.jsx
│   │   │       ├── 📜 ContentGaps.jsx
│   │   │       ├── 📜 PopularTutorials.jsx
│   │   │       ├── 📜 SystemHealth.jsx
│   │   │       └── 📜 Charts.jsx
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── 📜 useSearch.js
│   │   │   ├── 📜 useTutorial.js
│   │   │   ├── 📜 useAnalytics.js
│   │   │   ├── 📜 useVoiceInput.js
│   │   │   └── 📜 useDebounce.js
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── 📜 api.js                # Axios instance
│   │   │   ├── 📜 search.service.js
│   │   │   ├── 📜 tutorial.service.js
│   │   │   └── 📜 admin.service.js
│   │   │
│   │   ├── 📁 context/
│   │   │   ├── 📜 AuthContext.jsx
│   │   │   ├── 📜 LanguageContext.jsx
│   │   │   └── 📜 ThemeContext.jsx
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── 📜 global.css
│   │   │   ├── 📜 variables.css
│   │   │   ├── 📜 admin.css
│   │   │   └── 📜 components.css
│   │   │
│   │   └── 📁 utils/
│   │       ├── 📜 constants.js
│   │       ├── 📜 formatters.js
│   │       └── 📜 validators.js
│   │
│   └── 📜 .env
│
├── 📁 docs/
│   ├── 📜 ERD.pdf
│   ├── 📜 API_Documentation.md
│   ├── 📜 Database_Schema.md
│   ├── 📜 Performance_Analysis.md
│   ├── 📜 Viva_QandA.md
│   └── 📜 Presentation.pptx
│
├── 📁 scripts/
│   ├── 📜 seed_data.js
│   ├── 📜 generate_test_data.js
│   └── 📜 backup_db.sh
│
├── 📜 package.json                     # Root package.json for scripts
├── 📜 docker-compose.yml
├── 📜 README.md
└── 📜 .gitignore