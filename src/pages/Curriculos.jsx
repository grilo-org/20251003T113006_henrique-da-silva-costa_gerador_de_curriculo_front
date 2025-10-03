import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table } from 'reactstrap';
import Editar from '../crud/Editar';
import Excluir from '../crud/Excluir';
import styles from "../stylos.module.css";
import Carregando from '../components/Carregando';
import InfoUsuario from '../components/InfoUsuario';
import moment from 'moment';

const Curriculos = () => {
    const [dados, setDados] = useState([]);
    const [msg, setMsg] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [botaoDesabilitado, setBotaoDesabilitado] = useState(false);
    const [removerLoading, setRemoverLoading] = useState(false);
    const nav = useNavigate();
    const [usuario] = useState(sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")) :
        0);

    const inputs = {
        nome: "",
        sexo: "",
        img: null,
        descricao: "",
        estado_civil: "",
        telefone: "",
        data_nascimento: "",
        usuario_id: usuario.id,
    }

    const verExperiencias = (id, data_nascimento) => {
        localStorage.setItem("curriculoId", id);
        localStorage.setItem("dataNascimento", data_nascimento);
        nav("/experiencias");
    }

    const pegarCurriculo = (id) => {
        axios.get(`https://henriquedeveloper.com.br/curriculoid/${id}`).then((res) => {
            localStorage.setItem("curriculo", JSON.stringify(res.data));
            window.open('/pdf', '_blank');
        }).catch((err) => {
            alert("Erro interno no servidor");
        });
    }

    const pegarDados = (page) => {
        setBotaoDesabilitado(true)
        axios.get(`https://henriquedeveloper.com.br/curriculo/${usuario.id}`, {
            params: {
                "id": sessionStorage.getItem("usuarioId"),
                "pagina": page
            }
        }).then((res) => {
            setDados(res.data.dados);
            setPaginaAtual(res.data.paginaAtual);
            setTotalPages(res.data.totalPaginas);
            setBotaoDesabilitado(false);
            setRemoverLoading(true);
        }).catch((err) => {
            setMsg("erro interno servidor, entre em  contato com o suporte");
            setBotaoDesabilitado(false);
        });
    }

    useEffect(() => {
        setTimeout(() => {
            pegarDados(paginaAtual);
        }, 1000);
    }, [paginaAtual]);

    const paginar = (page) => {
        setBotaoDesabilitado(true);
        if (page >= 1 && page <= totalPages) {
            setPaginaAtual(page);
        }
    };

    return (
        <>
            <InfoUsuario />
            <Container>
                <h1>Currículos</h1>
                <Button color="success" onClick={() => nav("/")}>CADASTRAR CURRÍCULO</Button>
                {dados.length > 0 ?
                    <Table responsive striped size="sm">
                        <thead>
                            <tr>
                                <th>Titulo</th>
                                <th>Data de criação</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {dados.length > 0 ? dados.map((dado, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{dado.nome ? dado.nome.slice(0, 30) + "..." : "não informado"}</td>
                                            <td>{moment(dado.criado).format("DD/MM/YYYY")}</td>
                                            <td className="d-flex gap-2 justify-content-end">
                                                <Button className={styles.fonteBotao12} size="sm" color="primary" onClick={() => verExperiencias(dado.id, dado.data_nascimento)}>VER EXPERIÊNCIAS</Button>
                                                <Button className={styles.fonteBotao12} size="sm" color="secondary" onClick={() => pegarCurriculo(dado.id)}>VER CURRÍCULO</Button>
                                                <Editar urlGetLista="curriculo" pegarDadosCarregar={pegarDados} tamanhoBotao={"sm"} urlGet={`https://henriquedeveloper.com.br/curriculoid/${dado.id}`} url={"editar/curriculo"} tipoFormulario={"editar"} />
                                                <Excluir item="o currículo" tamanhoBotao={"sm"} url={"excluircurriculo"} id={dado.id} pegarDadosCarregar={pegarDados} />
                                            </td>
                                        </tr>
                                    )
                                }) : ""}
                            </>
                        </tbody>
                    </Table>
                    : ""}

                {msg ? <p className={styles.erro}>{msg}</p> : ""}
                {!removerLoading ? <Carregando /> : dados.length > 0 ? "" : <h2 className="text-center">SEM INFORMAÇÕES</h2>}

                {dados.length > 0 ?
                    <>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button
                                color="primary"
                                onClick={() => paginar(paginaAtual - 1)}
                                disabled={paginaAtual === 1 ? paginaAtual : botaoDesabilitado}
                            >
                                Anterior
                            </Button>
                            {[...Array(totalPages)].map((_, index) => (
                                <Button
                                    color="primary"
                                    disabled={index == paginaAtual - 1 ? true : botaoDesabilitado}
                                    key={index + 1}
                                    onClick={() => paginar(index + 1)}
                                    className={paginaAtual === index + 1 ? "active" : ""}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                            <Button
                                color="primary"
                                onClick={() => paginar(paginaAtual + 1)}
                                disabled={paginaAtual === totalPages ? paginaAtual : botaoDesabilitado}
                            >
                                Próximo
                            </Button>
                        </div>
                        {botaoDesabilitado ? <Carregando /> : ""}
                    </>
                    : ""}

            </Container>
        </>
    )
}

export default Curriculos
