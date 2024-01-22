import React, { useEffect, useRef, useState } from 'react'
import Axios from "axios"
import Router from 'next/router'
import Navbar from "./components/Navbar"
import 'bootstrap/dist/css/bootstrap.css'

const user1 = () => {
    const [user1, setUser1] = useState([])
    const no = useRef(-1)
    const userRef = useRef('')
    const passRef = useRef('555')
    const [status, setStatus] = useState(0)
    const [oldUser1, setOldUser1] = useState('')
    const [oldPass1, setOldPass1] = useState('')

    useEffect(() => {
        const loadData = async () => {
            const user = await Axios.get('http://localhost:3001/api/getUser')
            setUser1(user.data)
        }
        loadData()
    }, [])

    const editClick = (row) => {
        no.current = user1[row].no
        userRef.current.value = user1[row].user1
        setOldUser1(user1[row].user1)
        passRef.current.value = user1[row].pass1
        setOldPass1(user1[row].pass1)
        setStatus(1)
    }

    const deleteClick = (row) => {
        if(confirm("ต้องการลบข้อมูล")) {
            let load = {
                dd: user1[row].no,
            }
            Axios({
                url: "http://localhost:3001/api/deleteUser",
                method: "post",
                data: load,
            })
            .then(function (response) {
                alert("ลบช้อมูลเรียบร้อย");
                window.location.reload(false);
            })
            .catch(function (error) {
                console.log(error);
            })
        }
    }

    const addClick = () => {
        if(userRef.current.value !== '' && passRef.current.value !== '') {
            let load = {
                dd1: userRef.current.value,
                dd2: passRef.current.value,
            }
            const loadData = async () => {
                const data1 = await Axios.post('http://localhost:3001/api/insertUser', load)
                if(data1.data) {
                    alert("เพิ่มช้อมูลเรียบร้อย")
                    window.location.reload(false)
                }
            }
            loadData()
        }
        else {
            alert('กรุณาใส่ข้อมูลให้ครบ')
        }
    }

    const updateClick = () => {
        if(oldUser1 !== userRef.current.value || oldPass1 !== passRef.current.value) {
            let load = {
                dd1: userRef.current.value,
                dd2: passRef.current.value,
                dd3: no.current,
            }
            const loadData = async () => {
                await Axios.post('http://localhost:3001/api/updateUser', load)
            }
            loadData()
        }
        window.location.reload(false)
    }

    return (
        <div>
            <Navbar />
            <div className='mx-auto mt-4 mb-5' style={{width: '85%'}}>
                <div className='row'>
                    <div className="w-100">
                        <div className="col mx-auto mt-4 mb-5" style={{width: '85%'}}>
                            <div className="row">
                                <div className="col w-100">
                                    <label className='me-5'>Username</label>
                                    <input type="text" ref={userRef}/>
                                </div>
                                <div className="col w-100">
                                    <label className='me-5'>Password</label>
                                    <input type="text" ref={passRef}/>
                                </div>
                                <div className="col w-100">
                                    {
                                        status === 0 ?
                                        <>
                                        <button className='btn btn-info me-1 w-25' onClick={() => addClick()}>Add</button>
                                        <button className='btn btn-secondary ms-1 w-25' disabled>Update</button>
                                        </>
                                        :
                                        <>
                                        <button className='btn btn-secondary me-1 w-25' disabled>เพิ่ม</button>
                                        <button className='btn btn-success ms-1 w-25' onClick={() => updateClick()}>Update</button>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mx-auto mt-4 mb-5' style={{width: '85%'}}>
                {
                    user1.length ? 
                        <div className='w-100'>
                            <table className="table table-striped mx-auto bordered" style={{width: '85%'}}>
                                <thead>
                                    <tr>
                                        <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>No.</th>
                                        <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>User</th>
                                        <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>Password</th>
                                        <th style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black', borderTop: '1px solid black'}}>Option</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        user1.map((val, idx) => (
                                            <tr key={idx}>
                                                <td style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black'}}>{idx + 1}</td>
                                                <td style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.user1}</td>
                                                <td style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>{val.pass1}</td>
                                                <td style={{textAlign: 'center', borderLeft: '1px solid black', borderRight: '1px solid black'}}>
                                                    <button className='btn btn-warning me-1 w-25' onClick={() => editClick(idx)}>แก้ไข</button>
                                                    <button className='btn btn-danger ms-1 w-25' onClick={() => deleteClick(idx)}>ลบ</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    :
                        <h3>ไม่พบข้อมูล</h3>
                }
            </div>
        </div>
    )
}

export default user1