import React, { useEffect, useRef, useState } from "react"
import Axios from "axios"
import Router from 'next/router'
import Navbar from "./components/Navbar"
import 'bootstrap/dist/css/bootstrap.css'

const product4 = () => {
    const [product, setProduct] = useState([])
    const [customer, setCustomer] = useState([])
    const [customerName, setCustomerName] = useState('')
    const [customerNo, setCustomerNo] = useState('')
    const [proSelect, setProSelect] = useState('')
    const [cusProPrice, setCusProPrice] = useState([])
    const [customerName1, setCustomerName1] = useState('')
    const [customerNo1, setCustomerNo1] = useState('')
    const [show, setShow] = useState([])
    const [row, setRow] = useState(-1)
    const price = useRef('')
    const search = useRef('')


    const [cusSelect, setCusSelect] = useState('')
    const [original, setOriginal] = useState([])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await Axios.get('http://localhost:3001/api/getProduct')
                setProduct(res1.data);

                const res2 = await Axios.get('http://localhost:3001/api/getCustomer')
                setCustomer(res2.data)
            }
            catch(error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    const onMenuClick = (menu) => {
        if(menu === 1) {
            Router.push({
                pathname: '/product1',
            })
        }
        else if(menu === 2) {
            Router.push({
                pathname: '/product2',
            })
        }
        else if(menu === 3) {
            Router.push({
                pathname: '/product3',
            })
        }
        else if(menu === 4) {
            Router.push({
                pathname: '/product4',
            })
        }
    }

    const customerChange = async (e) => {
        if(e !== "") {
            setCustomerName(e)
            const r1 = customer.filter((w) => {
                return (
                    w.fname === e
                )
            })
            setCustomerNo(r1[0].no)
            setProSelect('');
            price.current.value = ''
            setRow(-1);
            setCustomerName1("")
            setShow([])
            let cpp = []
            for(let i = 0; i < product.length; i++) {
                const dd1 = {
                    customer_no: r1[0].no,
                    product_no: product[i].no,
                }
                const num = await Axios.post('http://localhost:3001/api/getPriceWithNo', dd1)
                let d = {customer_no: r1[0].no, product_no: product[i].no, product_name: product[i].fname, oldPrice: 0, price: 0, flag: product[i].flag, qty: 0, row: i}
                if(num.data.length > 0) {
                    d.oldPrice = num.data[0].price
                    d.price = num.data[0].price
                }
                cpp.push(d)
            }
            setCusProPrice(cpp)
            await delay(100)
            setShow(cpp)
            //console.log(cpp)
        }
        else {
            setCustomerName(e)
            setCustomerNo("")
            setProSelect('');
            price.current.value = ''
            setCusProPrice([])
            setShow([])
        }
    }

    const customer1Change = (e) => {
        setCustomerName1(e)
        //console.log(e)
        const r1 = customer.filter((w) => {
            return (
                w.fname === e
            )
        })
        setCustomerNo1(r1[0].no)
    }

    const tableClick = (r) => {
        // console.log(show[r])
        // console.log(cusProPrice[show[r].row])
        setProSelect(show[r].product_name);
        setRow(show[r].row);
        price.current.value = cusProPrice[show[r].row].price;
    }

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    )

    const searchChange = async () => {
        setShow([])
        await delay(100)
        if(search.current.value === '') {
            setShow(cusProPrice);
        }
        else {
            const results1 = cusProPrice.filter((w) => {
                return (
                    w &&
                    w.product_name.toLowerCase().includes(search.current.value.toLowerCase())
                );
            });
            setShow(results1);
        }
    }
    
    const productChange = async (e) => {
        setProSelect(e);
        if(cusProPrice.length > 0) {
            if(e === '') {
                setShow([])
                await delay(100)
                price.current.value = ''
                setShow(cusProPrice)
            }
            else {
                setShow([])
                const results1 = cusProPrice.filter((w) => {
                    return (
                        w &&
                        w.product_name.toLowerCase() === e.toLowerCase()
                    )
                })
                await delay(100)
                setShow(results1)
                price.current.value = results1[0].price
            }
        }
    }

    const inputChange = (idx, e) => {
        // console.log(idx + " " + e)
        // console.log(show[idx])
        // console.log(show[idx].row)
        // console.log(cusProPrice[show[idx].row])
        cusProPrice[show[idx].row].price = parseInt(e)
        setCusProPrice([...cusProPrice])
        price.current.value = parseInt(e)
    }

    const updateClick = async () => {
        let st = 0
        for(let i = 0; i < cusProPrice.length; i++) {
            if(cusProPrice[i].oldPrice !== cusProPrice[i].price) {
                st = 1
                break
            }
        }
        if(st === 1) {
            for(let i = 0; i < cusProPrice.length; i++) {
                if(cusProPrice[i].oldPrice !== cusProPrice[i].price) {
                    if(cusProPrice[i].oldPrice === 0) {
                        const dd1 = {
                            customer_no: customerNo,
                            product_no: cusProPrice[i].product_no,
                            price: cusProPrice[i].price,
                        }
                        //console.log(dd1)
                        const rr = await Axios.post('http://localhost:3001/api/insertCustomer_Product_Price', dd1)
                    }
                    else {
                        const dd1 = {
                            customer_no: customerNo,
                            product_no: cusProPrice[i].product_no,
                            price: cusProPrice[i].price,
                        }
                        //console.log(dd1)
                        const rr = await Axios.post('http://localhost:3001/api/updateCustomer_Product_Price', dd1)
                    }
                }
            }
            alert('แก้ไขเรียบร้อย')
            setProSelect('')
            price.current.value = ''
            setCustomerName1('')
            setCustomerNo1('')
            setRow(-1)
            search.current.value = ''
            setShow([])
            await delay(100)
            let cpp = []
            for(let i = 0; i < product.length; i++) {
                const dd1 = {
                    customer_no: customerNo,
                    product_no: product[i].no,
                }
                const num = await Axios.post('http://localhost:3001/api/getPriceWithNo', dd1)
                let d = {customer_no: customerNo, product_no: product[i].no, product_name: product[i].fname, oldPrice: 0, price: 0, flag: product[i].flag, qty: 0, row: i}
                if(num.data.length > 0) {
                    d.oldPrice = num.data[0].price
                    d.price = num.data[0].price
                }
                cpp.push(d)
            }
            setCusProPrice(cpp)
            setShow(cpp)
        }
    }

    const copyClick = async () => {
        const results1 = cusProPrice.filter((w) => {
            return (
                w &&
                w.price !== 0
            );
        })
        if(results1.length) {
            for(let i = 0; i < results1.length; i++) {
                const dd1 = {
                    customer_no: customerNo1,
                    product_no: results1[i].product_no,
                }
                const num = await Axios.post('http://localhost:3001/api/getPriceWithNo', dd1)
                if(num.data.length) {
                    const dd1 = {
                        customer_no: customerNo1,
                        product_no: results1[i].product_no,
                        price: results1[i].price,
                    }
                    //console.log(dd1)
                    const rr = await Axios.post('http://localhost:3001/api/updateCustomer_Product_Price', dd1)
                }
                else {
                    const dd1 = {
                        customer_no: customerNo1,
                        product_no: results1[i].product_no,
                        price: results1[i].price,
                    }
                    //console.log(dd1)
                    const rr = await Axios.post('http://localhost:3001/api/insertCustomer_Product_Price', dd1)
                }
            }
            alert('สำเนาราคาเรียบร้อย')
            setProSelect('')
            price.current.value = ''
            search.current.value = ''
            setRow(-1)
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
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="row pt-2">
                                <div className="col-sm-2 text-end">
                                    <label>ชื่อลูกค้า :</label>
                                </div>
                                <div className="col-sm-3 text-start">
                                    <select className="w-100" value={customerName} onChange={(e) => customerChange(e.target.value)} >
                                        <option value="" key={-1}></option>
                                            {
                                                customer.map((value) => (
                                                    <option value={value.fname} key={value.no}>{value.fname}</option>
                                                ))
                                            }
                                    </select>
                                </div>
                            </div>
                            <div className="row pt-2 pb-2">
                                <div className="col-sm-2 text-end">
                                    <label>ชื่อสินค้า :</label>
                                </div>
                                <div className="col-sm-3 text-start">
                                    <select className="w-100" value={proSelect} onChange={(e) => productChange(e.target.value)} >
                                        <option value="" key={-1}></option>
                                            {
                                                product.map((value) => (
                                                    <option value={value.fname} key={value.no}>{value.fname}</option>
                                                ))
                                            }
                                    </select>
                                </div>
                                <div className="col-sm-1 text-end">
                                    <label>ราคา :</label>
                                </div>
                                <div className="col-sm-1 text-end">
                                    <input className="text-center" type="number" ref={price} disabled />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6" style={{backgroundColor: "blue"}}>
                            <div className="row pt-2">
                                <div className="col-sm-8">
                                    <label style={{color: 'white'}}>คัดลอกราคาสินค้าปัจจุบันไปยัง</label>
                                </div>
                            </div>
                            <div className="row pt-1 pr-6">
                                <div className="col">
                                    <select value={customerName1} onChange={(e) => customer1Change(e.target.value)} >
                                        <option value="" key={-1}></option>
                                        {
                                            customer.map((value) => (
                                                <option value={value.fname} key={value.no}>{value.fname}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col">
                                    {
                                        customerName1 !== '' && customerName !== '' && row === -1 && (customerName1 !== customerName) ?
                                        <button onClick={() => copyClick()}>
                                            <img src="icons8-correct-15.png" alt="" /> &nbsp;
                                            OK
                                        </button>
                                        :
                                        <button disabled style={{backgroundColor: '#C0C0C0'}}>
                                            <img src="icons8-correct-15.png" alt="" /> &nbsp;
                                            OK
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tableCustomer">
                    <div className="row">
                        <div className="col-sm-7">
                            <div className="scrollable">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-1 text-center">ลำดับ</th>
                                            <th scope="col" className="col-4 text-center">รายการสินค้า</th>
                                            <th scope="col" className="col-1 text-center">ราคาต่อหน่วย</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            show.map((value, index) => (
                                                <tr className="table-Secondary" key={index} onClick={() => tableClick(index)}>
                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                    <td>{value.product_name}</td>
                                                    <td>
                                                        <input className="text-center" type="number" onChange={(e) => inputChange(index, e.target.value)} defaultValue={value.price} />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/*  */}
                        <div className="col pt-2 pb-2" style={{backgroundColor: "lightblue", textAlign: "center"}}>
                            <label><h3>ค้นหา</h3></label>
                            <br />
                            <input type="text" ref={search} onChange={searchChange} />
                            <br /><br />
                            <button onClick={updateClick}>บันทึก</button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default product4