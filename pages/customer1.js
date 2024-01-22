import React, { useEffect, useRef, useState } from "react"
import Axios from "axios"
import Router from 'next/router'
import Navbar from "./components/Navbar"
import 'bootstrap/dist/css/bootstrap.css'

const customer1 = () => {
    const [customer, setCustomer] = useState([]);
    const [show, setShow] = useState([]);
    const [other, setOther] = useState(0);
    const [st, setSt] = useState(-1);
    const [row, setRow] = useState(-1);
    const [nextCustomer, setNextCustomer] = useState(-1);
    const fname = useRef('');
    const address = useRef('');
    const tel = useRef('');
    const fax = useRef('');
    const des = useRef('');

    useEffect(() => {  //OK
        Axios.get(`http://localhost:3001/api/getCustomer`).then((response) => {
            setCustomer(response.data);
            setShow(response.data)
        });
        fname.current.focus();
    }, []);

    const onMenuClick = (menu) => {
        if(menu === 1) {
            Router.push({
                pathname: '/customer1',
            });
        }
        else if(menu === 2) {
            Router.push({
                pathname: '/customer2',
            });
        }
    }

    const getNum = (fname) => {
        for(let i = 0; i < customer.length; i++) {
            if(customer[i].fname === fname) {
                return i
            }
        }
        return -1
    }

    const tableClick = (r) => {  //OK
        let n = getNum(show[r].fname)
        setRow(n);
        setSt(-1);
        console.log(customer[n])
        fname.current.value = customer[n].fname;
        address.current.value = customer[n].address;
        tel.current.value = customer[n].tel;
        fax.current.value = customer[n].fax;
        des.current.value = customer[n].des;
        if(customer[n].st === 1) {
            setOther(1);
        }
        else {
            setOther(0);
        }
    };

    const insertClick = () => {  //OK
        Axios.get('http://localhost:3001/api/getNextCustomerNo').then((response) => {
            setNextCustomer(response.data[0].ai);
        });
        setSt(0);
        setRow(-1);
        fname.current.value = '';
        address.current.value = '';
        tel.current.value = '';
        fax.current.value = '';
        des.current.value = '';
        setOther(0);
        fname.current.focus();
    }

    const deleteClick = () => {  //OK
        if(row === -1) {
            alert("กรุณาเลือกรายการที่ต้องการลบ");
        }
        else {
            if(confirm("ต้องการลบข้อมูล")) {
                let load = {
                    dd: customer[row].no,
                };
                Axios({
                    url: "http://localhost:3001/api/deleteCustomer",
                    method: "post",
                    data: load,
                })
                .then(function (response) {
                    alert("ลบช้อมูลเรียบร้อย");
                    window.location.reload(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
    }

    const saveClick = () => {  //OK
        if(fname.current.value === '') {
            alert("กรุณาใส่ชื่อลูกค้า");
        }
        else {
            let load = {
                dd: [fname.current.value, address.current.value, tel.current.value, fax.current.value, des.current.value, other],
                num: nextCustomer,
            };
            Axios({
                url: "http://localhost:3001/api/insertCustomer",
                method: "post",
                data: load,
            })
            .then(function (response) {
                alert("เพิ่มข้อมูลเสร็จสมบูรณ์");
                window.location.reload(false);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    const updateClick = () => {
        if(fname.current.value === '') {
            alert("กรุณาใส่ชื่อลูกค้า");
        }
        else {
            let load = {
                dd: [fname.current.value, address.current.value, tel.current.value, fax.current.value, des.current.value, other, customer[row].no],
            };
            Axios({
                url: "http://localhost:3001/api/updateCustomer",
                method: "post",
                data: load,
            })
            .then(function (response) {
                alert("แก้ไขข้อมูลเสร็จสมบูรณ์");
                window.location.reload(false);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    const search = (e) => {
        if(e.length === 0) {
            setShow(customer)
        }
        else {
            const results1 = customer.filter((w) => {
                return (
                    w &&
                    w.fname.toLowerCase().includes(e.toLowerCase())
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
                    <a className = "nav-link" onClick={() => onMenuClick(1)}>ป้อนสั่งซื้อ</a>
                </li>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => onMenuClick(2)}>รายการสินค้า</a>
                </li>
            </ul>
            <div className="container-fluid bg-primary">
                <div className="col-sm-12">
                    <div className="row pt-2">
                        <div className="col-sm-1 text-end">
                            <label>ชื่อลูกค้า :</label>
                        </div>
                        <div className="col-sm-2 text-start">
                            <input className="w-100" type="text" ref={fname}/>
                        </div>
                        <div className="col-sm-2 text-start">
                        <label className="customer_label2">สถานะ</label>
                            {
                                other === 0 ?
                                <input type='checkbox' className='customer_check1' onChange={() => setOther(1)}/>
                                :
                                <input type='checkbox' className='customer_check1' checked  onChange={() => setOther(0)}/>
                            }
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
                                        <th scope="col" className="col-1">ลำดับ</th>
                                        <th scope="col" className="col-3">ชื่อ</th>
                                        <th scope="col" className="col-1">โทรศัพท์</th>
                                        <th scope="col" className="col-1">แฟกซ์</th>
                                        <th scope="col" className="col-4">ที่อยู่</th>
                                        <th scope="col" className="col-2">หมายเหตุ</th>
                                        <th scope="col" className="col-1">สถานะ</th>
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
                                                {
                                                    value.st === 1 ?
                                                    <td style={{ textAlign: "center" }}>
                                                        <input type='checkbox' disabled checked value={value.st}/>
                                                    </td>
                                                    :
                                                    <td style={{ textAlign: "center" }}>
                                                        <input type='checkbox' disabled value={value.st}/>
                                                    </td>
                                                }
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
};

export default customer1;
