import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginHome from '../LoginHome'
import CadastrarUsuario from '../CadastrarUsuario'
import Verificaremail from '../pages/Verificaremail'
import RecuperarSenha from '../pages/RecuperarSenha'
import NotFound from '../NotFound'

const Login = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginHome />} />
                    <Route path="/cadastrar" element={<CadastrarUsuario />} />
                    <Route path="/verificaremail" element={<Verificaremail />} />
                    <Route path="/recuperarSenha" element={<RecuperarSenha />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Login
