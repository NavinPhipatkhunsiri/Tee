import React, { useEffect, useRef, useState } from 'react'
import Axios from "axios"
import { useReactToPrint } from 'react-to-print'
import 'bootstrap/dist/css/bootstrap.css'
import Navbar from './components/Navbar'

const preview3 = () => {
    const supportName = useRef('')
    const date = useRef('')
    const [product, setProduct] = useState([])
    const componentRef = useRef()
    const menu = useRef(0)
    
    const printData = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                size: A4;
                margin: 7mm 0mm 17mm 0mm;
            }`,
        documentTitle: 'Data',
    })

    const numData = (pro, proName) => {
        for(let i = 0; i < pro.length; i++) {
            if(pro[i].product_name === proName) {
                return i
            }
        }
        return -1
    }

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const sName = urlParams.get('support_name')
        const date1 = urlParams.get('date')
        // console.log(sName)
        // console.log(date1)
        supportName.current = sName
        date.current = date1
        const loadData = async () => {
            let load = {
                dd: date1,
            }
            const ord1 = await Axios.post('http://localhost:3001/api/getOrderWithDate1', load)
            // customer_kitchen: "qqq", customer_name: "CHI Hotel", customer_no: 5, date: "29-12-2023", no: 1, order_no: "2023000002", ordertype: 2, po: "-", price: 20, product_name: "กระชาย", product_no: 58, qty: 1, support_name: "กู๋สมศักดิ์"
            const ord2 = await Axios.post('http://localhost:3001/api/getOrderWithDate2', load)
            // customer_kitchen: "Beer Garden", customer_name: "THE TWIN TOWERS", customer_no: 4, date: "29-12-2023", no: 1, order_no: "2023000005", ordertype: 1, po: "po555", price: 0, product_name: "aaa", qty: 1, supply_name: "bbb"
            let pro = []
            let count = 0
            // {product_name: '', qty: 0, strQty = '', st: 0}
            for(let i = 0; i < ord1.data.length; i++) {
                if(ord1.data[i].support_name === sName) {
                    count++
                    const num = numData(pro, ord1.data[i].product_name)
                    if(num === -1) {
                        if(ord1.data[i].qty === 0) {
                            pro.push({product_name: ord1.data[i].product_name, qty: ord1.data[i].qty, strQty: ord1.data[i].qty.toString(), st: 1})
                        }
                        else {
                            pro.push({product_name: ord1.data[i].product_name, qty: ord1.data[i].qty, strQty: ord1.data[i].qty.toString(), st: 0})
                        }
                    }
                    else {
                        pro[num].qty += ord1.data[i].qty
                        if(ord1.data[i].qty === 0) {
                            pro[num].strQty += ' + ' + '__'
                            if(pro[num].st === 0) {
                                pro[num].st = 1
                            }
                        }
                        else {
                            pro[num].strQty += ' + ' + ord1.data[i].qty.toString()
                        }
                    }
                }
            }
            for(let i = 0; i < ord2.data.length; i++) {
                if(ord2.data[i].support_name === sName) {
                    count++
                    const num = numData(pro, ord2.data[i].product_name)
                    if(num === -1) {
                        if(ord2.data[i].qty === 0) {
                            pro.push({product_name: ord2.data[i].product_name, qty: ord2.data[i].qty, strQty: ord2.data[i].qty.toString(), st: 1})
                        }
                        else {
                            pro.push({product_name: ord2.data[i].product_name, qty: ord2.data[i].qty, strQty: ord2.data[i].qty.toString(), st: 0})
                        }
                    }
                    else {
                        pro[num].qty += ord2.data[i].qty
                        if(ord2.data[i].qty === 0) {
                            pro[num].strQty += ' + ' + '__'
                            if(pro[num].st === 0) {
                                pro[num].st = 1
                            }
                        }
                        else {
                            pro[num].strQty += ' + ' + ord2.data[i].qty.toString()
                        }
                    }
                }
            }
            setProduct(pro)
            menu.current = count
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
                            <h1>ใบสั่งซื้อ</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <h4>{supportName.current}</h4>
                        </div>
                        <div className="col text-center">
                            <h5>{'วันที่ ' + date.current}</h5>
                        </div>
                    </div>
                </div>
                <table className="table table-striped mx-auto bordered" style={{width: '85%'}}>
                    <thead>
                        <tr>
                            <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>No.</th>
                            <th style={{borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>ชื่อสินค้า</th>
                            <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>จำนวน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            product.map((val, idx) => (
                                <tr key={idx}>
                                    <td style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black'}}>{idx + 1}</td>
                                    <td style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.product_name}</td>
                                    {
                                        val.st === 0 ?
                                            <td className='text-center' style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.strQty + ' = ' + val.qty}</td>
                                        :
                                            <td className='text-center' style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.strQty}</td>

                                    }
                                </tr>
                            ))
                        }
                        <tr>
                        <td colSpan={3} className='text-center' style={{borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}><h5>{'สั่งสินค้ารวม ' + product.length + ' ชนิดสินค้า ' + menu.current + ' รายการ'}</h5></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default preview3