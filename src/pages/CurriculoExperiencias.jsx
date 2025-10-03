import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table } from 'reactstrap';
import moment from 'moment';
import styles from "../stylos.module.css";
import Carregando from '../components/Carregando';
import Editar from '../crud/Editar';
import Excluir from '../crud/Excluir';
import Cadastrar from '../crud/Cadastrar';
import ModalExperiencias from '../components/ModalExperiencias';

const CurriculoExperiencias = () => {
    const [dados, setDados] = useState([]);
    const [msg, setMsg] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [botaoDesabilitado, setBotaoDesabilitado] = useState(false);
    const [removerLoading, setRemoverLoading] = useState(false);
    const nav = useNavigate();
    const curriculoId = localStorage.getItem("curriculoId") ? JSON.parse(localStorage.getItem("curriculoId")) : "";
    const curriculo = localStorage.getItem("curriculo") ? JSON.parse(localStorage.getItem("curriculo")) : "";

    const inputs = {
        empresa: "",
        cargo: "",
        curriculo_id: curriculoId,
        data_nascimento: curriculo.data_nascimento,
        data_inicio: "",
        data_fim: "",
        habilidades: "",
        responsabilidades: "",
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
        axios.get(`https://henriquedeveloper.com.br/experienciaspaginacao/${curriculoId}`, {
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
        if (!curriculoId) {
            nav("/");
            console.log("euu")
        }

        console.log(curriculoId);

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
            <Container>
                <h1>Adicionar experiências</h1>
                {dados.length > 0 ?
                    <div className="text-end d-flex gap-2 justify-content-end mb-3">
                        <Cadastrar tamanhoBotao={"sm"} tipoFormulario={"experiencias"} inputs={inputs} url={"cadastrar/experiencia"} pegarDadosCarregar={pegarDados} />
                        <Button color="secondary" size="sm" onClick={() => nav("/curriculos")}>VER CURRÍCULOS</Button>
                        <Button className={styles.fonteBotao12} size="sm" color="primary" onClick={() => pegarCurriculo(curriculoId)}>VER CURRÍCULO</Button>
                    </div> : <div className="text-end d-flex gap-2 justify-content-end mb-3">
                        <Cadastrar tamanhoBotao={"sm"} tipoFormulario={"experiencias"} inputs={inputs} url={"cadastrar/experiencia"} pegarDadosCarregar={pegarDados} />
                    </div>
                }
                {dados.length > 0 ?
                    <Table responsive striped size="sm">
                        <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Data inicial</th>
                                <th>Data final</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {dados.length > 0 ? dados.map((dado, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{dado.empresa.length ? dado.empresa.slice(0, 30) + "..." : "não informado"}</td>
                                            <td>{moment(dado.data_inicio).format("DD/MM/YYYY")}</td>
                                            <td>{moment(dado.data_fim).format("DD/MM/YYYY")}</td>
                                            <td className="d-flex gap-2 justify-content-end">
                                                <ModalExperiencias id={dado.id} />
                                                <Editar tamanhoModal={"xl"} data_nascimento={localStorage.getItem("dataNascimento")} urlGetLista="experiencias" pegarDadosCarregar={pegarDados} tamanhoBotao={"sm"} urlGet={`https://henriquedeveloper.com.br/experiencia/${dado.id}`} url={"editar/experiencia"} tipoFormulario={"experiencias"} />
                                                <Excluir item="a experiência" tamanhoBotao={"sm"} url={"excluirexperiencia"} id={dado.id} pegarDadosCarregar={pegarDados} />
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

export default CurriculoExperiencias