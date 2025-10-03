import React, { useContext } from 'react'
import { Button, Container } from 'reactstrap';
import Formulario from './crud/Formulario';
import { useNavigate } from 'react-router-dom';
import styles from "./stylos.module.css"

const LoginHome = () => {
    const nav = useNavigate();

    const inputs = {
        email: "",
        senha: "",
    };

    return (
        <Container className={styles.formularioContainer}>
            <h1 className="text-center">LOGIN</h1>
            <Formulario botaoCor={"primary"} inputs={inputs} url={"login"} textoBotao={"ENTRAR"} tipoFormulario={"login"} />
            <div className="d-flex gap-2 mt-3">
                <Button className={styles.fonteBotao12} color="success" onClick={() => nav("/cadastrar")}>CADASTRE-SE</Button>
                <Button className={styles.fonteBotao12} onClick={() => nav("/verificaremail")}>RECUPEAR SENHA</Button>
            </div>
        </Container>
    )
}

export default LoginHome