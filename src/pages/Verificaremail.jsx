import React from 'react'
import { Button, Container } from 'reactstrap'
import Formulario from '../crud/Formulario'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import styles from "../stylos.module.css"

const Verificaremail = () => {
    const nav = useNavigate();

    return (
        <>
            <Button color="transparent" onClick={() => nav("/")}>
                <FaArrowLeft fontSize={45} className="m-2" />
            </Button>
            <Container className={styles.formularioContainer}>
                <h1 className="text-center">Verificar e-mail</h1>
                <Formulario botaoCor={"primary"} textoBotao={"VERIFICAR"} url={"verificaremail"} inputs={{ emailVerificar: "" }} tipoFormulario={"verificarEmail"} />
            </Container>
        </>
    )
}

export default Verificaremail
