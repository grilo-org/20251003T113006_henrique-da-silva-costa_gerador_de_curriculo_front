import React from 'react'
import { Button, Container } from 'reactstrap'
import Formulario from './crud/Formulario'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import styles from "./stylos.module.css"

const CadastrarUsuario = () => {
    const nav = useNavigate();

    const inputs = {
        img: "",
        nome: "",
        emailVerificar: "",
        senha: ""
    }

    return (
        <>
            <Button color="transparent" onClick={() => nav("/")}>
                <FaArrowLeft fontSize={45} className="m-2" />
            </Button>
            <Container className={styles.formularioContainer}>
                <h1 className="text-center">Cadastro de usuário</h1>
                <Formulario inputs={inputs} url={"cadastrar"} textoBotao={"CADASTRAR"} tipoFormulario={"cadastrarUsuario"} />
            </Container>
        </>
    )
}

export default CadastrarUsuario
