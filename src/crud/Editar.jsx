import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from "../stylos.module.css"
import axios from 'axios';
import { campoObrigatorio, colunas, tamanhoModalFull, tipoImg, tipoInput, tipoLabel, tipoPlaceholder } from './funcoesFormularios';
import InputMask from "react-input-mask";

const Editar = ({ pegarDadosCarregar = () => { }, urlGet = "", url = "", tipoFormulario = "", tamanhoBotao = "", urlGetLista = "", data_nascimento, tamanhoModal = "md" }) => {
    const [formulario, setFormulario] = useState({});
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [msgCor, setMsgCor] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState("EDITAR");
    const [modal, setModal] = useState(false);
    const [imglocalNome, setImglocalNome] = useState("");

    const pegarDados = () => {
        setModal(!modal)
        setMsg("")
        setErro({})
        setDesabilitar(true);
        setTextoBotaoCarregando("CAREGANDO...")

        axios.get(urlGet).then((res) => {
            setTimeout(() => {

                setDesabilitar(false);
                setTextoBotaoCarregando("EDITAR")
                if (urlGetLista === "experiencias") {
                    setFormulario({
                        cargo: res.data.cargo,
                        empresa: res.data.empresa,
                        habilidades: res.data.habilidades,
                        data_inicio: res.data.data_inicio,
                        data_fim: res.data.data_fim,
                        responsabilidades: res.data.responsabilidades,
                        id: res.data.id,
                        curriculo_id: res.data.curriculo_id,
                        data_nascimento: data_nascimento == "" ? res.data.data_nascimento : data_nascimento,
                    })
                }

                if (urlGetLista === "curriculo") {
                    setFormulario({
                        img: res.data.img,
                        telefone: res.data.telefone,
                        nome: res.data.nome,
                        sexo: res.data.sexo,
                        estado_civil: res.data.estado_civil,
                        data_nascimento: res.data.data_nascimento,
                        descricao: res.data.descricao,
                        id: res.data.id,
                        usuario_id: res.data.usuario_id,
                    })
                }
            }, 1200);

        }).catch((err) => {
            alert("Erro interno no servidor");
        });
    }

    const toggle = () => {
        setModal(!modal)
    }

    const changeInputs = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImglocalNome(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }

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

                if (value != null && value.length > 255 && key != "img") {
                    msgerros[key] = `O campo ${key} dever ter no maximo 255 caracteres`;
                }

                if (res.data.campo === "data_nascimento") {
                    msgerros["data_nascimento"] = res.data.msg;
                }

                if (res.data.campo === "data_inicio") {
                    msgerros["data_inicio"] = res.data.msg;
                }

                if (res.data.campo) {
                    msgerros[res.data.campo] = res.data.msg;
                }

                if (res.data.erro) {
                    setModal(true);
                    setMsgCor(styles.erro);
                    setMsg(res.data.msg);
                    setDesabilitar(false);
                    setTextoBotaoCarregando("EDITAR")
                }

                if (res.data.campo) {
                    setMsg("");
                }

                setErro(msgerros);
            }

            if (!res.data.erro) {
                pegarDadosCarregar();
                setMsgCor(styles.sucesso);
                setMsg("Edição realizada com sucesso");
                setTimeout(() => {
                    setModal(false)
                    setDesabilitar(false);
                }, 1200);
                setTextoBotaoCarregando("EDITAR")
            }
        }).catch((err) => {
            if (err) {
                setModal(true);
            }
            setDesabilitar(false)
            setTextoBotaoCarregando("EDITAR")
            setMsg("Erro interno no servidor. Por favor contate o suporte" + err);
        })
    }


    const formatoDeInput = (tipo) => {
        if (tipo == "sexo") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={(e) => formulario.sexo = e.target.value} className="form-control" defaultValue={formulario[tipo]} value={formulario.tipo} >
                    <option value={""}>Selecione...</option>
                    <option value={"masculino"}>MASCULINO</option>
                    <option value={"feminino"}>FEMININO</option>
                    <option value={"outro"}>OUTRO</option>
                </select>
                <p className={styles.erro}>{erro[tipo]}</p>
            </>
        }

        if (tipo == "img") {
            return <Input
                name={tipo}
                accept="image/*"
                value={formulario.tipo}
                type={tipoInput(tipo, tipoFormulario)}
                onChange={changeInputs}
                disabled={desabilitar}
            />
        }

        if (tipo == "telefone") {
            return <>
                <InputMask mask="(99) 99999-9999" className="form-control" placeholder={tipoPlaceholder(tipo)} disabled={desabilitar} name={tipo} type={tipoInput(tipo, tipoFormulario)} defaultValue={formulario[tipo]} onChange={changeInputs} />
            </>
        }

        return <>
            <Input placeholder={tipoPlaceholder(tipo)} value={tipoImg(tipo)} disabled={desabilitar} name={tipo} type={tipoInput(tipo, tipoFormulario)} defaultValue={formulario[tipo]} onChange={changeInputs} />
        </>
    }

    return (
        <div>
            <Button color="success" className={styles.fonteBotao12} size={tamanhoBotao} onClick={pegarDados}>
                EDITAR
            </Button>
            <Modal backdrop={modal ? "static" : true} size={tamanhoModal} fullscreen={tamanhoModalFull(tipoFormulario)} isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>EDITAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            <div className="row">
                                {imglocalNome && (
                                    <div>
                                        <h3>Pré-visualização:</h3>
                                        <img
                                            src={imglocalNome}
                                            alt="Pré-visualização"
                                            style={{ maxWidth: '100%', height: '100px' }}
                                        />
                                    </div>
                                )}
                                {formulario ? Object.keys(formulario).map((valor, index) => {
                                    return (
                                        <div key={index} className={colunas(valor, tipoFormulario)}>
                                            <Label htmlFor={valor} className={styles.labels}><strong>{
                                                campoObrigatorio(valor) ? <span className={styles.erro}>*</span> : ""
                                            }{tipoLabel(valor, tipoFormulario)}</strong></Label>
                                            {formatoDeInput(valor)}
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

export default Editar
