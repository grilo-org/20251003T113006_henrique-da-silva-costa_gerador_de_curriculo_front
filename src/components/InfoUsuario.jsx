import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Usuario } from '../contexts/Usuario';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { FaUserAlt } from 'react-icons/fa';
import styles from "../stylos.module.css"

const InfoUsuario = () => {
    const [usuario, setUsuario] = useState(sessionStorage.getItem("usuario") ? JSON.parse(sessionStorage.getItem("usuario")) : "");
    const { setAuth } = useContext(Usuario);
    const nav = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const sair = () => {
        setAuth(false)
        sessionStorage.setItem("usuario", "");
        nav("/");
    }

    return (
        <div className="d-flex p-2 justify-content-end">
            <Dropdown isOpen={dropdownOpen} className="z-0 position-absolute" toggle={toggle} direction={"down"}>
                <DropdownToggle color="transparent" className="border border-0" caret>
                    {
                        usuario.img ? <img src={usuario.img} alt="" height={50} width={50} className="rounded-circle object-fit-cover" /> : <FaUserAlt fontSize={50} />
                    }
                    <h3 className={styles.fonteUsuarioNome}>{usuario.nome ? usuario.nome.slice(0, 8) + "..." : ""}</h3>
                </DropdownToggle>
                <DropdownMenu className="mt-2">
                    <DropdownItem>
                        <p>{usuario.nome}</p>
                        <p>{usuario.email}</p>
                        <div className="text-end">
                            <Button color="danger" onClick={sair}>SAIR</Button>
                        </div>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default InfoUsuario