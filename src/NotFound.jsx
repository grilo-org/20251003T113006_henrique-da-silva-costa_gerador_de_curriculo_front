import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const NotFound = () => {
    const nav = useNavigate();

    return (
        <>
            <Button className="m-3" color="secondary" onClick={() => nav("/")}>Pagina Inical</Button>
            <Container>
                <div><h1 className="text-center">Pagiana não encontrada</h1></div>
            </Container>
        </>
    )
}

export default NotFound