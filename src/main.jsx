import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BoardProvider } from './context/BoardContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // React.strictMode is in comments to allow drag and drop features to work. Otherwise they wont work
 // <React.StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
 // </React.StrictMode>,
)
