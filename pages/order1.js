import React, { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.css'

const order1 = () => {
    const [customer, setCustomer] = useState([])
    const [customerName, setCustomerName] = useState('')
    const [customerNo, setCustomerNo] = useState('')
    const [product, setProduct] = useState([])
    const [page, setPage] = useState(1)
    const [cusProPrice, setCusProPrice] = useState([])
    const [show, setShow] = useState([])
    const [cusKitchen, setCusKitchen] = useState([])
    const [kitchenName, setKitchenName] = useState('')
    const [typeno, setTypeno] = useState(0)
    const [today, setToday] = useState('')
    const [specialOrder, setSpecialOrder] = useState([])
    const [showSpecialOrder, setShowSpecialOrder] = useState([])
    const [count, setCount] = useState(0)
    const search = useRef('')
    const po = useRef('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllCustomer = await Axios.get('http://localhost:3001/api/getCustomer')
                setCustomer(getAllCustomer.data)
                setCustomerName(getAllCustomer.data[0].fname)
                setCustomerNo(getAllCustomer.data[0].no)
                setSpecialOrder([{product_name: '', supply_name: '', qty: 0, price: 0, row: 0}])
                setShowSpecialOrder([{product_name: '', supply_name: '', qty: 0, price: 0, row: 0}])
                const getAllProduct = await Axios.get('http://localhost:3001/api/getProduct')
                setProduct(getAllProduct.data)
                let cpp = []
                for(let i = 0; i < getAllProduct.data.length; i++) {
                    const dd= {
                        customer_no: getAllCustomer.data[0].no,
                        product_no: getAllProduct.data[i].no,
                    }
                    const num = await Axios.post('http://localhost:3001/api/getPriceWithNo', dd)
                    let d = {customer_no: getAllCustomer.data[0].no, product_no: getAllProduct.data[i].no, product_name: getAllProduct.data[i].fname, oldPrice: 0, price: 0, flag: getAllProduct.data[i].flag, qty: 0, row: i}
                    if(num.data.length > 0) {
                        d.oldPrice = num.data[0].price
                        d.price = num.data[0].price
                    }
                    cpp.push(d)
                }
                setCusProPrice(cpp)
                const r1 = cpp.filter((w) => {
                    return (
                        w.flag === 0
                    );
                });
                setShow(r1);
                const dd1 = {
                    customer_no: getAllCustomer.data[0].no,
                }
                const getAllKitchen = await Axios.post('http://localhost:3001/api/getCustomerSubWithNo', dd1)
                setCusKitchen(getAllKitchen.data)
                setKitchenName(getAllKitchen.data[0].kitchen)
            }
            catch(error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();

        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        setToday(day + '-' + month + '-' + year)
    }, [])

    const customerChange = async (e) => {
        let st = 0
        for(let i = 0; i < cusProPrice.length; i++) {
            if(cusProPrice[i].qty !== 0) {
                console.log("OK1")
                st = 1
                break
            }
        }
        if(st === 0 && specialOrder.length === 1) {
            if(specialOrder[0].product_name !== '' && specialOrder[0].supply_name !== '') {
                console.log("OK2")
                st = 1
            }
        }
        if(st === 1 && e !== customerName) {
            if(confirm("ต้องการจัดเก็บคำสั่งซื้อก่อนเปลี่ยนแปลงลูกค้า")) {
                saveData()
                setPage(1)
                setCustomerName(e)
                po.current.value = ''
                setShow([])
                await delay(100)
                let no = -1
                for(let i = 0; i < customer.length; i++) {
                    if(customer[i].fname === e) {
                        setCustomerNo(customer[i].no)
                        no = customer[i].no
                        break
                    }
                }
                const dd1 = {
                    customer_no: no,
                }
                const getAllKitchen = await Axios.post('http://localhost:3001/api/getCustomerSubWithNo', dd1)
                setCusKitchen(getAllKitchen.data)
                setKitchenName(getAllKitchen.data[0].kitchen)
                search.current.value = ''
                let cpp = []
                for(let i = 0; i < product.length; i++) {
                    const dd= {
                        customer_no: no,
                        product_no: product[i].no,
                    }
                    const num = await Axios.post('http://localhost:3001/api/getPriceWithNo', dd)
                    let d = {customer_no: no, product_no: product[i].no, product_name: product[i].fname, oldPrice: 0, price: 0, flag: product[i].flag, qty: 0, row: i}
                    if(num.data.length > 0) {
                        d.oldPrice = num.data[0].price
                        d.price = num.data[0].price
                    }
                    cpp.push(d)
                }
                setCusProPrice(cpp)
                const r1 = cpp.filter((w) => {
                    return (
                        w.flag === 0
                    );
                });
                setShow(r1);
                setTypeno(0)
            }
        }
        else if(st === 0 && e !== customerName) {
            setPage(1)
            setCustomerName(e)
            po.current.value = ''
            setShow([])
            await delay(100)
            let no = -1
            for(let i = 0; i < customer.length; i++) {
                if(customer[i].fname === e) {
                    setCustomerNo(customer[i].no)
                    no = customer[i].no
                    break
                }
            }
            const dd1 = {
                customer_no: no,
            }
            const getAllKitchen = await Axios.post('http://localhost:3001/api/getCustomerSubWithNo', dd1)
            setCusKitchen(getAllKitchen.data)
            setKitchenName(getAllKitchen.data[0].kitchen)
            search.current.value = ''
            let cpp = []
            for(let i = 0; i < product.length; i++) {
                const dd= {
                    customer_no: no,
                    product_no: product[i].no,
                }
                const num = await Axios.post('http://localhost:3001/api/getPriceWithNo', dd)
                let d = {customer_no: no, product_no: product[i].no, product_name: product[i].fname, oldPrice: 0, price: 0, flag: product[i].flag, qty: 0, row: i}
                if(num.data.length > 0) {
                    d.oldPrice = num.data[0].price
                    d.price = num.data[0].price
                }
                cpp.push(d)
            }
            setCusProPrice(cpp)
            const r1 = cpp.filter((w) => {
                return (
                    w.flag === 0
                );
            });
            setShow(r1);
            setTypeno(0)
        }   
    }

    const kitchenChange = (e) => {
        setKitchenName(e)
    }

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const tabsClick = async (n) => {
        if(n === 1 && page !== 1) {
            setPage(1)
            setShow([])
            await delay(100)
            const r1 = cusProPrice.filter((w) => {
                return (
                    w.flag === 0
                )
            })
            setShow(r1)
        }
        else if(n === 2 && page !== 2) {
            setPage(2)
            setShow([])
            await delay(100)
            const r1 = cusProPrice.filter((w) => {
                return (
                    w.flag === 1
                )
            })
            setShow(r1)
        }
        else if(n === 3 && page !== 3) {
            setPage(3)
            setShowSpecialOrder([])
            await delay(100)
            setShowSpecialOrder(specialOrder)
        }
    }
    const setQty = (row, e) => {
        cusProPrice[row].qty = parseFloat(e)
        console.log(cusProPrice[row])
        searchChange()
    }
    const setPrice = (row, e) => {
        cusProPrice[row].price = parseFloat(e)
        console.log(cusProPrice[row])
        searchChange()
    }
    const searchChange = () => {
        if(search.current.value === '') {
            if(page === 1) {
                const r1 = cusProPrice.filter((w) => {
                    return (
                        w.flag === 0
                    )
                })
                setShow(r1)
            }
            else if(page === 2) {
                const r1 = cusProPrice.filter((w) => {
                    return (
                        w.flag === 1
                    )
                })
                setShow(r1)
            }
            else if(page === 3) {
                //
            }
        }
        else {
            if(page === 1) {
                const r1 = cusProPrice.filter((w) => {
                    return (
                        w.flag === 0 &&
                        w.product_name.toLowerCase().includes(search.current.value.toLowerCase())
                    )
                })
                setShow(r1)
            }
            else if(page === 2) {
                const r1 = cusProPrice.filter((w) => {
                    return (
                        w.flag === 1 &&
                        w.product_name.toLowerCase().includes(search.current.value.toLowerCase())
                    )
                })
                setShow(r1)
            }
            else if(page === 3) {
                //
            }
        }
    }
    const saveData = async () => {
        let st = 0
        for(let i = 0; i < cusProPrice.length; i++) {
            if(cusProPrice[i].qty !== 0) {
                st = 1
                break
            }
        }
        if(st === 0) {
            if(specialOrder[0].product_name !== '' && specialOrder[0].supply_name !== '') {
                st = 1
            }
        }
        if(st === 1) {
            let no = 1
            const date = new Date()
            let year = date.getFullYear()
            const numOrder = await Axios.get('http://localhost:3001/api/getOrderNum')
            if(numOrder.data.length === 1) {
                if(numOrder.data[0].year === year) {
                    no = numOrder.data[0].no + 1
                }
                else {
                    await Axios.post('http://localhost:3001/api/deleteAllOrdernum')
                    await Axios.post('http://localhost:3001/api/resetOrdernum')
                }
            }
            no = String(no).padStart(6, '0')
            for(let i = 0; i < cusProPrice.length; i++) {
                if(cusProPrice[i].qty !== 0) {
                    const dd1 = {
                        order_no: year + '' + no,
                        customer_no: customerNo,
                        customer_name: customerName,
                        customer_kitchen: kitchenName,
                        ordertype: typeno,
                        product_no: cusProPrice[i].product_no,
                        product_name: cusProPrice[i].product_name,
                        price: cusProPrice[i].price,
                        qty: cusProPrice[i].qty,
                        date: today,
                        po: po.current.value === '' ? '-' : po.current.value
                    }
                    await Axios.post('http://localhost:3001/api/saveOrderData', dd1)
                }
            }
            for(let i = 0; i < specialOrder.length; i++) {
                if(specialOrder[i].product_name !== '' && specialOrder[i].supply_name !== '') {
                    const dd1 = {
                        order_no: year + '' + no,
                        customer_no: customerNo,
                        customer_name: customerName,
                        customer_kitchen: kitchenName,
                        ordertype: typeno,
                        product_name: specialOrder[i].product_name,
                        supply_name: specialOrder[i].supply_name,
                        price: specialOrder[i].price,
                        qty: specialOrder[i].qty,
                        date: today,
                        po: po.current.value === '' ? '-' : po.current.value
                    }
                    await Axios.post('http://localhost:3001/api/saveSpecialOrderData', dd1)
                }
            }

            const dd2 = {
                year: year
            }
            await Axios.post('http://localhost:3001/api/plusOrdernum', dd2)
            alert('จัดเก็บคำสั่งซื้อเรียบร้อย')
            setPage(1)
            setShow([])
            search.current.value = ''
            setKitchenName(cusKitchen[0].kitchen)
            setTypeno(0)
            po.current.value = ''
            await delay(100)
            const dd1 = {
                customer_no: no,
            }
            const getAllKitchen = await Axios.post('http://localhost:3001/api/getCustomerSubWithNo', dd1)
            setCusKitchen(getAllKitchen.data)
            setKitchenName(getAllKitchen.data[0].kitchen)
            search.current.value = ''
            let cpp = []
            for(let i = 0; i < product.length; i++) {
                const dd= {
                    customer_no: no,
                    product_no: product[i].no,
                }
                const num = await Axios.post('http://localhost:3001/api/getPriceWithNo', dd)
                let d = {customer_no: no, product_no: product[i].no, product_name: product[i].fname, oldPrice: 0, price: 0, flag: product[i].flag, qty: 0, row: i}
                if(num.data.length > 0) {
                    d.oldPrice = num.data[0].price
                    d.price = num.data[0].price
                }
                cpp.push(d)
            }
            setCusProPrice(cpp)
            const r1 = cpp.filter((w) => {
                return (
                    w.flag === 0
                );
            });
            setShow(r1);
            setTypeno(0)
        }
    }
    const  typeChange = (e) => {
        setTypeno(e)
    }
    const setSpecialP = (row, e) => {
        specialOrder[row].product_name = e
        setSpecialOrder([...specialOrder])
    }
    const setSpecialS = (row, e) => {
        specialOrder[row].supply_name = e
        setSpecialOrder([...specialOrder])
    }
    const setSpecialQ = (row, e) => {
        specialOrder[row].qty = e
        setSpecialOrder([...specialOrder])
    }
    const setSpecialPrice = (row, e) => {
        specialOrder[row].price = e
        setSpecialOrder([...specialOrder])
    }
    const handleKeyDown = async (e) => {
        if(e.key === 'Enter') {
            specialOrder.push({product_name: '', supply_name: '', qty: 0, price: 0, row: specialOrder.length})
            setSpecialOrder([...specialOrder])
            setCount(specialOrder.length - 1)
            setShowSpecialOrder([])
            await delay(100)
            setShowSpecialOrder(specialOrder)
        }
    }
    return (
        <div>
            <Navbar />
            <ul className = "nav nav-tabs" style={{cursor: "pointer", backgroundColor: "lightgray"}}>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => tabsClick(1)}>สั่งซื้อสินค้าปกติ</a>
                </li>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => tabsClick(2)}>สั่งซื้อสินค้าเบล็ดเตล็ด</a>
                </li>
                <li className = "nav-item" style={{border: '1px solid #E0E0E0'}}>
                    <a className = "nav-link" onClick={() => tabsClick(3)}>สั่งซื้อสินค้าพิเศษ</a>
                </li>
            </ul>
            <div className="tableCustomer">
                <div className="row">
                    <div className="col-md-7">
                        <div className="scrollable">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    {
                                        page !== 3 ?
                                        <tr>
                                            <th scope="col" className="col-1" style={{ textAlign: "center" }}>ลำดับ</th>
                                            <th scope="col" className="col-3" style={{ textAlign: "center" }}>รายการ</th>
                                            <th scope="col" className="col-1" style={{ textAlign: "center" }}>หน่วยละ</th>
                                            <th scope="col" className="col-1" style={{ textAlign: "center" }}>จำนวนที่สั่ง</th>
                                        </tr>
                                        : 
                                        <tr>
                                            <th scope="col" className="col-1" style={{ textAlign: "center" }}>ลำดับ</th>
                                            <th scope="col" className="col-2" style={{ textAlign: "center" }}>รายการ</th>
                                            <th scope="col" className="col-2" style={{ textAlign: "center" }}>ร้านค้า</th>
                                            <th scope="col" className="col-1" style={{ textAlign: "center" }}>หน่วยละ</th>
                                            <th scope="col" className="col-1" style={{ textAlign: "center" }}>จำนวนที่สั่ง</th>
                                        </tr>
                                    }
                                    
                                </thead>
                                <tbody>
                                    {
                                        page !== 3 ?
                                        show.map((value, index) => (
                                            <tr className="table-Secondary" key={index}>
                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                <td>{value.product_name}</td>
                                                <td>
                                                    <input style={{ textAlign: "center", width: '100%' }} onChange={(e) => setPrice(value.row, e.target.value)} type="number" defaultValue={value.price}/>
                                                </td>
                                                <td>
                                                    <input style={{ textAlign: "center", width: '100%' }} defaultValue={value.qty} onChange={(e) => setQty(value.row, e.target.value)} type="number" />
                                                </td>
                                            </tr>
                                        )) :
                                        showSpecialOrder.map((value, index) => (
                                            <tr className="table-Secondary" key={index}>
                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                {
                                                    index === count ?
                                                    <td><input style={{ textAlign: "center", width: '100%' }}  type="text" defaultValue={value.product_name} onChange={(e) => setSpecialP(value.row, e.target.value)} onKeyDown={handleKeyDown} autoFocus onFocus={e => e.currentTarget.select()}/></td>
                                                    :
                                                    <td><input style={{ textAlign: "center", width: '100%' }}  type="text" defaultValue={value.product_name} onChange={(e) => setSpecialP(value.row, e.target.value)} onKeyDown={handleKeyDown}/></td>
                                                }
                                                <td><input style={{ textAlign: "center", width: '100%' }}  type="text" defaultValue={value.supply_name} onChange={(e) => setSpecialS(value.row, e.target.value)} onKeyDown={handleKeyDown}/></td>
                                                <td>
                                                    <input style={{ textAlign: "center", width: '100%' }} onChange={(e) => setSpecialPrice(value.row, e.target.value)} type="number" defaultValue={value.price} onKeyDown={handleKeyDown}/>
                                                </td>
                                                <td>
                                                    <input style={{ textAlign: "center", width: '100%' }} defaultValue={value.qty} onChange={(e) => setSpecialQ(value.row, e.target.value)} type="number" onKeyDown={handleKeyDown}/>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col text-center" style={{backgroundColor: 'lightblue'}}>
                        <div className="row text-center pt-3">
                            <div className="col-md-12">
                                วันที่ {today}
                            </div>
                        </div>
                        <div className="row text-center pt-3">
                            <div className="col-md-12">
                                <label>ค้นหาข้อมูล : </label>
                                <br />
                                <input type="text" ref={search} onChange={searchChange} />
                            </div>
                        </div>
                        <br />
                        <div className="row text-center pt-2 pb-2" style={{backgroundColor: 'lightpink'}}>
                            <div className="col-md-12">
                                <label>ชื่อลูกค้า : </label>
                                <br />
                                <select onChange={(e) => customerChange(e.target.value)} value={customerName}>
                                    {
                                        customer.map((value) => (
                                            <option key={value.fname}>{value.fname}</option>
                                        ))
                                    }
                                </select>
                                <br />
                                <label>ครัว : </label>
                                <br />
                                <select onChange={(e) => kitchenChange(e.target.value)} value={kitchenName}>
                                    {
                                        cusKitchen.map((value, idx) => (
                                            <option key={idx}>{value.kitchen}</option>
                                        ))
                                    }
                                </select>
                                <br />
                                <label>การสั่ง : </label>
                                <br />
                                <select value={typeno} onChange={(e) => typeChange(e.target.value)}>
                                    <option value={0}>สั่งปกติ</option>
                                    <option value={1}>สั่งเพิ่ม 1</option>
                                    <option value={2}>สั่งเพิ่ม 2</option>
                                </select>
                            </div>
                        </div>
                        <div className="row text-center pt-3">
                            <div className="col-md-12">
                                <label>P.O. </label>
                                <br />
                                <input type="text" ref={po} />
                            </div>
                            <div className="col-md-12 pt-3">
                                <button onClick={() => saveData()}>บันทึกการสั่งซื้อ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default order1