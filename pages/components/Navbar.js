import React, { useEffect } from 'react'
import Router from 'next/router';

const Navbar = () => {

    useEffect(() => {
        if(sessionStorage.getItem('uname')) {
            //alert('OK')
        }
        else {
            Router.push({
                pathname: '/login'
            })
        }
    }, [])

    const onMenuClick = (menu) => {
        if(menu === 1) {
            Router.push({
                pathname: '/order1',
            });
        }
        else if(menu === 2) {
            Router.push({
                pathname: '/product1',
            });
        }
        else if(menu === 3) {
            Router.push({
                pathname: '/customer1',
            });
        }
        else if(menu === 4) {
            Router.push({
                pathname: '/print1',
            });
        }
        else if(menu === 5) {
            Router.push({
                pathname: '/user1',
            });
        }
    }
    return (
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="btn-group" style={{width: '100%'}}>
                        <button type="button" className="btn btn-secondary" id='Navbar_btn-icon' style={{width: '20%'}} onClick={() => onMenuClick(1)}>
                            <img src="icons8-purchase-30.png" alt="" />
                            <div>ป้อนสั่งซื้อ</div>
                        </button>
                        <button type="button" className="btn btn-secondary" id='Navbar_btn-icon' style={{width: '20%', borderLeft: '3px solid white'}} onClick={() => onMenuClick(2)}>
                            <img src="icons8-save-30.png" alt="" />
                            <div>รายการสินค้า</div>
                        </button>
                        <button type="button" className="btn btn-secondary" id='Navbar_btn-icon' style={{width: '20%', borderLeft: '3px solid white'}} onClick={() => onMenuClick(3)}>
                            <img src="icons8-reception-30.png" alt="" /> <br />
                            <div>ข้อมูลลูกค้า</div>
                        </button>
                        <button type="button" className="btn btn-secondary" id='Navbar_btn-icon' style={{width: '20%', borderLeft: '3px solid white'}} onClick={() => onMenuClick(4)}>
                            <img src="icons8-printer-30.png" alt="" /> <br />
                            <div>พิมพ์รายการ</div>
                        </button>
                        <button type="button" className="btn btn-secondary" id='Navbar_btn-icon' style={{width: '20%', borderLeft: '3px solid white'}} onClick={() => onMenuClick(5)}>
                            <img src="icons8-user-30.png" alt="" /> <br />
                            <div>ผู้ใช้งาน</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar