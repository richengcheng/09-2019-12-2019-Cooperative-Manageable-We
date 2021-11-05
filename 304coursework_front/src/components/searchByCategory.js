import React from 'react'
import { Table } from 'antd';
import reqwest from 'reqwest';
import { Redirect } from "react-router"


import { Input, Form, Radio, Button } from 'antd';

const { Search } = Input;
let searchDATA

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 4 },
};




const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        width: '20%',
    },
    {
        title: 'Subtitle',
        dataIndex: 'subtitle',
        width: '20%',
    },
    {
        title: 'Description',
        dataIndex: 'description',
    },
    {
        title: 'Date Created',
        dataIndex: 'DateCreated',
    },
    {
        title: 'Ending',
        dataIndex: 'ending',
    },

  
];

//, search: 'username=' + username,
class SearchByCategory extends React.Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
    };


    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }


    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };


    fetch = (params = {}) => {
        console.log("2222222222222222222222222222")
        console.log('params:', params);
        this.setState({ loading: true });
        console.log("searchDATA= ", searchDATA)
        reqwest({
            url: `http://localhost:3000/api/v1.0/category/searchByCategory?username=${searchDATA}`,
            method: 'get',
            data: {
            },
            type: 'json',
        }).then(data => {
            console.log("333333333333333333333333333")
            const pagination = { ...this.state.pagination };
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = 200;
            this.setState({
                loading: false,
                data: data,
                pagination,
            });
        });
    };


    serachdata = (data) => {
        searchDATA = data
        this.fetch();
    }

    check = () => {
        this.props.form.validateFields(err => {
            if (!err) {
                console.info('success');
            }
        });
    };


    handleSubmit = e => {

        console.log("1111111111111111111111")
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //values= JSON.stringify({ values })
            searchDATA = values.category
            console.log("11111111111111values = ", values.category)
            if (!err)
                console.log('Received values of form: ', values)
            console.log('Received values of form: ', values)

            console.log('searchDATA111: ', searchDATA)
            this.fetch();
        })
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (

            <Form  >

                <Form layout="inline" onSubmit={this.handleSubmit}>

                    <Form.Item  {...formItemLayout} label="searchByCategory">
                        {getFieldDecorator('category', {
                        })(

                            <Radio.Group     >
                                <Radio value="chinese food">chinese food </Radio>
                                <Radio value="english food">english food</Radio>
                                <Radio value="american food">american food </Radio>
                            </Radio.Group>

                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} >
                        <Button type="primary" htmlType="submit" >  search  </Button>
                    </Form.Item>

                </Form>


                <Table
                    columns={columns}
                    rowKey={record => record.ID}
                    dataSource={this.state.data}
                    loading={this.state.loading}
                />

            </Form>

        );
    }
}

const searchByCategory = Form.create({ name: 'horizontal_login' })(SearchByCategory);

export default searchByCategory;
