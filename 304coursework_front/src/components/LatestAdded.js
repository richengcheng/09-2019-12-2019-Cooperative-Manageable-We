import React from 'react'
import { Table } from 'antd';
import reqwest from 'reqwest';

const columns = [
  {
    title: 'Image',
    dataIndex: 'mainImageURL',
    key: 'mainImageURL',
    render: (record) => <img src={record} width="100px" alt="" />
  },
  {
    title: 'Title',
    dataIndex: 'title',
    width: '20%',
    render: (text, record) => <a href={"/NutritionValue?recipeId="+`${record.ID}`} >{text}</a>
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
    title: 'Ending',
    dataIndex: 'ending',
  },
  {
    title: 'Date Created',
    dataIndex: 'DateCreated',
  },
  
];

class LatestAdded extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
  };

  componentDidMount() {
    this.fetch();
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
    reqwest({
      url: 'http://localhost:3000/api/v1.0/recipes/latest',
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

  render() {
    return (
      <Table
        columns={columns}
        rowKey={record => record.ID}
        dataSource={this.state.data}
        loading={this.state.loading}
      />
    );
  }
}

export default LatestAdded;