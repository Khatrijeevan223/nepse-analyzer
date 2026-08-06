# NEPSE Analyzer — Project and Learning Context

## Student context

Jeevan Khatri is completing an Associate degree in Software Development at Broward College and plans to continue at FIU in a Data Science and Artificial Intelligence direction. The immediate career objective is an internship, junior software-development opportunity, QA/test role, application-support role, SQL/reporting role, or junior data-analysis role. Data science, machine learning, and AI engineering are longer-term targets supported by stronger mathematics, statistics, algorithms, and upper-division FIU coursework.

## Existing foundation

- HTML and semantic page structure
- CSS, Flexbox, Grid, responsive design, transitions, and animations
- JavaScript DOM manipulation, events, local storage, and introductory Fetch API work
- Git, GitHub, GitHub Pages, commits, branches, README files, and `.gitignore`
- C++ programming fundamentals and object-oriented concepts
- Introductory C#, ASP.NET Core, APIs, and MySQL experience
- A deployed developer portfolio

## Broward-to-FIU learning priorities

The previous roadmap prioritized these areas:

1. Python and SQL for data roles, APIs, and automation
2. SQL, relational modeling, data cleaning, and reporting
3. C# object-oriented development, architecture, and testing
4. JavaScript and full-stack delivery
5. Data structures and algorithms in preparation for courses such as COP3410 and COP3465
6. Statistics, linear algebra, and calculus for FIU data-science and AI coursework
7. Applied machine learning only after reliable programming, data, and math foundations
8. GitHub projects that can be explained, tested, documented, and demonstrated

Relevant previously discussed FIU preparation included COP3045, CAP2757, CAP3764, COP3410, COP3465, statistics, linear algebra, CAP4612, and CAP4630. Exact future enrollment should always be confirmed against FIU's current catalog and transfer evaluation.

## Why this project fits the plan

NEPSE Analyzer connects the learning path into one growing application:

- HTML/CSS: dashboard layout and responsive design
- JavaScript: arrays, objects, functions, search, filters, sorting, Fetch API, and charts
- C#: backend models, services, validation, dependency injection, and REST endpoints
- MySQL/SQL: companies, daily prices, reports, financial metrics, constraints, and analytical queries
- Data structures: efficient searching, ranking, and caching
- Python: data validation, cleaning, scheduled ingestion, and later analysis
- Statistics: returns, averages, volatility, quarter-over-quarter and year-over-year comparisons
- Machine learning later: carefully evaluated educational experiments, not investment advice

## Product definition

The application should answer:

1. What happened in the NEPSE market today?
2. Which listed companies gained or lost the most today?
3. Which companies recently released quarterly reports?
4. How did their revenue, net profit, EPS, and other metrics change?

## Version-one features

- NEPSE market summary
- Daily stock-price table
- Search by symbol or company name
- Filter by sector
- Top five gainers and losers based on daily percentage change
- Company detail view
- Five to ten manually verified quarterly reports
- Quarter-over-quarter and year-over-year comparisons
- Original report/source links
- Data update timestamp
- Responsive design and dark mode
- Clear data limitations and non-advisory disclaimer

## Deferred features

- Real-money trading
- Buy/sell recommendations
- User accounts
- Automated PDF extraction
- Second-by-second licensed market data
- News sentiment
- Machine-learning price predictions
- Mobile application

## Core calculations

Daily price change:

```text
point change = current price - previous closing price

percentage change =
((current price - previous closing price) / previous closing price) * 100
```

Financial metric comparison:

```text
percentage change =
((current value - comparison value) / comparison value) * 100
```

Daily price performance and quarterly financial performance must remain separate concepts. The interface should use terms such as "daily gainers/losers" for price movement and "quarterly financial changes" for report comparisons.

## Data strategy

1. Start with clearly labeled sample JSON data so frontend learning is not blocked.
2. Add manually verified quarterly reports with original source links.
3. Create a backend data-provider interface so the source can change later.
4. Evaluate a licensed NEPSE provider before treating the application as a serious public market-data product.
5. Validate, timestamp, cache, and record the source of every imported dataset.

Unofficial data must be labeled as unofficial and should never be presented as guaranteed real-time exchange data.

## One-month sequence

### Week 1 — Frontend foundation

- Market terminology and calculation practice
- Requirements and wireframe
- Semantic HTML dashboard
- CSS Grid/Flexbox, responsive layout, and dark mode
- Sample JSON market data

### Week 2 — JavaScript application

- Render the interface from data
- Search and sector filtering
- Sort and rank gainers/losers
- Company details and charts
- Loading, empty, and error states
- Local watchlist if time permits

### Week 3 — ASP.NET Core and MySQL

- REST concepts and API design
- C# models and services
- Relational schema and SQL
- Market and report endpoints
- Frontend-to-backend integration
- Validation and testing

### Week 4 — Data pipeline and reports

- Data-source evaluation
- Fetch, validate, transform, save, and log workflow
- Quarterly metric comparisons
- Source links and timestamps
- Testing, README, architecture diagram, deployment, and demo

## Daily study method

For a seven-to-eight-hour study day, target approximately six focused hours plus breaks:

- 1 hour learning
- 3 hours implementation
- 1 hour debugging and testing
- 1 hour review and rewriting confusing code
- 30 minutes documentation and Git commit

Broward assignments and exams remain the priority. During heavy coursework, reduce project hours rather than sacrificing academic performance.

## Day-one definition of done

- Explain key NEPSE and financial-report terms in your own words
- Calculate point and percentage changes for sample companies
- Finalize version-one requirements and exclusions
- Create at least three sample stock objects
- Draw the dashboard wireframe
- Create the initial project structure
- Make the first Git commit

## Working agreement for future lessons

Each lesson should:

1. Explain the concept before code
2. Connect the concept to the NEPSE application
3. Provide a bounded implementation task
4. Require testing and an explanation from Jeevan
5. End with a meaningful Git commit

The project is complete only when Jeevan can explain, modify, run, and debug the work—not merely copy it.
