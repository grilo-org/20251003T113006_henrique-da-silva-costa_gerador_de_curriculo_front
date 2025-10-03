import React, { useContext, useState } from 'react'
import { Button, FormGroup, Input, Label } from 'reactstrap'
import styles from "../stylos.module.css"
import axios from 'axios';
import { Usuario } from '../contexts/Usuario';
import { useNavigate } from 'react-router-dom';
import { campoObrigatorio, colunas, tipoInput, tipoLabel, tipoPlaceholder } from './funcoesFormularios';
import InputMask from "react-input-mask";

const Formulario = ({ inputs = {}, pegarDadosCarregar = () => { }, url, textoBotao, tipoFormulario = "", botaoCor = "success", tamanhoBotao = "" }) => {
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [msgCor, setMsgCor] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState(textoBotao);
    const { setAuth } = useContext(Usuario);
    const [imglocalNome, setImglocalNome] = useState("");
    const nav = useNavigate();

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
                if (value != null && value.length == 0 && key != "img") {
                    msgerros[key] = "Campo obrigatório";
                }

                if (value != null && value.length > 10 && key == "idade") {
                    msgerros[key] = `O campo ${key} dever ter no maximo 10 caracteres`;
                }

                if (value != null && value.length > 255 && key != "descricao") {
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

                if (res.data.campo == "email") {
                    msgerros["email"] = res.data.msg;
                }

                if (tipoFormulario == "login") {
                    if (res.data.erro) {
                        setAuth(false);
                    } else {
                        setAuth(true);
                        sessionStorage.setItem("usuario", JSON.stringify(res.data));
                    }
                }

                if (tipoFormulario == "cadastrarUsuario") {
                    if (!res.data.erro) {
                        setTimeout(() => {
                            nav("/");
                        }, 1200);
                    }
                }

                if (tipoFormulario == "curriculo") {
                    if (!res.data.erro) {
                        setTimeout(() => {
                            localStorage.setItem("curriculo", JSON.stringify(formulario));
                            localStorage.setItem("curriculoId", res.data.id ? JSON.stringify(res.data.id) : "");
                            nav("/experiencias");
                        }, 1200);
                    }
                }

                if (tipoFormulario == "verificarEmail") {
                    if (!res.data.erro) {
                        setTimeout(() => {
                            localStorage.setItem("emailVerificar", JSON.stringify(formulario.emailVerificar));
                            nav("/recuperarsenha")
                        }, 1200);
                    } else {
                        localStorage.setItem("emailVerificar", "");
                    }
                }

                if (tipoFormulario == "recuperarSenha") {
                    if (!res.data.erro) {
                        setTimeout(() => {
                            localStorage.setItem("emailVerificar", "");
                            nav("/")
                        }, 1200);
                    }
                }

                if (res.data.campo) {
                    setMsg("");
                }

                setErro(msgerros);

                if (res.data.erro) {
                    setMsgCor(styles.erro)
                    setMsg(!res.data.campo ? res.data.msg : "");
                    setDesabilitar(false);
                    setTextoBotaoCarregando(textoBotaoCarregando)
                }
                setErro(msgerros);
            }

            if (!res.data.erro) {
                pegarDadosCarregar();
                setMsgCor(styles.sucesso)
                setMsg("Cadastro realizado com sucesso");
                setTimeout(() => {
                    setDesabilitar(false);
                }, 1200);
                setTextoBotaoCarregando(textoBotaoCarregando)
            }
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
            setDesabilitar(false)
            setTextoBotaoCarregando(textoBotaoCarregando)
            setMsg("Erro interno no servidor. Por favor contate o suporte");
        })
    }

    const formatoDeInput = (tipo) => {
        if (tipo == "sexo") {
            return <>
                <select name={tipo} disabled={desabilitar} onChange={(e) => formulario.sexo = e.target.value} className="form-control" value={formulario.tipo} >
                    <option value={""}>Selecione...</option>
                    <option value={"masculino"}>MASCULINO</option>
                    <option value={"feminino"}>FEMININO</option>
                    <option value={"outro"}>OUTRO</option>
                </select>
                <p className={styles.erro}>{erro[tipo]}</p>
            </>
        }

        if (tipo == "telefone") {
            return <>
                <InputMask mask="(99) 99999-9999" className="form-control" type={tipoInput(tipo, tipoFormulario)} placeholder={tipoPlaceholder(tipo)} disabled={desabilitar} name={tipo} onChange={changeInputs} />
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

        return <>
            <Input type={tipoInput(tipo, tipoFormulario)} placeholder={tipoPlaceholder(tipo)} disabled={desabilitar} name={tipo} onChange={changeInputs} />
            <p className={styles.erro}>{erro[tipo]}</p>
        </>
    }

    return (
        <div>
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
            <form onSubmit={enviar}>
                <FormGroup>
                    <div className="row">
                        {formulario ? Object.keys(formulario).map((valor, index) => {
                            return (
                                <div key={index} className={colunas(valor, tipoFormulario)}>
                                    <Label htmlFor={valor} className={styles.labels}><strong>{
                                        campoObrigatorio(valor) ? <span className={styles.erro}>*</span> : ""
                                    } {tipoLabel(valor, tipoFormulario)}</strong></Label>
                                    {formatoDeInput(valor)}
                                </div>
                            )
                        }) : ""}
                    </div>
                </FormGroup>
                <span className={msgCor}>{msg}</span>
                <div className="d-flex gap-2 justify-content-end">
                    <Button color={botaoCor} className={styles.fonteBotao12} size={tamanhoBotao} disabled={desabilitar}>{textoBotaoCarregando}</Button>
                </div>
            </form>
        </div >
    )
}

export default Formulario
