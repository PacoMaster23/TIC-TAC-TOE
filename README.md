tic · tac · toe
A minimal Tic-Tac-Toe built with React — my first project following the official React tutorial, redesigned with a clean aesthetic.
Mostrar imagen
Mostrar imagen

features

✕ / ○ gameplay with turn tracking
winner and draw detection
full move history with time travel
restart button
minimal UI — warm off-white palette, monospace typography


stack
frameworkReact 18fontsDM Mono · DM Sans (Google Fonts)stylingCSS-in-JS (inline <style> tag)bundlerCreate React App / Vite

getting started
bash# clone the repo
git clone https://github.com/PacoMaster23/tic-tac-toe.git
cd tic-tac-toe

# install dependencies
npm install

# run locally
npm start
Open http://localhost:3000 in your browser.

what i learned
This project was my introduction to core React concepts:

Components — breaking UI into reusable pieces (Square, Board, Game)
Props — passing data and callbacks down the component tree
State with useState — managing game state reactively
Immutability — using .slice() to copy arrays before modifying them, which enables time travel
Lifting state up — keeping history in the top-level Game component so Board and the move list share the same source of truth


project structure
src/
└── App.jsx   # all components and styles in a single file

screenshots

add a screenshot of your app here


license
MIT