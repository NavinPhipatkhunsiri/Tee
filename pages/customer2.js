import React, { useEffect, useRef, useState } from "react"
import Axios from "axios"
import Router from 'next/router'
import Navbar from "./components/Navbar"
import 'bootstrap/dist/css/bootstrap.css'

const customer2 = () => {
    const [customer, setCustomer] = useState([]);
    const [customerSub, setCustomerSub] = useState([]);
    const [customerSubFill, setCustomerSubFill] = useState([]);
    const [st, setSt] = useState(-1);
    const [row, setRow] = useState(-1);
    const search = useRef('');
    const [cusSelect, setCusSelect] = useState('');
    const cusKitchen = useRef('');

    useEffect(() => {  //OK
        Axios.get(`http://localhost:3001/api/getCustomer`).then((response) => {
            setCustomer(response.data);
        });
        Axios.get(`http://localhost:3001/api/getCustomerSub`).then((response) => {
            //console.log(response.data);
            setCustomerSub(response.data);
            setCustomerSubFill(response.data);
        });

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

    const getNum = (fname, kitchen) => {
        for(let i = 0; i < customerSub.length; i++) {
            if(customerSub[i].fname === fname && customerSub[i].kitchen === kitchen) {
                return i
            }
        }
        return -1
    }

    const tableClick = (r) => {  //OK
        //console.log(customerSubFill[r])
        let n = getNum(customerSubFill[r].fname, customerSubFill[r].kitchen)
        //alert(r + " " + customerSub[r].no + " " + customerSub[r].fname + " " + customerSub[r].kitchen);
        setRow(n);
        setSt(-1);
        setCusSelect(customerSub[n].fname);
        cusKitchen.current.value = customerSub[n].kitchen;
    };

    const searchChange = () => {  //OK
        if(search.current.value === '') {
            setCustomerSubFill(customerSub);
        }
        else {
            const results1 = customerSub.filter((w) => {
                return (
                  w &&
                  w.fname.toLowerCase().includes(search.current.value.toLowerCase()) || w.kitchen.toLowerCase().includes(search.current.value.toLowerCase())
                );
            });
            setCustomerSubFill(results1);
        }
    }

    const insertClick = () => {  //OK
        setSt(0);
        setRow(-1);
        setCusSelect('');
        cusKitchen.current.value = '';
    }

    const deleteClick = () => {  //OK
        // alert(row + " " + customerSub[row].no);
        if(confirm("ต้องการลบข้อมูล")) {
            let load = {
                dd: customerSub[row].no,
            };
            Axios({
                url: "http://localhost:3001/api/deleteCustomerSub",
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

    const saveClick = () => {
        if(cusSelect === '') {
            alert("กรุณาเลือกชื่อลูกค้า");
        }
        else if(cusKitchen.current.value === '') {
            alert("กรุณาใส่ชื่อครัว");
        }
        else {
            //alert(getCustomerNo() + " " + cusKitchen.current.value);
            let load = {
                dd: [getCustomerNo(), cusKitchen.current.value],
            };
            Axios({
                url: "http://localhost:3001/api/insertCustomerSub",
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

    const getCustomerNo = () => {  //OK
        for(let i = 0; i < customer.length; i++) {
            if(customer[i].fname === cusSelect) {
                return customer[i].no;
            }
        }
    }

    const updateClick = () => {  //OK
        if(cusSelect === '') {
            alert("กรุณาเลือกชื่อลูกค้า");
        }
        else if(cusKitchen.current.value === '') {
            alert("กรุณาใส่ชื่อครัว");
        }
        else {
            //alert(customerSub[row].no + " " + getCustomerNo() + " " + cusKitchen.current.value);
            let load = {
                dd: [getCustomerNo(), cusKitchen.current.value, customerSub[row].no],
            };
            Axios({
                url: "http://localhost:3001/api/updateCustomerSub",
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
                        <div className="row pt-1 pb-1">
                            <div className="col-sm-1 text-end">
                                <label>ชื่อสินค้า :</label>
                            </div>
                            <div className="col-sm-3 text-start ">
                                <select value={cusSelect} onChange={(e) => setCusSelect(e.target.value)} >
                                    <option value="" key={-1}></option>
                                        {
                                            customer.map((value) => (
                                                <option value={value.fname} key={value.no}>{value.fname}</option>
                                            ))
                                        }
                                </select>
                            </div>
                            <div className="col-sm-1 text-end">
                                <label>ชื่อครัว :</label>
                            </div>
                            <div className="col-sm-2 text-start ">
                                <input className="w-100" type="text" ref={cusKitchen}/>
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
                                        <th scope="col" className="col-3">ชื่อลูกค้า</th>
                                        <th scope="col" className="col-1">ชื่อครัว</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        customerSubFill.map((value, index) => (
                                            index % 2 == 0 ?
                                            <tr className="table-Secondary" key={value.no} onClick={() => tableClick(index)}>
                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                <td>{value.fname}</td>
                                                <td>{value.kitchen}</td>
                                            </tr>
                                            :
                                            <tr className="table-Secondary"  key={value.no} onClick={() => tableClick(index)}>
                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                <td>{value.fname}</td>
                                                <td>{value.kitchen}</td>
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
                        <input type="text" ref={search} onChange={searchChange} />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default customer2