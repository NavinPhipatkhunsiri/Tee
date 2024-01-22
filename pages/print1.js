import React, { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.css'
import Router from 'next/router'

const print1 = () => {
    const [page, setPage] = useState(1)
    const [date, setDate] = useState('')
    const [customer, setCustomer] = useState([])
    const [support, setSupport] = useState([])
    const [date1, setDate1] = useState('')

    const checkCustomer = (cus, cus1) => {
        for(let i = 0; i < cus.length; i++) {
            if(cus[i].order_no === cus1.order_no) {
                return i
            }
        }
        return -1
    }

    const getSupportName = (pro, proName) => {
        for(let i = 0; i < pro.length; i++) {
            if(pro[i].fname === proName) {
                return pro[i].support_name
            }
        }
        return ''
    }

    const checkSupport = (sup, res) => {
        for(let i = 0; i < sup.length; i++) {
            if(sup[i].support_name === res) {
                return i
            }
        }
        return -1
    }

    useEffect(() => {
        let curr = new Date()
        const year = curr.getFullYear()
        const month = String(curr.getMonth() + 1).padStart(2, '0')
        const date = String(curr.getDate()).padStart(2, '0')
        const dTime = date + '-' + month + '-' + year
        const dTime1 = year + '-' + month + '-' + date
        setDate1(dTime)
        setDate(dTime1)
        let cus = []
        let sup = []
        const loadData = async () => {
            let load = {
                dd: dTime,
            }
            const cus1 = await Axios.post('http://localhost:3001/api/getCustomer_orderWithDate', load)
            // {customer_kitchen: "qqq",customer_name: "CHI Hotel", customer_no: 5, date: "29-12-2023",no: 1, order_no: "2023000002", ordertype: 2, po: "-", price: 20, product_name: "กระชาย", product_no: 58, qty: 1}
            for(let i = 0; i < cus1.data.length; i++) {
                if(checkCustomer(cus, cus1.data[i]) === -1) {
                    const newData = {order_no: cus1.data[i].order_no, customer_kitchen: cus1.data[i].customer_kitchen, customer_name: cus1.data[i].customer_name, po: cus1.data[i].po}
                    cus.push(newData)
                }
            }
            const cus2 = await Axios.post('http://localhost:3001/api/getCustomer_sp_orderWithDate', load)
            for(let i = 0; i < cus2.data.length; i++) {
                if(checkCustomer(cus, cus2.data[i]) === -1) {
                    const newData = {order_no: cus2.data[i].order_no, customer_kitchen: cus2.data[i].customer_kitchen, customer_name: cus2.data[i].customer_name, po: cus2.data[i].po}
                    cus.push(newData)
                }
            }
            setCustomer(cus)
            const pro = await Axios.get('http://localhost:3001/api/getProductAndName')
            for(let i = 0; i < cus1.data.length; i++) {
                const sName = getSupportName(pro.data, cus1.data[i].product_name)
                if(checkSupport(sup, sName) === -1) {
                    sup.push({support_name: sName})
                }
            }
            for(let i = 0; i < cus2.data.length; i++) {
                if(checkSupport(sup, cus2.data[i].supply_name) === -1) {
                    sup.push({support_name: cus2.data[i].supply_name})
                }
            }
            setSupport(sup)
        }
        loadData()
    }, [])
    
    const tabsClick = async (n) => {
        if(n === 1 && page !== 1) {
            setPage(1)
        }
        else if(n === 2 && page !== 2) {
            setPage(2)
        }
        else if(n === 3 && page !== 3) {
            setPage(3)
        }
    }

    const dateChange = async (e) => {
        let curr = new Date(e)
        const year = curr.getFullYear()
        const month = String(curr.getMonth() + 1).padStart(2, '0')
        const date = String(curr.getDate()).padStart(2, '0')
        const dTime = date + '-' + month + '-' + year
        const dTime1 = year + '-' + month + '-' + date
        setDate1(dTime)
        setDate(dTime1)
        let cus = []
        let sup = []
        const loadData = async () => {
            let load = {
                dd: dTime,
            }
            const cus1 = await Axios.post('http://localhost:3001/api/getCustomer_orderWithDate', load)
            // {customer_kitchen: "qqq",customer_name: "CHI Hotel", customer_no: 5, date: "29-12-2023",no: 1, order_no: "2023000002", ordertype: 2, po: "-", price: 20, product_name: "กระชาย", product_no: 58, qty: 1}
            for(let i = 0; i < cus1.data.length; i++) {
                if(checkCustomer(cus, cus1.data[i]) === -1) {
                    const newData = {order_no: cus1.data[i].order_no, customer_kitchen: cus1.data[i].customer_kitchen, customer_name: cus1.data[i].customer_name, po: cus1.data[i].po}
                    cus.push(newData)
                }
            }
            const cus2 = await Axios.post('http://localhost:3001/api/getCustomer_sp_orderWithDate', load)
            for(let i = 0; i < cus2.data.length; i++) {
                if(checkCustomer(cus, cus2.data[i]) === -1) {
                    const newData = {order_no: cus2.data[i].order_no, customer_kitchen: cus2.data[i].customer_kitchen, customer_name: cus2.data[i].customer_name, po: cus2.data[i].po}
                    cus.push(newData)
                }
            }
            setCustomer(cus)
            const pro = await Axios.get('http://localhost:3001/api/getProductAndName')
            for(let i = 0; i < cus1.data.length; i++) {
                const sName = getSupportName(pro.data, cus1.data[i].product_name)
                if(checkSupport(sup, sName) === -1) {
                    sup.push({support_name: sName})
                }
            }
            for(let i = 0; i < cus2.data.length; i++) {
                if(checkSupport(sup, cus2.data[i].supply_name) === -1) {
                    sup.push({support_name: cus2.data[i].supply_name})
                }
            }
            setSupport(sup)
        }
        loadData()
    }

    const previewClick1 = (idx) => {
        Router.push({
            pathname: '/preview1',
            query: {order_no: customer[idx].order_no},
        });
    }
    const previewClick2 = (idx) => {
        Router.push({
            pathname: '/preview2',
            query: {order_no: customer[idx].order_no},
        });
    }
    const previewClick3 = (idx) => {
        Router.push({
            pathname: '/preview3',
            query: {support_name: support[idx].support_name, date: date1},
        });
    }
    return (
        <div>
            <Navbar />
            <ul className = "nav nav-tabs" style={{cursor: "pointer", backgroundColor: "lightgray"}}>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => tabsClick(1)}>ใบเสนอราคาลูกค้า</a>
                </li>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => tabsClick(2)}>ใบจัดเตรียมของ</a>
                </li>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => tabsClick(3)}>ใบสั่งซื้อร้านค้า</a>
                </li>
            </ul>
            <div className='row mt-3' style={{color: 'blue'}}>
                <div className="col-sm-12 text-center">
                {
                    page === 1 ?
                    <h1>ใบเสนอราคาลูกค้า</h1>
                    :
                    page === 2 ?
                    <h1>ใบจัดเตรียมของ</h1>
                    :
                    <h1>ใบสั่งซื้อร้านค้า</h1>
                }
                </div>
            </div>
            <div className='row mt-3'>
                <div className="col"></div>
                <div className="col-sm-5 text-center">
                    <h3>กรุณาเลือกวันที่</h3>
                    <input type="date" defaultValue={date} onChange={(e) => dateChange(e.target.value)}/>
                </div>
                <div className="col"></div>
            </div>
            <br />
            <div className="row">
                <div className="col"></div>
                <div className="col-sm-10 text-center">
                    {
                        page === 1 ?
                            customer.length ?
                            <div>
                                <table className = "table table-dark table-striped">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>เลขเอกสาร</th>
                                            <th>ชื่อลูกค้า</th>
                                            <th>ครัว</th>
                                            <th>PO</th>
                                            <th>Preview & Print</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            customer.map((val, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{val.order_no}</td>
                                                    <td>{val.customer_name}</td>
                                                    <td>{val.customer_kitchen}</td>
                                                    <td>{val.po}</td>
                                                    <td><button onClick={() => previewClick1(idx)}>Click</button></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p>ไม่มีข้อมูล</p>
                        :
                        page === 2 ?
                        customer.length ?
                            <div>
                                <table className = "table table-primary table-striped">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>เลขเอกสาร</th>
                                            <th>ชื่อลูกค้า</th>
                                            <th>ครัว</th>
                                            <th>PO</th>
                                            <th>Preview & Print</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            customer.map((val, idx) => (
                                                <tr key={idx} className='table-primary'>
                                                    <td>{idx + 1}</td>
                                                    <td>{val.order_no}</td>
                                                    <td>{val.customer_name}</td>
                                                    <td>{val.customer_kitchen}</td>
                                                    <td>{val.po}</td>
                                                    <td><button onClick={() => previewClick2(idx)}>Click</button></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p>ไม่มีข้อมูล</p>
                        :
                        customer.length ?
                            <div>
                                <table className = "table table-dark table-striped">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>ชื่อร้านค้า</th>
                                            <th>Preview & Print</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            support.map((val, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{val.support_name}</td>
                                                    <td><button onClick={() => previewClick3(idx)}>Click</button></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p>ไม่มีข้อมูล</p>
                    }
                </div>
                <div className="col"></div>
            </div>
        </div>
    )
}

export default print1