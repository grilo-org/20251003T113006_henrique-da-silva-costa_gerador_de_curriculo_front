import React from 'react'
import Formulario from '../crud/Formulario'
import { Button, Container } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from "../stylos.module.css"

const RecuperarSenha = () => {
    const nav = useNavigate();

    const inputs = {
        senha: "",
        novaSenha: "",
        confirmaSenha: "",
        emailVerificar: JSON.parse(localStorage.getItem("emailVerificar")),
    }

    return (
        <>
            <Button color="transparent" onClick={() => nav("/verificaremail")}>
                <FaArrowLeft fontSize={45} className="m-2" />
            </Button>
            <Container className={styles.formularioContainer}>
                <h1 className="text-center">Recuperar senha</h1>
                <Formulario botaoCor={"primary"} url={"recuperarsenha"} textoBotao={"RECUPERAR SENHA"} inputs={inputs} tipoFormulario={"recuperarSenha"} />
            </Container>
        </>

    )
}

export default RecuperarSenha