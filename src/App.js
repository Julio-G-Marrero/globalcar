import React from 'react';
import './App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ReactDOM from "react-dom";
import Register from './components/Register';
import { OrdersContext } from './contexts/OrdersContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProductPage from './components/ProductsPage';
import ClientPage from './components/ClientPage';
import InformesPage from './components/InformesPage';
function App() {
  const orderStatus = {
    "1" : "En Revisión",
    "2" : "Autorizada",
    "3" : "Surtida",
    "4" : "Dengada"
  }
  
  const [popupCreateOrder, setPopupCreateOrder] = React.useState(false)
  const [popupCreatProduct, setPopupCreateProduct] = React.useState(false)
  const [popupCreatClient, setPopupCreateClient] = React.useState(false)
  const [popupEditOrder, setPopupEditOrder] = React.useState(false)
  const [overlay, setOverlay] = React.useState(false)
  const [overlayToolTip, setOverlayToolTip] = React.useState(false)
  const [isOpenToolTip,setIsOpenToolTip] = React.useState(false)
  const [isLoggedIn , setIsLoggedIn] = React.useState(false)
  const [user , setUser] = React.useState({})
  const [orders,setOrders] = React.useState({})
  const [rol,setRol] = React.useState(2)

  const jwt = localStorage.getItem('jwt');
  const userInit = {
    id: localStorage.getItem('user-id'),
    email: localStorage.getItem('user-email'),
    nombre: localStorage.getItem('user-nombre'),
    departament: localStorage.getItem('user-departament'),
  }
  React.useEffect(() => {
    if(jwt) {
      setIsLoggedIn(true)
    }
    setUser(userInit)
    if(userInit.email == "comprasglobal@hotmail.com") {
      setRol(1)
      localStorage.setItem('user-departament',1)
    }
    setRol(userInit.departament)
  },[])
  function closeAllPopups() {
    setPopupCreateOrder(false)
    setOverlay(false)
    setPopupEditOrder(false)
    setPopupCreateProduct(false)
    setPopupCreateClient(false)
  }
  function closeAllPopupsToolTip() {
    setOverlayToolTip(false)
    setIsOpenToolTip(false)
  }
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route path="/dashboard">
              <ProtectedRoute isLoggedIn={jwt} path="/dashboard">
                <Dashboard 
                rol={rol}
                user={user}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
                jwt={jwt}
                orderStatus={orderStatus}
                popupEditOrder={popupEditOrder} setPopupEditOrder={setPopupEditOrder}
                popupCreateOrder={popupCreateOrder} setPopupCreateOrder={setPopupCreateOrder}
                setOrders={setOrders}
                overlay={overlay} setOverlay={setOverlay}
                overlayToolTip={overlayToolTip} setOverlayToolTip={setOverlayToolTip}
                closeAllPopups={closeAllPopups}
                isOpenToolTip={isOpenToolTip} setIsOpenToolTip={setIsOpenToolTip}
                closeAllPopupsToolTip={closeAllPopupsToolTip}/>
              </ProtectedRoute>
          </Route>
          <Route path="/products">
            <ProductPage
                setIsLoggedIn={setIsLoggedIn}
                popupCreatProduct={popupCreatProduct}
                setPopupCreateProduct={setPopupCreateProduct}
                closeAllPopups={closeAllPopups}
                setOverlay={setOverlay}
                overlay={overlay}
                jwt={jwt}
                />
          </Route>
          <Route path="/clientes">
            <ClientPage
                setIsLoggedIn={setIsLoggedIn}
                popupCreatClient={popupCreatClient}
                setPopupCreateClient={setPopupCreateClient}
                closeAllPopups={closeAllPopups}
                setOverlay={setOverlay}
                overlay={overlay}
                jwt={jwt}
                />
          </Route>
          <Route path="/informes">
            <InformesPage
                jwt={jwt}
              />
          </Route>
          <Route path="/register">
            <Register/>
          </Route>
          <Route path="/">
            {isLoggedIn ? <Redirect to="/dashboard"/> :           
            <Login
            setUser={setUser}
            jwt={jwt}
            setIsLoggedIn={setIsLoggedIn}/>}
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
