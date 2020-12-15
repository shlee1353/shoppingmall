import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import RadioBox from './Sections/RadioBox';
import CheckBox from './Sections/CheckBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';
import { response } from 'express';

function LandingPage() {
    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(3)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continets: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")

    const { Meta } = Card

    useEffect(() => {
        const body = {
            skip: Skip,
            limit: Limit
        }
        getProducts(body)
    })

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success) {
                    if(body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }

                    setPostSize(response.data.postSize)
                } else {
                    alert("failed to load");
                }
            })
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} key={index}>
            <Card
                cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images}/></a>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />     
            </Card>
        </Col>
    })

    const showFilteredResults = () => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        data.forEach(item => {
            if(item._id === parseInt(value, 10)) {
                array = item.array
            }
        })

        return array;
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}

        newFilters[category] = filters
        if(category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    return (
       <div style={{ width: '75%', margin: '3rem auto' }}>
           <div style={{ textAlign: 'center' }}>
               <h2>Let's Travel Anywhere <Icon type="rocket"/></h2>
           </div>

           <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    <CheckBox 
                        list={continents}
                        handleFilters={filters => handleFilters(filters, "continents")}
                    />
                </Col>
                <Col lg={12} xs={24}>
                    <RadioBox 
                        list={price}
                        handleFilters={filters => handleFilters(filters, "price")}
                    />
                </Col>
           </Row>

            <div style={{ display:'flex', justifyContent:'flex-end', margin: '1rem auto'}}>
                <SearchFeature
                    refreshFunction={updateSearchTerm}
                />
            </div>

            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>

            <br/>
            {PostSize >= Limit && 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
           
       </div>
    )
}

export default LandingPage
