import axios from 'axios';
import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styles from "../stylos.module.css"

const Excluir = ({ id = null, nome = "", pegarDadosCarregar = () => { }, url = "", tamanhoBotao = "", item = "" }) => {
    const [modal, setModal] = useState(false);
    const [msg, setMsg] = useState("");
    const [msgCor, setMsgCor] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotao, setTextoBotao] = useState("EXCLUIR");

    const toggle = () => {
        setMsgCor("")
        setMsg("")
        setModal(!modal)
    };

    const deletar = () => {

        setTextoBotao("CARREGANDO...")
        axios.options(`https://henriquedeveloper.com.br/${url}`, { params: { id: id } }, {
            headers: {
                "content-type": "application/json"
            }
        }).then((res) => {
            setDesabilitar(true);

            if (res.data.erro) {
                setModal(true);
                setTimeout(() => {
                    setDesabilitar(false);
                    setTextoBotao("EXCLUIR")
                }, 1200);
                setMsgCor(styles.erro);
                setMsg(res.data.msg);
                return;
            }

            setMsgCor(styles.sucesso)
            setMsg("Exclusao realizada com sucesso");
            setTimeout(() => {
                setDesabilitar(false)
                setTextoBotao("EXCLUIR")
                setModal(false)
                pegarDadosCarregar();
            }, 1200);
        }).catch((err) => {
            setDesabilitar(false)
            setTextoBotao("EXCLUIR")
            setMsg("Erro interno no servidor, contate o suporte");
        })
    }

    return (
        <div>
            <Button color="danger" className={styles.fonteBotao12} size={tamanhoBotao} onClick={toggle}>
                EXCLUIR
            </Button>
            <Modal backdrop={modal ? "static" : true} isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>EXCLUIR</ModalHeader>
                <ModalBody>
                    <h4>Deseja exluir {item}</h4>
                    <p className={msgCor}>{msg}</p>
                </ModalBody>
                <ModalFooter>
                    <Button disabled={desabilitar} color="secondary" onClick={() => setModal(false)}>
                        CANCELAR
                    </Button>
                    <Button disabled={desabilitar} color="danger" onClick={deletar}>
                        {textoBotao}
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Excluir
