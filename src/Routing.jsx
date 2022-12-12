import React from "react";
import { Route, Switch, BrowserRouter, Router, Routes } from "react-router-dom";
import Addcontact from "./pages/Addcontact";
import EditPage from "./pages/EditPage";
import Home from "./pages/Home";



export default function Routing() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="addcontact" element={<Addcontact />} />
                    <Route path="editpage" element={<EditPage />} />

                </Routes>
            </BrowserRouter>
        </div>
    );
}