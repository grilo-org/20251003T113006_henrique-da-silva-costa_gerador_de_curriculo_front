import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalExperiencias = ({ id = "" }) => {
    const [modal, setModal] = useState(false);
    const [dados, setDados] = useState([]);

    const toggle = () => {
        setModal(!modal);
        axios.get(`https://henriquedeveloper.com.br/experiencia/${id}`).then((res) => {
            setDados(res.data);
        }).catch((err) => {
            if (err) {
                alert("dados não encontrados");
            }
        })
        console.log(dados);
    };

    return (
        <div>
            <Button color="primary" size="sm" onClick={toggle}>
                VER EXPERIENCIA
            </Button>
            <Modal isOpen={modal} backdrop="static" toggle={toggle}>
                <ModalHeader toggle={toggle}>Experiencias</ModalHeader>
                <ModalBody>

                    <p><strong>Empresa:</strong> {dados.empresa}</p>
                    <p><strong>Cargo:</strong> {dados.cargo}</p>
                    <p className="text-break"><strong>Responsabilidades</strong></p>
                    <p className="text-break">{dados.responsabilidades}</p>
                    <div>
                        <p><strong>Periodo</strong></p>
                        <p>de {moment(dados.data_inicio).format("DD/MM/YYYY")} a {dados.data_fim ? moment(dados.data_fim).format("DD/MM/YYYY") : "não informado"}</p>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        FECHAR
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );

}

export default ModalExperiencias