import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'

function FileUpload(props) {

    const [Images, setImages] = useState([])

    const dropHandler = (files) => {
        let formData = new FormData();

        const config = {
            header: {'content-type': 'multipart/form-data'}
        }

        formData.append("file", files[0])

        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath])
                } else {
                    alert('파일 저장 실패')
                }
            })
    }

    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image)
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)
        setImages(newImages)
    }
    return (
        <div>
            
        </div>
    )
}

export default FileUpload
