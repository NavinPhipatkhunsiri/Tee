import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import 'bootstrap/dist/css/bootstrap.css'

const textprint = () => {
    const data = ['สวัสดี',1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    const componentRef = useRef()
    
    const printData = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                size: auto;
                margin: 7mm 17mm 17mm 17mm;
            }`,
        documentTitle: 'employee data',
        // onAfterPrint: () => alert('print success')
    })
    return (
        <>
        <button onClick={printData}>print</button>
            <div ref={componentRef}>
                <table className="table table-striped w-75 mx-auto bordered">
                    <thead>
                        <tr>
                            <th colSpan={2} className='mb-5'>
                                <div className="row">
                                    <div className="col">111 <br /><br /></div>
                                    <div className="col">222</div>
                                    <div className="col">333</div>
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th>No.</th>
                            <th>Num</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((val, idx) => (
                                <tr key={idx}>
                                    <td>{idx}</td>
                                    <td>{val}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default textprint