import './App.css'
import { useContext, useEffect, useState } from 'react'
import { Usuario } from './contexts/Usuario'
import Paginas from './routes/Paginas'
import Login from './routes/Login'
import axios from 'axios'

function App() {
  const [usuario, setUsuario] = useState(sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")) : "");
  const { auth, setAuth } = useContext(Usuario);

  useEffect(() => {
    axios.post("https://henriquedeveloper.com.br/verificaremail", { emailVerificar: usuario.email }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      if (res.data.erro) {
        setAuth(false);
        sessionStorage.setItem("usuario", "");
        return;
      }

      setAuth(true);

    }).catch((err) => {
      setAuth(false)
    });
  }, []);

  return auth ? <Paginas /> : <Login />
}

export default App
