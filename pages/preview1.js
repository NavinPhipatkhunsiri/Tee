import React, { useEffect, useRef, useState } from 'react'
import Axios from "axios"
import { useReactToPrint } from 'react-to-print'
import 'bootstrap/dist/css/bootstrap.css'
import Navbar from './components/Navbar'

const preview1 = () => {
    const customerName = useRef('')
    const customerKitchen = useRef('')
    const date = useRef('')
    const orderNo = useRef('')
    const po = useRef('')
    const [order, setOrder] = useState([])
    const status = useRef(0)
    const total = useRef(0)
    const count = useRef(-1)
    const componentRef = useRef()
    
    const printData = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                size: A4;
                margin: 7mm 0mm 17mm 0mm;
            }`,
        documentTitle: 'Data',
    })

    const checkOrder = (order1, product_name) => {
        for(let i = 0; i < order1.length; i++) {
            if(order1[i].product_name === product_name) {
                return i
            }
        }
        return -1
    }

    const getSupport = (pro, product_name) => {
        for(let i = 0; i < pro.length; i++) {
            if(pro[i].fname === product_name) {
                return pro[i].support_name
            }
        }
        return ''
    }

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const order_no = urlParams.get('order_no')
        orderNo.current = order_no
        const loadData = async () => {
            let load = {
                dd: order_no,
            }
            const ord1 = await Axios.post('http://localhost:3001/api/getOrderWithOrderNo1', load)
            // customer_kitchen: "qqq", customer_name: "CHI Hotel", customer_no: 5, date: "29-12-2023", no: 1, order_no: "2023000002", ordertype: 2, po: "-", price: 20, product_name: "กระชาย", product_no: 58, qty: 1
            const ord2 = await Axios.post('http://localhost:3001/api/getOrderWithOrderNo2', load)
            // customer_kitchen: "Beer Garden", customer_name: "THE TWIN TOWERS", customer_no: 4, date: "29-12-2023", no: 1, order_no: "2023000005", ordertype: 1, po: "po555", price: 0, product_name: "aaa", qty: 1, supply_name: "bbb"
            const pro = await Axios.get('http://localhost:3001/api/getProductAndName')
            // flag: 0, fname: "กระชาย", no: 58, support_name: "กู๋สมศักดิ์", support_no: 13
            if(ord1.data.length > 0) {
                customerName.current = ord1.data[0].customer_name
                customerKitchen.current = ord1.data[0].customer_kitchen
                date.current = ord1.data[0].date
                po.current = ord1.data[0].po
            }
            else {
                customerName.current = ord2.data[0].customer_name
                customerKitchen.current = ord2.data[0].customer_kitchen
                date.current = ord2.data[0].date
                po.current = ord2.data[0].po
            }
            let order1 = []
            for(let i = 0; i < ord1.data.length; i++) {
                if(count.current < i) {
                    total.current += ord1.data[i].price * ord1.data[i].qty
                    count.current += 1
                }
                const num = checkOrder(order1, ord1.data[i].product_name)
                const sName = getSupport(pro.data, ord1.data[i].product_name)
                if(num === -1) {
                    if(ord1.data[i].price === 0 && ord1.data[i].qty === 0) {
                        status.current = 1
                        order1.push({product_name: ord1.data[i].product_name, support_name: sName, ordertype: ord1.data[i].ordertype, price: ord1.data[i].price, qty: ord1.data[i].qty, strQty: '__', more: 0, st: 1})
                    }
                    else if(ord1.data[i].price === 0 && ord1.data[i].qty !== 0) {
                        status.current = 1
                        order1.push({product_name: ord1.data[i].product_name, support_name: sName, ordertype: ord1.data[i].ordertype, price: ord1.data[i].price, qty: ord1.data[i].qty, strQty: ord1.data[i].qty.toString(), more: 0, st: 1})
                    }
                    else if(ord1.data[i].price !== 0 && ord1.data[i].qty === 0) {
                        status.current = 1
                        order1.push({product_name: ord1.data[i].product_name, support_name: sName, ordertype: ord1.data[i].ordertype, price: ord1.data[i].price, qty: ord1.data[i].qty, strQty: '__', more: 0, st: 1})
                    }
                    else {
                        order1.push({product_name: ord1.data[i].product_name, support_name: sName, ordertype: ord1.data[i].ordertype, price: ord1.data[i].price, qty: ord1.data[i].qty, strQty: ord1.data[i].qty.toString(), more: 0, st: 0})
                    }
                }
                else {
                    if((ord1.data[i].price === 0 || ord1.data[i].qty === 0) && order1[num].st === 0) {
                        order1[num].st = 1
                    }
                    if(order1[num].price !== ord1.data[i].price && ord1.data[i].price !== 0) {
                        order1[num].price = ord1.data[i].price
                    }
                    order1[num].qty += ord1.data[i].qty
                    if(order1[num].more === 0) {
                        order1[num].more = 1
                    }
                    if(ord1.data[i].price === 0) {
                        status.current = 1
                    }
                    if(ord1.data[i].qty === 0) {
                        order1[num].strQty += ' + ' + '__'
                        status.current = 1
                    }
                    else {
                        order1[num].strQty += ' + ' + ord1.data[i].qty.toString()
                    }
                }
            }
            if(ord2.data.length > 0) {
                count.current = -1
            }
            for(let i = 0; i < ord2.data.length; i++) {
                if(count.current < i) {
                    total.current += ord2.data[i].price * ord2.data[i].qty
                    count.current += 1
                }
                const num = checkOrder(order1, ord2.data[i].product_name)
                if(num === -1) {
                    if(ord2.data[i].price === 0 && ord2.data[i].qty === 0) {
                        status.current = 1
                        order1.push({product_name: ord2.data[i].product_name, support_name: ord2.data[i].supply_name, ordertype: ord2.data[i].ordertype, price: ord2.data[i].price, qty: ord2.data[i].qty, strQty: '__', more: 0, st: 1})
                    }
                    else if(ord2.data[i].price === 0 && ord2.data[i].qty !== 0) {
                        status.current = 1
                        order1.push({product_name: ord2.data[i].product_name, support_name: ord2.data[i].supply_name, ordertype: ord2.data[i].ordertype, price: ord2.data[i].price, qty: ord2.data[i].qty, strQty: ord2.data[i].qty.toString(), more: 0, st: 1})
                    }
                    else if(ord2.data[i].price !== 0 && ord2.data[i].qty === 0) {
                        status.current = 1
                        order1.push({product_name: ord2.data[i].product_name, support_name: ord2.data[i].supply_name, ordertype: ord2.data[i].ordertype, price: ord2.data[i].price, qty: ord2.data[i].qty, strQty: '__', more: 0, st: 1})
                    }
                    else {
                        order1.push({product_name: ord2.data[i].product_name, support_name: ord2.data[i].supply_name, ordertype: ord2.data[i].ordertype, price: ord2.data[i].price, qty: ord2.data[i].qty, strQty: ord2.data[i].qty.toString(), more: 0, st: 0})
                    }
                }
                else {
                    if((ord2.data[i].price === 0 || ord2.data[i].qty === 0) && order1[num].st === 0) {
                        order1[num].st = 1
                    }
                    if(order1[num].price !== ord2.data[i].price && ord2.data[i].price !== 0) {
                        order1[num].price = ord2.data[i].price
                    }
                    order1[num].qty += ord2.data[i].qty
                    if(order1[num].more === 0) {
                        order1[num].more = 1
                    }
                    if(ord2.data[i].price === 0) {
                        status.current = 1
                        if(order1.data[num].st === 0) {
                            order1.data[num].st = 1
                        }
                    }
                    if(ord2.data[i].qty === 0) {
                        order1[num].strQty += ' + ' + '__'
                        status.current = 1
                        if(order1.data[num].st === 0) {
                            order1.data[num].st = 1
                        }
                    }
                    else {
                        order1[num].strQty += ' + ' + ord2.data[i].qty.toString()
                    }
                }
            }
            setOrder(order1)
        }
        loadData()
    }, [])
    
    return (
        <>
        <Navbar />
        <div className="row mt-4">
            <div className="col" style={{textAlign: 'center'}}>
                <div className="d-grid">
                    <button onClick={printData} className="btn btn-primary btn-block">print</button>
                </div>
            </div>
        </div>
            <div ref={componentRef}>
                <div className='mx-auto mt-4 mb-5' style={{width: '85%'}}>
                    <div className="row">
                        <div className="col text-center">
                            <h1>ใบเสนอราคาลูกค้า</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <h4>{customerName.current}</h4>
                            <p><b>{'(ครัว ' + customerKitchen.current + ')'}</b></p>
                            <p><b>{'PO : ' + po.current}</b></p>
                        </div>
                        <div className="col text-center">
                            <h5>{'วันที่ ' + date.current}</h5>
                            <p>{'เอกที่เอกสาร : ' + orderNo.current}</p>
                        </div>
                    </div>
                </div>
                <table className="table table-striped mx-auto bordered" style={{width: '85%'}}>
                    <thead>
                        <tr>
                            <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>No.</th>
                            <th style={{borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>ชื่อสินค้า</th>
                            <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>ราคา</th>
                            <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>จำนวน</th>
                            <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>รวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            order.map((val, idx) => (
                                <tr key={idx}>
                                    <td style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black'}}>{idx + 1}</td>
                                    <td style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.product_name}</td>
                                    {
                                        val.price === 0 ?
                                            <td style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black'}}></td>
                                        :
                                            <td style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.price}</td>
                                    }
                                    {
                                        val.more === 0 ?
                                            <td style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.strQty}</td>
                                        :
                                            <td style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.strQty} = {val.qty}</td>
                                    }
                                    {
                                        val.st === 0 ?
                                            <td className='text-center' style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>{Number(val.price * val.qty).toFixed(2)}</td>
                                        :
                                            <td className='text-center' style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}></td>

                                    }
                                </tr>
                            ))
                        }
                        <tr>
                            <td colSpan={4} className='text-center' style={{borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}><h3>ยอดรวม</h3></td>
                            {
                                status.current === 0 ?
                                    <td className='text-center' style={{borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}><h4>{Number(total.current).toFixed(2)}</h4></td>
                                :
                                    <td className='text-center' style={{borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}><h4></h4></td>
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default preview1