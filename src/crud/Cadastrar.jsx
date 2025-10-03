import React, { useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from "../stylos.module.css"
import axios from 'axios';
import { campoObrigatorio, colunas, tamanhoModalFull, tipoInput, tipoLabel, tipoPlaceholder } from './funcoesFormularios';

const Cadastrar = ({
    inputs = {},
    pegarDadosCarregar = () => { },
    id = null,
    url = "",
    tipoFormulario = "",
    tamanhoBotao = ""
}) => {
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [msgCor, setMsgCor] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState("CADASTRAR");
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal)
        setFormulario(inputs);
        setErro({});
        setMsg("");
    }

    const changeInputs = (e) => {
        const { name, value, files } = e.target;

        setFormulario({
            ...formulario, [name]: name === "img" ? files[0] : value
        });
    }

    const enviar = (e) => {
        e.preventDefault();

        const msgerros = {};

        setErro(msgerros);
        setDesabilitar(true);
        setTextoBotaoCarregando("CAREGANDO...")

        axios.post(`https://henriquedeveloper.com.br/${url}`, formulario, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((res) => {
            for (const [key, value] of Object.entries(formulario)) {
                if (value != null && value.length == 0) {
                    msgerros[key] = "Campo obrigatório";
                }

                if (value != null && value.length > 10 && key == "idade") {
                    msgerros[key] = `O campo ${key} dever ter no maximo 10 caracteres`;
                }

                if (value != null && value.length > 255) {
                    msgerros[key] = `O campo ${key} dever ter no maximo 255 caracteres`;
                }

                if (res.data.campo) {
                    msgerros[res.data.campo] = res.data.msg;
                }

                if (res.data.campo === "data_nascimento") {
                    msgerros["data_nascimento"] = res.data.msg;
                }

                if (res.data.campo === "data_inicio") {
                    msgerros["data_inicio"] = res.data.msg;
                }

                if (res.data.erro) {
                    setModal(true);
                    setMsgCor(styles.erro);
                    setMsg(res.data.msg);
                    setDesabilitar(false);
                    setTextoBotaoCarregando("CADASTRAR")
                }

                if (res.data.campo) {
                    setMsg("");
                }

                setErro(msgerros);
            }

            if (!res.data.erro) {
                pegarDadosCarregar();
                setMsgCor(styles.sucesso);
                setMsg("Cadastro realizado com sucesso");
                setTimeout(() => {
                    setModal(false)
                    setDesabilitar(false);
                }, 1200);
                setTextoBotaoCarregando("CADASTRAR")
            }
        }).catch((err) => {
            if (err) {
                setModal(true);
            }
            setDesabilitar(false)
            setTextoBotaoCarregando("CADASTRAR")
            setMsg("Erro interno no servidor. Por favor contate o suporte" + err);
        })
    }

    return (
        <div>
            <Button color="success" className={styles.fonteBotao12} size={tamanhoBotao} onClick={toggle}>
                CADASTRAR
            </Button>
            <Modal backdrop={modal ? "static" : true} size="xl" fullscreen={tamanhoModalFull(tipoFormulario)} isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>CADASTRAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            <div className="row">
                                {formulario ? Object.keys(formulario).map((valor, index) => {
                                    return (
                                        <div key={index} className={colunas(valor, tipoFormulario)}>
                                            <Label htmlFor={valor} className={styles.labels}><strong>{
                                                campoObrigatorio(valor) ? <span className={styles.erro}>*</span> : ""
                                            }{tipoLabel(valor, tipoFormulario)}</strong></Label>
                                            <Input className="form-control" placeholder={tipoPlaceholder(valor, tipoFormulario)} disabled={desabilitar} name={valor} type={tipoInput(valor, tipoFormulario)} onChange={changeInputs} />
                                            <p className={styles.erro}>{erro[valor]}</p>
                                        </div>
                                    )
                                }) : ""}
                            </div>
                        </FormGroup>
                        <span className={msgCor}>{msg}</span>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button color="danger" disabled={desabilitar} onClick={() => setModal(false)}>FECHAR</Button>
                            <Button color="success" disabled={desabilitar}>{textoBotaoCarregando}</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default Cadastrar
