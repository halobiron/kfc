import React from 'react';
import Card from '../../components/Card'
import Layout from '../../components/Layout'

const Product = () => {
    return (
        <Layout>
            <div className='product-wrapper px-3 px-md-0'>
                <div className="lead-text">
                    <h3>THỰC ĐƠN</h3>
                </div>
                <div className="container product-iner pt-5">
                    <div className="row">
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                        <div className="col-md-4 mb-5">
                            <Card />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Product