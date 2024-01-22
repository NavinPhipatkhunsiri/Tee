import React, { useRef } from 'react'
import Axios from "axios"
import Router from 'next/router';
import 'bootstrap/dist/css/bootstrap.css'

const login = () => {
    const user1 = useRef('')
    const pass1 = useRef('')
    const buttonClick = async () => {
        //console.log(user1.current.value + " " + pass1.current.value)
        const dd = {
            user1: user1.current.value,
            pass1: pass1.current.value,
        }
        const num = await Axios.post('http://localhost:3001/api/getUser', dd)
        if(num.data.length) {
            sessionStorage.setItem('uname', num.data[0].user1)
            sessionStorage.setItem('st', num.data[0].st)
            Router.push({
                pathname: '/'
            })
        }
        else {
            alert('ไม่พบข้อมูล')
            user1.current.value = ''
            pass1.current.value = ''
        }
    }

    const handleKeyDown = async (e) => {
        if(e.key === 'Enter') {
            buttonClick()
        }
    }

    return (
        <div style={{textAlign: 'center'}}>
            <br />
            <div className="row">
                <div className="col"></div>
                <div className="col-sm-3">
                    <h1>Login</h1>
                    <div style={{width: '100%', backgroundColor: 'lightblue', marginTop: '50px'}}>
                        <label style={{marginTop: '50px'}}>Username</label>
                        <br />
                        <input type="text" style={{marginTop: '10px', width: '60%', textAlign: 'center'}} ref={user1} onKeyDown = {handleKeyDown}/>
                        <br />
                        <label style={{marginTop: '10px'}}>Password</label>
                        <br />
                        <input type="password" style={{marginTop: '10px', width: '60%', textAlign: 'center'}} ref={pass1} onKeyDown = {handleKeyDown}/>
                        <br />
                        <button style={{marginTop: '30px', marginBottom: '50px', width: '60%'}} onClick={() => buttonClick()}>Login</button>
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </div>
    )
}

export default login