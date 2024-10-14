import api from "./api";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const Toast = MySwal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = MySwal.stopTimer;
    toast.onmouseleave = MySwal.resumeTimer;
  }
});
export const register = ({username, email, password}) => {

    return fetch(`${api.addressEndpoints}/users/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
          {
              nombre: username,
              email: email,
              password: password,
          }
      ),
  })
  .then((response) => response.json())
  .then((data) => {
      if(data.code == 11000) {
        Toast.fire({
            icon: "error",
            title: "Usuario ya existente"
          });
      }else {
        Toast.fire({
            icon: "success",
            title: "Registrado exitosamente"
          });
      }
  })

  .catch((err) => console.log(err));
}


export const authorize = ({email, password}) => {
  return fetch(`${api.addressEndpoints}/users/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  .then((response => response.json()))
  .then((data) => {
    if (data.token) {
      localStorage.setItem('jwt', data.token);
      localStorage.setItem("user-id",data.user._id);
      localStorage.setItem("user-email",data.user.email);
      localStorage.setItem("user-nombre",data.user.nombre);
      localStorage.setItem("user-departament",data.user.departament);
    }
    return data
  })
  .catch(err => console.log(err))
};

export const getContent = (token) => {
  return fetch(`${api.addressEndpoints}/orders`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(res => res.json())
    .then(data => data)
}