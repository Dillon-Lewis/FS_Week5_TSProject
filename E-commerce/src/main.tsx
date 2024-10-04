import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById('root') as HTMLElement).render(
  <Auth0Provider 
    domain='dev-qm8umn7ssapi3coc.us.auth0.com'
    clientId='kU1LDKPtMZ8DoK1w1jSKSXWY09QusmBn'
    authorizationParams={{
      redirect_uri: window.location.origin
    }} >
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
</Auth0Provider>
)
