import React, { useEffect, useRef, useState } from 'react'
import Axios from "axios"
import Router from 'next/router'
import Navbar from './components/Navbar'
import 'bootstrap/dist/css/bootstrap.css'

const product2 = () => {
    const [product, setProduct] = useState([]);
    const [show, setShow] = useState([]);
    const [productSelect, setProductSelect] = useState('');
    const productName = useRef('');
    const [st, setSt] = useState(-1);
    const [row, setRow] = useState(-1);
    const search = useRef('');
    const [other, setOther] = useState(0);

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/getProduct`).then((response) => {
            setProduct(response.data);
            setShow(response.data);
            // console.log(response.data);
        });
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

    const searchChange = () => {  //OK
        if(search.current.value === '') {
            setShow(product);
        }
        else {
            const results1 = product.filter((w) => {
                return (
                    w &&
                    w.fname.toLowerCase().includes(search.current.value.toLowerCase())
                );
            });
            setShow(results1);
        }
    }

    const tableClick = (r) => {  //OK
        setProductSelect(show[r].fname);
        setSt(-1);
        setRow(getProductNo(show[r].fname))
        productName.current.value = show[r].fname;
        if(show[r].flag === 0) {
            setOther(0);
        }
        else {
            setOther(1);
        }
    };

    const getProductNo = (pname) => {  //OK
        for(let i = 0; i < product.length; i++) {
            if(product[i].fname === pname) {
                return product[i].no;
            }
        }
    }

    const insertClick = () => {  //OK
        setSt(0);
        setRow(-1);
        setProductSelect('');
        productName.current.value = '';
        setOther(0)
        productName.current.focus();
    }

    const deleteClick = () => {  //OK
        // alert(row);
        if(confirm("ต้องการลบข้อมูล")) {
            let load = {
                dd: row,
            };
            Axios({
                url: "http://localhost:3001/api/deleteProduct",
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

    const saveClick = () => {  //OK
        if(productName.current.value === '') {
            alert("กรุณาใส่ชื่อสินค้า");
        }
        else {
            //alert(productName.current.value + " " + other.current);
            let load = {
                dd: [productName.current.value, other],
            };
            Axios({
                url: "http://localhost:3001/api/insertProduct",
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

    const updateClick = () => {  //OK
        if(productName.current.value === '') {
            alert("กรุณาใส่ชื่อสินค้า");
        }
        else {
            //alert(row + " " + productName.current.value + " " + other);
            let load = {
                dd: [productName.current.value, other, row],
            };
            Axios({
                url: "http://localhost:3001/api/updateProduct",
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
                        <div className="row pt-1 pb-1">
                            <div className="col-sm-1 text-end">
                                <label>ชื่อสินค้า :</label>
                            </div>
                            <div className="col-sm-2 text-start">
                                <input className="w-100" type="text" ref={productName}/>
                            </div>
                            <div className="col-sm-1 text-start">
                            {
                                other === 0 ?
                                <input type='checkbox' id='check1' onChange={() => setOther(1)}/>
                                :
                                <input type='checkbox' id='check1' checked  onChange={() => setOther(0)}/>
                            }
                            <label>&nbsp;สินค้าเบ็ดเตล็ด</label>
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
                        <div className="col-sm-8">
                            <div className="scrollable">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-1 text-center">ลำดับ</th>
                                            <th scope="col" className="col-4 text-center">รายการสินค้า</th>
                                            <th scope="col" className="col-1 text-center">เบ็ดเตล็ด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            show.map((value, index) => (
                                                <tr className="table-Secondary" key={value.no} onClick={() => tableClick(index)}>
                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                    <td>{value.fname}</td>
                                                    {
                                                        value.flag === 1 ?
                                                        <td style={{ textAlign: "center" }}><input type='checkbox' checked  disabled/></td>
                                                        :
                                                        <td style={{ textAlign: "center" }}><input type='checkbox'  disabled/></td>
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
                            <input type="text" ref={search} onChange={searchChange} />
                        </div>
                    </div>
                    <br />
                </div>
            </div>
    )
}

export default product2