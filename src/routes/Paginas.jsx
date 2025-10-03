import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../Home'
import Curriculos from '../pages/Curriculos'
import Pdf from '../pdf/Pdf'
import CurriculoExperiencias from '../pages/CurriculoExperiencias'
import NotFound from '../NotFound'

const Paginas = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pdf" element={<Pdf />} />
                    <Route path="/curriculos" element={<Curriculos />} />
                    <Route path="/experiencias" element={<CurriculoExperiencias />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Paginas