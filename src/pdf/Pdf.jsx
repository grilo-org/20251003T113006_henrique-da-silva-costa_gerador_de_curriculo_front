import React, { useEffect, useState } from 'react';
import { PDFViewer, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { FaUserAlt } from 'react-icons/fa';
import moment from 'moment';
import axios from 'axios';

const Pdf = () => {
    const [dados, setDados] = useState(localStorage.getItem("curriculo") ? JSON.parse(localStorage.getItem("curriculo")) : {});
    const [experiencias, setExperiencias] = useState([]);

    useEffect(() => {
        axios.get(`https://henriquedeveloper.com.br/experiencias/${dados.id}`).then((res) => {
            setExperiencias(res.data);
        }).catch((err) => {
            if (err) {
                alert("dados não encontrados");
            }
        })
    }, []);

    const [linkImagem] = useState(dados ? dados.img : "");

    const styles = StyleSheet.create({
        body: {
            padding: 20,
            fontFamily: 'Helvetica',
        },
        fs30: {
            fontSize: 30,
        },
        fs22: {
            fontSize: 22,
        },
        fs16: {
            fontSize: 16,
        },
        fs14: {
            fontSize: 14,
        },
        imagem: {
            maxWidth: "200px",
            maxHeight: "200px",
            objectFit: "contain"
        },
        titulo: {
            flexDirection: "column",
            gap: "1rem",
        },
        imagemDiv: {
            // width: "40%",
        },
        descricao: {
            textAlign: "justify",
        },
        conteudo: {
            flexDirection: "column",
            marginBottom: 8,
        },
        experiencias: {
            // width: "60%",
        },
        sobre: {
            // width: "40%",
        },
    });

    const MyDocument = () => (
        <Document title={"curriculo"}>
            <Page style={styles.body}>
                <View style={styles.titulo}>
                    <View style={styles.imagemDiv}>
                        {
                            linkImagem ? <Image style={styles.imagem} src={linkImagem} /> :
                                <FaUserAlt fontSize={50} />
                        }
                    </View>
                    <View style={styles.descricao}>
                        <Text style={styles.fs30}>{dados.nome}</Text>
                        <Text style={styles.fs14}>{dados.descricao}</Text>
                    </View>
                </View>
                <View style={styles.conteudo}>
                    <View style={styles.sobre}>
                        <Text style={styles.fs30}>Dados pessoais</Text>
                        <View>
                            <Text style={styles.fs22}>Informações de contato</Text>
                            <Text style={styles.fs16}>Sexo: {dados.sexo}</Text>
                            <Text style={styles.fs16}>Estado civil: {dados.estado_civil}</Text>
                            <Text style={styles.fs16}>Telefone: {dados.telefone}</Text>
                            <Text style={styles.fs16}>Data de nascimento: {moment(dados.data_nascimento).format("DD/MM/YYYY")}</Text>
                        </View>
                        <View>
                            <Text style={styles.fs22}>Habilidades</Text>
                            <Text style={styles.fs16}>{dados.habilidades}</Text>
                        </View>
                    </View>
                    <View style={styles.experiencias}>
                        <Text style={styles.fs30}>Experiências</Text>
                        <View>

                            {experiencias.length > 0 ? experiencias.map((experiencia, i) => {
                                return (
                                    <div key={i}>
                                        <Text>     </Text>
                                        <Text style={styles.fs22}>Empresa: <Text style={styles.fs16}>{experiencia.empresa}</Text></Text>
                                        <Text style={styles.fs22}>Cargo: <Text style={styles.fs16}>{experiencia.cargo}</Text></Text>
                                        <Text style={styles.fs22}>Responsabilidades</Text>
                                        <Text style={styles.fs16}>{experiencia.responsabilidades}</Text>
                                        <View>
                                            <Text style={styles.fs22}>Período</Text>
                                            <Text style={styles.fs16}>de {moment(experiencia.data_inicio).format("DD/MM/YYYY")} a {experiencia.data_fim ? moment(experiencia.data_fim).format("DD/MM/YYYY") : "não informado"}</Text>
                                        </View>
                                    </div>
                                )
                            }) : ""}

                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );

    return (
        <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "100%"
        }}>
            <PDFViewer width={"100%"} height={"100%"}>
                <MyDocument />
            </PDFViewer>
        </div>
    );
};

export default Pdf;