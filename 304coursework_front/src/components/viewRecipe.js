import React from 'react'
import { Table } from 'antd';
import reqwest from 'reqwest';
import { Redirect } from "react-router"


import { Input, Form, Radio, Button } from 'antd';

const { Search } = Input;
let recipeTitle
let catgagoryTitle

const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 11 },
};

const recipes = [
    {
        title: 'recipesImage',
        dataIndex: 'mainImageURL',
        key: 'mainImageURL',
        render: (record) => 
          // console.log(`localhost:3000/${record}`)
          <img src={record} width="100px" alt="" />
      },
    {
        title: 'recipesTitle',
        dataIndex: 'title',
        width: '20%',
    },
    {
        title: 'recipesSubtitle',
        dataIndex: 'subtitle',
        width: '20%',
    },
    {
        title: 'recipesDescription',
        dataIndex: 'description',
    },
    {
        title: 'recipes Date Created',
        dataIndex: 'DateCreated',
    },
    {
        title: 'recipes Ending',
        dataIndex: 'ending',
    },
];



const ingredients = [

    {
        title: 'ingredients title',
        dataIndex: 'title',
    },
    
    {
        title: 'ingredients description',
        dataIndex: 'description',
    },
    {
        title: 'ingredients Date Created',
        dataIndex: 'DateCreated',
    },
    {
        title: 'ingredients Ending',
        dataIndex: 'ending',
    },
];

const steps = [
    {
        title: 'stepsImage',
        dataIndex: 'mainImageURL',
        key: 'mainImageURL',
        render: (record) => 
          // console.log(`localhost:3000/${record}`)
          <img src={record} width="100px" alt="" />
      },
    
      {
        title: 'steps Orders',
        dataIndex: 'Orders',
    },
    {
        title: 'steps Description',
        dataIndex: 'description',
    },
    {
        title: 'steps DateCreated',
        dataIndex: 'DateCreated',
    },

];

class SearchByCategory extends React.Component {
    state = {
        ingredientsData: [],
        recipeData: [],
        stepsData: [],
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

        reqwest({
            url: `http://localhost:3000/api/v1.0/recipes/viewRecipe?recipeTitle=${recipeTitle}&catgagoryTitle=${catgagoryTitle}`,
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
                ingredientsData: data.Ingredientsdata,
                recipeData: data.recipedata,
                stepsData: data.Stepsdata,
                pagination,
            });
        });
    };

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

            console.log("11111111111111real values = ", values)
            recipeTitle = values.recipeTitle
            catgagoryTitle = values.category
            console.log("11111111111111recipeTitle = ", recipeTitle)
            if (!err)
                console.log('Received values of form: ', values)
            console.log('Received values of catgagoryTitle: ', catgagoryTitle)

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


                    <Form.Item {...formItemLayout} label="recipeTitle">
                        {getFieldDecorator('recipeTitle', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input recipeTitle',
                                },
                            ],
                        })(<Input placeholder="Please inpu recipeTitle" />)}

                    </Form.Item>


                    <Form.Item {...formItemLayout} >
                        <Button type="primary" htmlType="submit" >  search  </Button>
                    </Form.Item>

                </Form>




                <Table
                    columns={recipes}
                    rowKey={record => record.ID}
                    dataSource={this.state.recipeData}
                    loading={this.state.loading}
                />


                <Table
                    columns={ingredients}
                    rowKey={record => record.ID}
                    dataSource={this.state.ingredientsData}
                    loading={this.state.loading}
                />


                <Table
                    columns={steps}
                    rowKey={record => record.ID}
                    dataSource={this.state.stepsData}
                    loading={this.state.loading}
                />


            </Form>

        );
    }
}

const searchByCategory = Form.create({ name: 'horizontal_login' })(SearchByCategory);

export default searchByCategory;