import React from 'react'
import { Table } from 'antd';
import reqwest from 'reqwest';

import { Input, Form, } from 'antd';

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

class SearchUIcomponent extends React.Component {
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
        console.log('params:', params);
        this.setState({ loading: true });
        console.log("searchDATA= ", searchDATA)
        reqwest({

            url: `http://localhost:3000/api/v1.0/recipes/search?title=${searchDATA}`,
            method: 'get',
            data: {
            },
            type: 'json',
        }).then(data => {
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


    render() {

        const { getFieldDecorator } = this.props.form;

        return (

            <Form>

                <Search
                    placeholder="input search text"
                    enterButton="Search"
                    size="large"
                    onSearch={value => {
                        this.serachdata(value)
                        console.log(value)
                    }}
                />
                
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

const searchUIcomponent = Form.create({ name: 'horizontal_login' })(SearchUIcomponent);

export default searchUIcomponent;