import React, { useEffect, useRef, useState } from 'react'
import Axios from "axios"
import Router from 'next/router'
import Navbar from './components/Navbar'
import 'bootstrap/dist/css/bootstrap.css'

const product3 = () => {
    const [product, setProduct] = useState([])
    const [support, setSupport] = useState([])
    const [show, setShow] = useState([])
    const [proSelectName, setProSelectName] = useState('')
    const [proSelectRow, setProSelectRow] = useState(-1)
    const [ShowSelectRow, setShowSelectRow] = useState(-1)
    const [supSelect, setSupSelect] = useState('')

    const search = useRef('');

    useEffect(() => {  //OK
        const fetchData = async () => {
            try {
                const res1 = await Axios.get('http://localhost:3001/api/getProduct1')
                let data = []
                //flag:0,fname:"กระชาย",no:58,support_name:"กรุณา",support_no:22
                for(let i = 0; i < res1.data.length; i++) {
                    let newData = {flag: res1.data[i].flag, fname: res1.data[i].fname, no: res1.data[i].no, old_support_name: res1.data[i].support_name, new_support_name: res1.data[i].support_name, support_no: res1.data[i].support_no, row: i}
                    data.push(newData)
                }
                console.log(data)
                setProduct(data)
                setShow(data)

                const res2 = await Axios.get(`http://localhost:3001/api/getSupport`);
                setSupport(res2.data);
            }
            catch(error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
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
        setProSelectName('')
        setProSelectRow(-1)
        setSupSelect('')
        if(search.current.value === '') {
            setShow(product);
        }
        else {
            const results1 = product.filter((w) => {
                return (
                    w &&
                    w.fname.toLowerCase().includes(search.current.value.toLowerCase()) ||
                    w.new_support_name.toLowerCase().includes(search.current.value.toLowerCase())
                );
            });
            setShow(results1);
        }
    }

    const tableClick = (row, index) => {
        setProSelectName(product[row].fname);
        setProSelectRow(row)
        setShowSelectRow(index)
        setSupSelect(show[index].new_support_name);
    }

    const subChange = (e) => {
        if(proSelectRow > -1) {
            product[proSelectRow].new_support_name = e
            setProduct([...product])
            show[ShowSelectRow].new_support_name = e
            setShow([...show])
        }
    }
    
    const getSupportNo = (sname) => {
        for(let i = 0; i < support.length; i++) {
            if(support[i].fname === sname) {
                return support[i].no;
            }
        }
    }

    const updateClick = async () => {
        let st = 0
        for(let i = 0; i < product.length; i++) {
            if(product[i].old_support_name !== product[i].new_support_name) {
                st = 1
                let load = {
                    dd: [getSupportNo(product[i].new_support_name), product[i].no],
                }
                console.log(product[i])
                console.log(load)
                await Axios.post('http://localhost:3001/api/updateProduct_Support', load)
            }
        }
        if(st === 1) {
            alert('อัพเดตสมบูรณ์')
            window.location.reload(false)
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
                            <div className="col-sm-2 text-start ">
                                <input type="text" value={proSelectName} disabled/>
                            </div>
                            <div className="col-sm-1 text-end">
                                <label>ชื่อร้านค้า :</label>
                            </div>
                            <div className="col-sm-2 text-start ">
                                <select value={supSelect} onChange={(e) => subChange(e.target.value)} style={{width: '100%'}} >
                                    <option value="" key={-1}></option>
                                        {
                                            support.map((value) => (
                                                <option value={value.fname} key={value.no}>{value.fname}</option>
                                            ))
                                        }
                                </select>
                            </div>
                        </div>
                    </div>
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
                                            <th scope="col" className="col-1 text-center">ร้านค้า</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            show.map((value, index) => (
                                                <tr className="table-Secondary" key={value.no} onClick={() => tableClick(value.row, index)}>
                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                    <td>{value.fname}</td>
                                                    <td>{value.new_support_name}</td>
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
                            <br /><br />
                            <button className="btn btn-success" style={{width: '45%'}} onClick={() => updateClick()}>UPDATE</button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default product3