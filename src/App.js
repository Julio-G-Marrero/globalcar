import logo from './logo.svg';
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { OrdersContext } from './contexts/OrdersContext';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  const orderStatus = {
    "1" : "En Revisión",
    "2" : "Autorizada",
    "3" : "Surtida",
    "4" : "Dengada"
  }
  
  const [popupCreateOrder, setPopupCreateOrder] = React.useState(false)
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
    setRol(userInit.departament)
  },[])
  function closeAllPopups() {
    setPopupCreateOrder(false)
    setOverlay(false)
    setPopupEditOrder(false)
  }
  function closeAllPopupsToolTip() {
    setOverlayToolTip(false)
    setIsOpenToolTip(false)
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/back-orders/dashboard">
              <ProtectedRoute isLoggedIn={jwt} path="/back-orders/dashboard">
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
          <Route path="/back-orders/login">
            <Login
            setUser={setUser}
            jwt={jwt}
            setIsLoggedIn={setIsLoggedIn}/>
          </Route>
          <Route path="/back-orders/register">
            <Register/>
          </Route>
          <Route path="/back-orders/">
            {isLoggedIn ? <Redirect to="/back-orders/dashboard"/> : <Redirect to="/back-orders/login"/>}
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
