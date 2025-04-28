A responsive web application for browsing and searching collectible anime figurines. Built with React, Tailwind CSS, and a mock GraphQL backend for rapid prototyping.

🚀 Features

🎴 Product Listing: Displays a responsive grid of anime figure cards with image, name, series, and price.

🔍 Live Search: Real-time filtering of figures by name using React state.

💬 Detail Modal: Click “View Details” to open an overlay with full figure information.

⏳ Loading & Error States: User feedback during data fetch and on errors.

⚠️ Empty-State Handling: Friendly message when no search results match.

🛠️ Technologies Used

React (Function components & Hooks)

Vite (Fast development server & build tool)

Tailwind CSS (Utility-first styling)

Apollo Client & GraphQL

Apollo Server (Mock in-memory GraphQL API)

⚙️ Getting Started

Clone the repository:

git clone https://github.com/your-username/anime-figure-marketplace.git
cd anime-figure-marketplace

Install dependencies:

````
npm install
````

Run the mock GraphQL server:

```
npm run server
```
The mock API will be available at http://localhost:4000/.

Start the development server:

```
npm run dev
```

The app will open at http://localhost:5173/.

📂 Project Structure

anime-figure-marketplace/
├─ public/
│  └─ images/              # Static figure images
├─ src/
│  ├─ apollo/
│  │  └─ client.js         # Apollo Client configuration
│  ├─ components/
│  │  ├─ ProductCard.jsx
│  │  └─ ProductList.jsx
│  ├─ index.css            # Tailwind CSS imports
│  ├─ main.jsx             # Entry point & ApolloProvider
│  └─ App.jsx              # Layout & component assembly
├─ server.js               # Mock GraphQL server
├─ tailwind.config.js      # Tailwind configuration
├─ postcss.config.js       # PostCSS configuration
├─ vite.config.js          # Vite configuration
└─ package.json            # Scripts & dependencies

📖 License

This project is licensed under the MIT License.

