import React, { useEffect, useRef, useState } from "react"
import Axios from "axios"
import Router from 'next/router'
import Navbar from "./components/Navbar"
import 'bootstrap/dist/css/bootstrap.css'

const product1 = () => {
    const [support, setSupport] = useState([])
    const [show, setShow] = useState([])
    const [st, setSt] = useState(-1)
    const [row, setRow] = useState(-1)
    const fname = useRef('')
    const address = useRef('')
    const tel = useRef('')
    const fax = useRef('')
    const des = useRef('')

    useEffect(() => {  //OK
        Axios.get('http://localhost:3001/api/getSupport1').then((response) => {
            setSupport(response.data)
            setShow(response.data)
        });
        fname.current.focus()
    }, []);

    const onMenuClick = (menu) => {
        if(menu === 1) {
            Router.push({
                pathname: '/product1',
            });
        }
        else if(menu === 2) {
            Router.push({
                pathname: '/product2',
            });
        }
        else if(menu === 3) {
            Router.push({
                pathname: '/product3',
            });
        }
        else if(menu === 4) {
            Router.push({
                pathname: '/product4',
            });
        }
    }

    const tableClick = (r) => {
        setRow(r)
        setSt(-1)
        fname.current.value = show[r].fname
        address.current.value = show[r].address
        tel.current.value = show[r].tel
        fax.current.value = show[r].fax
        des.current.value = show[r].des
    };

    const insertClick = () => {
        setSt(0)
        setRow(-1)
        fname.current.value = ''
        address.current.value = ''
        tel.current.value = ''
        fax.current.value = ''
        des.current.value = ''
        fname.current.focus()
    }

    const deleteClick = () => {
        if(row === -1) {
            alert("กรุณาเลือกรายการที่ต้องการลบ")
        }
        else {
            if(confirm("ต้องการลบข้อมูล")) {
                let load = {
                    dd: support[row].no,
                }
                Axios({
                    url: "http://localhost:3001/api/deleteSupport",
                    method: "post",
                    data: load,
                })
                .then(function (response) {
                    alert("ลบช้อมูลเรียบร้อย");
                    window.location.reload(false)
                })
                .catch(function (error) {
                    console.log(error)
                })
            }
        }
    }

    const saveClick = () => {
        if(fname.current.value === '') {
            alert("กรุณาใส่ชื่อลูกค้า")
        }
        else {
            let load = {
                dd: [fname.current.value, address.current.value, tel.current.value, fax.current.value, des.current.value],
            }
            Axios({
                url: "http://localhost:3001/api/insertSupport",
                method: "post",
                data: load,
            })
            .then(function (response) {
                alert("เพิ่มข้อมูลเสร็จสมบูรณ์")
                window.location.reload(false)
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    }

    const updateClick = () => {
        if(fname.current.value === '') {
            alert("กรุณาใส่ชื่อลูกค้า")
        }
        else {
            let load = {
                dd: [fname.current.value, address.current.value, tel.current.value, fax.current.value, des.current.value, support[row].no],
            }
            Axios({
                url: "http://localhost:3001/api/updateSupport",
                method: "post",
                data: load,
            })
            .then(function (response) {
                alert("แก้ไขข้อมูลเสร็จสมบูรณ์")
                window.location.reload(false)
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    }

    const search = (e) => {
        if(e.length === 0) {
            setShow(support)
        }
        else {
            const results1 = support.filter((w) => {
                return (
                    w &&
                    w.fname.includes(e)
                );
            });
            setShow(results1)
        }
    }

    return (
        <div>
            <Navbar />
            <ul className = "nav nav-tabs" style={{cursor: "pointer", backgroundColor: "lightgray"}}>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => onMenuClick(1)}>ร้านค้าที่สั่งซื้อ</a>
                </li>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => onMenuClick(2)}>รายชื่อสินค้า</a>
                </li>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => onMenuClick(3)}>ร้านค้า-สินค้า</a>
                </li>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => onMenuClick(4)}>ราคาสินค้า</a>
                </li>
            </ul>
            <div className="container-fluid bg-success">
                <div className="col-sm-12">
                    <div className="row pt-2">
                        <div className="col-sm-1 text-end">
                            <label>ชื่อลูกค้า :</label>
                        </div>
                        <div className="col-sm-2 text-start">
                            <input className="w-100" type="text" ref={fname}/>
                        </div>
                    </div>
                    <div className="row pt-1">
                        <div className="col-sm-1 text-end">
                            <label>ที่อยู่ :</label>
                        </div>
                        <div className="col-sm-5 text-start">
                            <input className="w-100" type="text" ref={address}/>
                        </div>
                    </div>
                    <div className="row pt-1">
                        <div className="col-sm-1 text-end">
                            <label>โทรศัพท์ :</label>
                        </div>
                        <div className="col-sm-2 text-start">
                            <input className="w-100" type="text" ref={tel}/>
                        </div>
                        <div className="col-sm-1 text-end">
                            <label>แฟกซ์ :</label>
                        </div>
                        <div className="col-sm-2 text-start">
                            <input className="w-100" type="text" ref={fax}/>
                        </div>
                    </div>
                    <div className="row pt-1 pb-1">
                        <div className="col-sm-1 text-end">
                            <label>หมายเหตุ :</label>
                        </div>
                        <div className="col-sm-5 text-start">
                            <input className="w-100" type="text" ref={des}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="btn1 pt-1 pb-1" style={{backgroundColor: "lightgray"}}>
                <button type="button" className="btn btn-outline-primary" id="b1" onClick={() => insertClick()}>
                    <img src="icons8-plus-math-16.png" alt="" />
                    <b>Insert</b>
                </button>
                {
                    row === -1 ?
                        <button type="button" className="btn btn-outline-primary" id="b2" disabled>
                            <img src="icons8-minus-161.png" alt="" /> 
                            Delete
                        </button>
                        :
                        <button type="button" className="btn btn-outline-primary" id="b2" onClick={() => deleteClick()}>
                            <img src="icons8-minus-16.png" alt="" /> 
                            <b>Delete</b>
                        </button>
                }
                {
                    st === -1 ? 
                    <button type="button" className="btn btn-outline-primary" id="b3" disabled>
                        <img src="icons8-correct-16.png" alt="" /> 
                        Save
                    </button>
                    :
                    <button type="button" className="btn btn-outline-primary" id="b3" onClick={() => saveClick()}>
                        <img src="icons8-correct-16.png" alt="" /> 
                        <b>Save</b>
                    </button>
                }
                {
                    row === -1 ?
                    <button type="button" className="btn btn-outline-primary" id="b3" disabled>
                        <img src="icons8-windows-update-16.png" alt="" /> 
                        Update
                    </button>
                    :
                    <button type="button" className="btn btn-outline-primary" id="b3" onClick={() => updateClick()}>
                        <img src="icons8-windows-update-16.png" alt="" /> 
                        <b>Update</b>
                    </button>
                }
            </div>
            <div className="tableCustomer">
                <div className="row">
                    <div className="col-sm-9">
                        <div className="scrollable">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-1 text-center">ลำดับ</th>
                                        <th scope="col" className="col-3 text-center">ชื่อ</th>
                                        <th scope="col" className="col-1 text-center">โทรศัพท์</th>
                                        <th scope="col" className="col-1 text-center">แฟกซ์</th>
                                        <th scope="col" className="col-4 text-center">ที่อยู่</th>
                                        <th scope="col" className="col-2 text-center">หมายเหตุ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        show.map((value, index) => (
                                            <tr className="table-Secondary" key={value.no} onClick={() => tableClick(index)}>
                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                <td>{value.fname}</td>
                                                <td style={{ textAlign: "center" }}>{value.tel}</td>
                                                <td style={{ textAlign: "center" }}>{value.fax}</td>
                                                <td>{value.address}</td>
                                                <td>{value.des}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col pt-2 pb-2" style={{backgroundColor: "lightblue", textAlign: "center"}}>
                        <label><h3>ค้นหา</h3></label>
                        <br />
                        <input type="text" onChange={(e) => search(e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default product1